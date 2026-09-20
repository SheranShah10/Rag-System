"use client";

import { useState } from "react";
import ThreeCanvas from "@/components/ThreeCanvas";
import UploadZone from "@/components/UploadZone";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const [hasUploaded, setHasUploaded] = useState(false);

  return (
    <main className="min-h-screen font-[family-name:var(--font-geist-sans)] flex flex-col items-center justify-center p-8 relative">
      <ThreeCanvas />
      
      <div className="relative z-10 w-full flex flex-col items-center">
        <h1 className="text-5xl font-bold tracking-tight text-white mb-2 text-center drop-shadow-lg">
          Insight<span className="text-blue-500">AI</span>
        </h1>
        <p className="text-white/60 mb-12 text-center max-w-md">
          Upload any PDF document and get instant, intelligent answers powered by Retrieval-Augmented Generation.
        </p>

        {!hasUploaded ? (
          <UploadZone onUploadComplete={() => setHasUploaded(true)} />
        ) : (
          <ChatInterface />
        )}
      </div>
    </main>
  );
}
