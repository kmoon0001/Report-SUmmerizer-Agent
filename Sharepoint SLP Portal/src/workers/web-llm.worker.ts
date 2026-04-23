import { WebWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

// This handler intercepts messages from the main thread and routes them to the WebGPU engine
const handler = new WebWorkerMLCEngineHandler();

self.onmessage = (msg: MessageEvent) => {
  handler.onmessage(msg);
};
