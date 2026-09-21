import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// Ensure we don't recreate the vector store on every hot reload in Next.js development
const globalForVectorStore = global as unknown as {
  vectorStore: MemoryVectorStore | undefined;
};

// We will initialize the embeddings using the Gemini API Key
// Make sure GEMINI_API_KEY is in your .env.local file
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-2", // Gemini's current embedding model
});

export const getVectorStore = () => {
  if (!globalForVectorStore.vectorStore) {
    globalForVectorStore.vectorStore = new MemoryVectorStore(embeddings);
  }
  return globalForVectorStore.vectorStore;
};
