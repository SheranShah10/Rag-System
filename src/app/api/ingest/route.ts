import { NextRequest, NextResponse } from "next/server";
import { getVectorStore } from "@/lib/vector-store";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// Use require because it's an external CommonJS package
const pdf = require("pdf-parse");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdf(buffer);
    const text = data.text;

    if (!text) {
      return NextResponse.json({ error: "Could not extract text from PDF" }, { status: 400 });
    }

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    const docs = await textSplitter.createDocuments([text], [{ source: file.name }]);
    
    const vectorStore = getVectorStore();
    await vectorStore.addDocuments(docs);

    return NextResponse.json({ success: true, chunks: docs.length });
  } catch (error: any) {
    console.error("Ingest error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
