// Use Vite's worker import syntax
const worker = new Worker(new URL('../workers/pdf-worker.ts', import.meta.url), { type: 'module' });

let messageId = 0;
const pendingPromises = new Map<number, { resolve: (value: string) => void, reject: (reason?: any) => void }>();

worker.onmessage = (e: MessageEvent) => {
  const { id, success, text, error } = e.data;
  const promiseHandlers = pendingPromises.get(id);
  
  if (promiseHandlers) {
    if (success) {
      promiseHandlers.resolve(text);
    } else {
      promiseHandlers.reject(new Error(error));
    }
    pendingPromises.delete(id);
  }
};

export async function extractTextFromPdf(base64Data: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const id = messageId++;
    pendingPromises.set(id, { resolve, reject });
    worker.postMessage({ id, base64Data });
  });
}
