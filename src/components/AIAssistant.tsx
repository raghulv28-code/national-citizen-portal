import React, { useState, useRef, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import { Sparkles, MessageSquare, Send, X, Bot, User, CornerDownRight, Landmark, FileText, CheckCircle2 } from 'lucide-react';

interface ChatMessage {
  sender: 'ai' | 'citizen';
  text: string;
  timestamp: string;
  classification?: string;
}

export const AIAssistant: React.FC = () => {
  const { askAI, language } = useQueue();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Namaste! I am **Seva Mitra**, your AI-powered Public Service Assistant. 

How can I assist you today? You can ask me about:
- Required documents for Patta or Aadhaar.
- Expected waiting times.
- State pension eligibility rules.
- Queue priorities and office operating hours.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const faqPrompts = [
    { label: 'Aadhaar Demographic Docs', query: 'List documents required for Aadhaar Demographic mobile and address update.' },
    { label: 'Patta Land Deeds', query: 'What documents are required for Patta ownership transfer?' },
    { label: 'Priority Desk Rules', query: 'Can senior citizens or disabled persons claim priority queue tokens?' },
    { label: 'Office Hours & Holidays', query: 'What are the office timings and lunch breaks?' }
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    // Append user message
    const userMsg: ChatMessage = {
      sender: 'citizen',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Query server-side Gemini via Context hook
      const res = await askAI(textToSend);
      
      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: res.reply,
        classification: res.classification,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      // Fallback
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: 'Apologies, I encountered a connection issue. Standard services are currently operational.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-orange-600 to-amber-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 border border-orange-500/30 group animate-bounce"
          style={{ animationDuration: '3s' }}
        >
          <div className="relative">
            <Bot size={28} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold ml-2 text-sm uppercase tracking-wider whitespace-nowrap">
            Ask Seva Mitra AI
          </span>
        </button>
      )}

      {/* Expanded Chat Dialog */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] h-[550px] bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-600/25 border border-orange-500/30 rounded-xl">
                <Sparkles size={20} className="text-orange-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-gray-100">Seva Mitra</h4>
                  <span className="bg-green-500/10 text-green-400 border border-green-500/30 text-[9px] px-1.5 py-0.2 rounded font-black font-mono">
                    GEMINI AI LIVE
                  </span>
                </div>
                <p className="text-[10px] text-gray-400">National e-Governance Digital Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/40">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${m.sender === 'citizen' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`p-1.5 rounded-full h-8 w-8 flex items-center justify-center shrink-0 ${
                  m.sender === 'citizen' ? 'bg-orange-600 text-white' : 'bg-slate-800 border border-slate-700 text-orange-400'
                }`}>
                  {m.sender === 'citizen' ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Bubble */}
                <div>
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed border ${
                    m.sender === 'citizen'
                      ? 'bg-orange-600/10 border-orange-600/30 text-orange-100 rounded-tr-none'
                      : 'bg-slate-900 border-slate-800 text-gray-300 rounded-tl-none whitespace-pre-wrap'
                  }`}>
                    {/* Render helper text lines */}
                    {m.text}
                    
                    {/* Display classified tags to user, matching Government Audit transparency rules */}
                    {m.classification && (
                      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-1 text-[9px] text-orange-400 uppercase font-bold font-mono">
                        <CornerDownRight size={10} />
                        <span>Query Class: {m.classification}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[9px] text-gray-500 mt-1 pl-1 font-mono">
                    {m.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="p-1.5 rounded-full h-8 w-8 bg-slate-800 text-orange-400 flex items-center justify-center shrink-0 border border-slate-700">
                  <Bot size={14} />
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick FAQ Suggestion Bar */}
          <div className="p-2 bg-slate-950 border-t border-slate-800 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
            {faqPrompts.map((faq, i) => (
              <button
                key={i}
                onClick={() => handleSend(faq.query)}
                className="bg-slate-900 hover:bg-slate-800 text-orange-400 hover:text-orange-300 text-[10px] px-3 py-1.5 rounded-full border border-slate-800 font-medium transition cursor-pointer"
              >
                {faq.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-slate-900 border-t border-slate-800">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your e-Gov query here..."
                className="flex-1 bg-slate-950 border border-slate-700 focus:border-orange-500 focus:outline-none rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 transition"
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white p-2.5 rounded-xl transition flex items-center justify-center shrink-0"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AIAssistant;
