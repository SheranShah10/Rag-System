"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function ChatInterface() {
  const [messages, setMessages] = useState<{role: "user" | "ai", text: string}[]>([
    { role: "ai", text: "Neural mapping complete. I am ready to answer your questions based on the uploaded document." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(containerRef.current, {
      y: 40,
      scale: 0.95,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      setMessages(prev => [...prev, { role: "ai", text: "" }]);
      
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage })
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text += chunk;
          return newMessages;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = "System error: Neural synthesis failed during this request.";
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto h-[75vh] flex flex-col bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2rem] overflow-hidden mt-2 relative group">
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-indigo-500/10 blur-[100px] pointer-events-none"></div>

      <div className="bg-black/20 border-b border-white/10 px-6 py-4 flex items-center justify-between z-10 backdrop-blur-md">
        <div className="flex items-center gap-3 text-sm font-medium text-white/90">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>Secure AI Session</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-xs text-white/50 tracking-wider uppercase font-semibold">Online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 z-10 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl border ${msg.role === "user" ? "bg-white/10 border-white/20 text-white" : "bg-indigo-500/20 border-indigo-500/30 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]"}`}>
              {msg.role === "user" ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            
            <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} max-w-[80%]`}>
              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1.5 font-semibold">{msg.role === "user" ? "You" : "InsightAI"}</span>
              <div className={`text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-2xl ${msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-white/5 border border-white/10 text-white/90 rounded-tl-sm"}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 flex-row">
            <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1.5 font-semibold">InsightAI</span>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75" />
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-5 bg-black/30 border-t border-white/10 z-10 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto relative group/form">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the document..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all focus:ring-4 ring-indigo-500/10"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white px-6 py-4 rounded-xl transition-all flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
