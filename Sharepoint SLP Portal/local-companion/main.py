from fastapi import FastAPI, UploadFile, File, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import requests
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.llms import LlamaCpp
from langchain.chains import RetrievalQA
from sentence_transformers import CrossEncoder

# Security: Simple API Key check
API_KEY = os.environ.get("LOCAL_API_KEY", "super-secret-key")

# Configure Local LLM
MODEL_DIR = "models"
MODEL_FILENAME = "phi-3-mini-4k-instruct.Q4_K_M.gguf"
MODEL_PATH = os.path.join(MODEL_DIR, MODEL_FILENAME)
MODEL_URL = "https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct.Q4_K_M.gguf"

# Reranker model
reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

def download_model():
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)
    if not os.path.exists(MODEL_PATH):
        print(f"Downloading model to {MODEL_PATH}...")
        try:
            response = requests.get(MODEL_URL, stream=True)
            response.raise_for_status()
            with open(MODEL_PATH, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            print("Download complete.")
        except Exception as e:
            print(f"Download failed: {e}")
            raise

# Ensure model exists before starting
download_model()

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# ChromaDB setup
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vector_db = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)

# Initialize LLM
try:
    llm = LlamaCpp(
        model_path=MODEL_PATH,
        n_ctx=2048,
        n_threads=4,
        temperature=0.2,
        verbose=False
    )
except Exception as e:
    print(f"Failed to initialize LLM: {e}")
    llm = None

@app.get("/health")
async def health_check():
    return {"status": "ok", "model_loaded": os.path.exists(MODEL_PATH)}

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...), x_api_key: str = Header(None)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
        
    try:
        doc_id = os.urandom(16).hex()
        temp_path = f"temp_{doc_id}.pdf"
        with open(temp_path, "wb") as f:
            f.write(await file.read())
            
        loader = PyPDFLoader(temp_path)
        documents = loader.load()
        text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        docs = text_splitter.split_documents(documents)
        
        for doc in docs:
            doc.metadata["doc_id"] = doc_id
            
        vector_db.add_documents(docs)
        
        os.remove(temp_path)
        return {"id": doc_id, "name": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat-with-doc")
async def chat_with_doc(doc_id: str, query: str, x_api_key: str = Header(None)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    if not llm:
        raise HTTPException(status_code=503, detail="LLM not initialized")
        
    try:
        # 1. Retrieve more chunks than needed for reranking
        retriever = vector_db.as_retriever(
            search_kwargs={"k": 5, "filter": {"doc_id": doc_id}}
        )
        docs = retriever.get_relevant_documents(query)
        
        # 2. Rerank
        pairs = [(query, doc.page_content) for doc in docs]
        scores = reranker.predict(pairs)
        
        # Sort docs by score
        scored_docs = sorted(zip(docs, scores), key=lambda x: x[1], reverse=True)
        top_docs = [doc for doc, score in scored_docs[:2]]
        
        # 3. Generate
        qa_chain = RetrievalQA.from_chain_type(llm, retriever=lambda q: top_docs)
        response = qa_chain.invoke({"query": query})
        
        return {"response": response["result"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
