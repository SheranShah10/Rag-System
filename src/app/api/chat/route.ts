import { NextRequest, NextResponse } from "next/server";
import { getVectorStore } from "@/lib/vector-store";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const vectorStore = getVectorStore();
    const results = await vectorStore.similaritySearch(query, 4);
    
    const context = results.map(r => r.pageContent).join("\n\n---\n\n");

    const prompt = `You are a helpful AI assistant. Use the following context extracted from uploaded documents to answer the user's question. If you don't know the answer based on the context, say so. Do not make up information.

Context:
${context}

Question:
${query}

Answer:`;

    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY,
    });
    
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              controller.enqueue(new TextEncoder().encode(chunk.text));
            }
          }
        } catch (e) {
          console.error("Stream error:", e);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked'
      },
    });

  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
