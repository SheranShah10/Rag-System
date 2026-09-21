"use client";

import { useState } from "react";
import ThreeCanvas from "@/components/ThreeCanvas";
import UploadZone from "@/components/UploadZone";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const [hasUploaded, setHasUploaded] = useState(false);

  return (
    <main className="min-h-screen font-[family-name:var(--font-geist-sans)] flex flex-col items-center justify-center p-8 relative overflow-hidden selection:bg-indigo-500/30">
      <ThreeCanvas />
      
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center pt-10">
        {!hasUploaded && (
          <div className="text-center mb-12 flex flex-col items-center">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
              <span className="text-sm font-medium text-white/80 tracking-wide">Next-Gen Document Intelligence</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 mb-6 drop-shadow-2xl">
              Insight<span className="text-indigo-500">AI</span>
            </h1>
            <p className="text-lg text-white/50 max-w-xl mx-auto font-light leading-relaxed">
              Experience the future of reading. Upload complex documents and let reasoning-based AI extract precise, verifiable answers instantly.
            </p>
          </div>
        )}

        <div className="w-full flex justify-center w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
          {!hasUploaded ? (
            <UploadZone onUploadComplete={() => setHasUploaded(true)} />
          ) : (
            <ChatInterface onReset={() => setHasUploaded(false)} />
          )}
        </div>
      </div>
    </main>
  );
}
