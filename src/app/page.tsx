"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import ThreeCanvas from "@/components/ThreeCanvas";
import UploadZone from "@/components/UploadZone";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const [hasUploaded, setHasUploaded] = useState(false);

  return (
    <main className="min-h-screen font-[family-name:var(--font-geist-sans)] flex flex-col items-center justify-center p-8 relative overflow-hidden selection:bg-indigo-500/30">
      
      {/* GitHub Star Button */}
      <a 
        href="https://github.com/SheranShah10/Rag-System" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/80 hover:text-white transition-all backdrop-blur-md shadow-lg hover:shadow-indigo-500/20 group"
      >
        <Star className="w-5 h-5 group-hover:scale-110 transition-transform text-yellow-400/80 group-hover:text-yellow-400" />
        <span className="text-sm font-medium tracking-wide">Star on GitHub</span>
      </a>

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
