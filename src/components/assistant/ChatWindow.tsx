"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot, X, Minus, Trash2 } from "lucide-react";
import { processAssistantMessage } from "@/app/actions/assistant-actions";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

export function ChatWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "¡Hola! Soy **VA&T Assistant**. ¿En qué puedo ayudarte con los terminales POS hoy?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([
    "N910", "N950", "ME60", "SP600", "ME51", "ERROR TAMPER"
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customMessage) setInput("");
    setIsTyping(true);

    try {
      const response = await processAssistantMessage(textToSend);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: response.content,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setCurrentSuggestions(response.suggestions);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[550px] w-[400px] bg-surface/95 backdrop-blur-2xl border border-surface-variant/30 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-8 duration-300">
      {/* Header */}
      <div className="bg-primary p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-on-primary/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <Bot className="text-on-primary w-6 h-6" />
          </div>
          <div>
            <h3 className="text-on-primary font-headline font-black text-sm leading-none">VA&T Assistant</h3>
            <span className="text-on-primary/70 text-[10px] font-bold uppercase tracking-widest mt-1 inline-block">Soporte Técnico</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setMessages([messages[0]])}
            className="p-2 text-on-primary/60 hover:text-on-primary hover:bg-on-primary/10 rounded-xl transition-all"
            title="Limpiar chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button 
            onClick={onClose}
            className="p-2 text-on-primary/60 hover:text-on-primary hover:bg-on-primary/10 rounded-xl transition-all"
            title="Minimizar"
          >
            <Minus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-on-primary rounded-tr-none shadow-md"
                  : "bg-surface-container-low text-on-surface rounded-tl-none border border-surface-variant/20 shadow-sm"
              }`}
            >
              <div 
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ 
                  __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') 
                }}
              />
              <span className={`text-[9px] mt-2 block opacity-50 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-surface-container-low p-4 rounded-2xl rounded-tl-none flex gap-1">
              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {!isTyping && currentSuggestions.length > 0 && (
        <div className="px-5 pb-2 flex flex-wrap gap-2 overflow-x-auto scrollbar-hide">
          {currentSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSend(suggestion)}
              className="text-[10px] font-black bg-surface-container-low text-primary px-3 py-2 rounded-full border border-primary/10 hover:bg-primary hover:text-on-primary transition-all whitespace-nowrap uppercase tracking-wider"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-5 bg-surface-container-lowest/50 border-t border-surface-variant/20">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe tu duda técnica..."
            className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-5 pr-12 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-on-primary rounded-xl hover:opacity-90 disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-primary/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[9px] text-center mt-3 text-on-surface-variant opacity-40 font-bold uppercase tracking-widest">
          Desarrollado para Editorial ATC
        </p>
      </div>
    </div>
  );
}
