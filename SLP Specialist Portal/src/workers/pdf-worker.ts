import * as pdfjsLib from 'pdfjs-dist';

// Set worker source to a CDN for simplicity in this environment
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

self.onmessage = async (e: MessageEvent) => {
  const { base64Data, id } = e.data;
  try {
    // Remove data URI prefix if present
    const base64 = base64Data.replace(/^data:application\/pdf;base64,/, '');
    
    // Convert base64 to Uint8Array
    const binaryString = self.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ data: bytes });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // Iterate through pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += `Page ${i}:\n${pageText}\n\n`;
    }
    
    self.postMessage({ id, success: true, text: fullText });
  } catch (error: any) {
    self.postMessage({ id, success: false, error: error.message || 'Failed to extract text from PDF' });
  }
};
