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
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
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
    <div ref={containerRef} className="w-full max-w-2xl mx-auto mt-20 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
      <div 
        className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 flex flex-col items-center justify-center gap-4 cursor-pointer
          ${isDragging ? "border-blue-400 bg-blue-500/10" : "border-white/20 hover:border-white/40 hover:bg-white/5"}
          ${success ? "border-green-400 bg-green-500/10" : ""}
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
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
            <p className="text-blue-400 font-medium tracking-wide">Processing Document...</p>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="w-12 h-12 text-green-400" />
            <p className="text-green-400 font-medium tracking-wide">Ready to Chat!</p>
          </div>
        ) : (
          <>
            <div className="p-4 rounded-full bg-white/5">
              <UploadCloud className="w-8 h-8 text-white/70" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Upload a Document</h3>
              <p className="text-white/50 text-sm">Drag and drop a PDF file here, or click to browse</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
