"use client";
import { useState, useRef } from "react";
import { UploadCloud, File, CheckCircle } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function UploadZone({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from(containerRef.current, {
      y: 40,
      scale: 0.95,
      opacity: 0,
      duration: 1,
      ease: "elastic.out(1, 0.7)",
    });
  }, { scope: containerRef });

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      await uploadFile(file);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onUploadComplete();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto p-1 rounded-[2rem] bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
      {/* Animated glow background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl -z-10"></div>
      
      <div 
        className={`relative border-2 border-dashed rounded-[1.8rem] p-16 transition-all duration-500 flex flex-col items-center justify-center gap-6 cursor-pointer bg-black/20
          ${isDragging ? "border-indigo-400 bg-indigo-500/10 scale-[1.02]" : "border-white/20 hover:border-white/40 hover:bg-white/5"}
          ${success ? "border-green-400 bg-green-500/10 scale-[1.02]" : ""}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept="application/pdf" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          onChange={handleChange}
          disabled={isUploading || success}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center gap-5 animate-pulse">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
              <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-purple-500/30 border-b-purple-500 animate-spin reverse" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
            <p className="text-indigo-300 font-medium tracking-wide">Synthesizing Document...</p>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative p-2 rounded-full bg-green-500/20">
              <CheckCircle className="w-14 h-14 text-green-400" />
            </div>
            <p className="text-green-400 font-medium tracking-wide">Document Neural Mapping Complete!</p>
          </div>
        ) : (
          <>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-lg shadow-black/50 group-hover:-translate-y-2 transition-transform duration-300">
              <UploadCloud className="w-10 h-10 text-white/80" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-white mb-2">Initialize Upload</h3>
              <p className="text-white/50 text-sm">Drag and drop your PDF here, or click to browse</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
