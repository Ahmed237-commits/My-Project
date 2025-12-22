"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaUser, FaPaperPlane, FaTimes, FaCommentDots } from "react-icons/fa";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{
    time: string;
    from: "user" | "bot";
    text: string;
  }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Add user message to UI immediately
    setMessages((prev) => [...prev, { from: "user", text: userMessage, time: timestamp }]);
    setInput("");
    setLoading(true);

    try {
      // 🚀 CHANGED: Fetch directly from your Node.js/Express Backend
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.reply || "Sorry, I couldn't generate a response.";
      const botTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      // Add bot message
      setMessages((prev) => [...prev, { from: "bot", text: botReply, time: botTimestamp }]);
    } catch (err) {
      console.error("Chat error:", err);
      const botTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "❌ Failed to connect to server. Is it running on port 3000?", time: botTimestamp },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat window */}
      <div
        className={`transition-all duration-300 ease-in-out transform origin-bottom-right ${
          open ? "scale-100 opacity-100 translate-y-0" : "scale-0 opacity-0 translate-y-10 pointer-events-none"
        } w-[350px] h-[500px] bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5A4A42] to-[#8B735B] text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <FaRobot className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg">AI Assistant</h3>
              <p className="text-xs text-white/80 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              <FaRobot className="text-4xl mx-auto mb-2 text-gray-300" />
              <p>Hello! How can I help you today?</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-2 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.from === "user" ? "bg-[#5A4A42] text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {msg.from === "user" ? <FaUser size={12} /> : <FaRobot size={14} />}
              </div>

              <div className={`max-w-[80%] flex flex-col ${msg.from === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`p-3 rounded-2xl text-sm shadow-sm ${
                    msg.from === "user"
                      ? "bg-[#5A4A42] text-white rounded-tr-none"
                      : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0">
                <FaRobot size={14} />
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-100">
          <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-[#5A4A42]/20 focus-within:border-[#5A4A42] transition-all">
            <input
              type="text"
              className="flex-1 bg-transparent focus:outline-none text-sm text-gray-700 placeholder-gray-400"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className={`p-2 rounded-full transition-all ${
                loading || !input.trim()
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-[#5A4A42] hover:bg-[#5A4A42]/10 active:scale-95"
              }`}
            >
              <FaPaperPlane />
            </button>
          </div>
          <div className="text-center mt-1">
            <span className="text-[10px] text-gray-400">Powered by Gemini AI</span>
          </div>
        </div>
      </div>

      {/* Chat toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`group relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          open ? "bg-gray-200 text-gray-600 rotate-90" : "bg-[#5A4A42] text-white hover:bg-[#4a3b34]"
        }`}
      >
        {open ? <FaTimes className="text-xl" /> : <FaCommentDots className="text-2xl" />}

        {!open && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
      </button>
    </div>
  );
}