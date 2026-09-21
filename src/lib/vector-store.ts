import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// Ensure we don't recreate the vector store on every hot reload in Next.js development
const globalForVectorStore = global as unknown as {
  vectorStore: MemoryVectorStore | undefined;
};

export const getVectorStore = () => {
  if (!globalForVectorStore.vectorStore) {
    // Initialize embeddings lazily so it doesn't crash Next.js build-time route collection
    // Pass the specific Vercel environment variable since Langchain looks for GOOGLE_API_KEY by default
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "gemini-embedding-2",
      apiKey: process.env.GOOGLE_GENAI_API_KEY || "dummy-key-for-build",
    });
    
    globalForVectorStore.vectorStore = new MemoryVectorStore(embeddings);
  }
  return globalForVectorStore.vectorStore;
};
