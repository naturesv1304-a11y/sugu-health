import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, StopCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { groqGenerateText } from '@/lib/groq';

export function Chat() {
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([
    { role: 'bot', text: 'Hello! I am your SUGU AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    e?.preventDefault();
    const textToSend = customText || input.trim();
    if (!textToSend || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsLoading(true);

    try {
      const groqApiKey = process.env.GROQ_API_KEY;
      const prompt = `You are a highly advanced, ultra-smart healthcare AI assistant named SUGU. Keep your answers concise, empathetic, and exceptionally clear. Use formatting like bullet points when explaining complex topics.\n\nUser: ${textToSend}`;
      const aiResponse = await groqGenerateText(prompt, 'openai/gpt-oss-120b');
      setMessages(prev => [...prev, { role: 'bot', text: aiResponse || 'Sorry, I could not process that.' }]);
    } catch (error: any) {
      console.error('AI Error: ', error);
      console.error("AI Error: ", error);
      let errMsg = error?.message || "Unknown error";
      if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED')) {
        const fallbacks = [
          "I'm operating in offline simulated mode because your API rate limit was exceeded! To answer your question: Make sure you rest properly and consult a primary physician for direct help.",
          "[Simulated AI Response due to Rate Limits]: That sounds challenging. I recommend drinking plenty of water, getting adequate sleep, and reaching out to a medical professional if symptoms worsen.",
          "[Simulated Intelligence Mode]: While the main AI is cooling down to respect API limits, I can provide basic guidance. Try to maintain a balanced diet, stay relaxed, and use the Symptom Tracker to record any changes!"
        ];
        const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        setMessages(prev => [...prev, { role: 'bot', text: randomFallback }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: `Sorry, there was an error connecting to the AI. Ensure your API Key is valid and try again.` }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col relative pb-4">
      
      {/* Premium Hero AI Header (Only visible if barely any messages) */}
      <AnimatePresence>
        {messages.length <= 1 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, height: 0, overflow: 'hidden' }}
            className="flex flex-col items-center justify-center pt-16 pb-8 px-4 text-center z-10"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.4)] mb-6 animate-pulse-slow relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-md"></div>
              <Sparkles className="w-10 h-10 text-white relative z-10" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-4">
              How can I <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">help you</span> today?
            </h1>
            <p className="text-slate-500 font-medium max-w-lg mb-8">
              Ask me about your symptoms, request wellness tips, or seek analysis on complex health trends. Let's explore your health.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              {['What happens during a fever?', 'Give me a 7-day healthy diet', 'Why is hydration important?', 'Explain how vaccines work'].map((prompt, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(undefined, prompt)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-600 text-sm font-medium hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm flex items-center gap-2"
                >
                  {prompt} <ArrowRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide scroll-smooth relative z-10">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-slate-900 text-white shadow-slate-900/20' 
                  : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/30'
              }`}>
                {msg.role === 'user' ? <User className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
              </div>
              
              {/* Bubble */}
              <div className={`max-w-[85%] sm:max-w-[75%] rounded-[2rem] px-6 py-4 shadow-sm border ${
                msg.role === 'user' 
                  ? 'bg-slate-900 text-white rounded-tr-sm border-slate-800' 
                  : 'bg-white text-slate-800 rounded-tl-sm border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]'
              }`}>
                <div className="prose prose-sm md:prose-base max-w-none text-inherit prose-p:leading-relaxed prose-headings:text-inherit">
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div className="bg-white rounded-[2rem] rounded-tl-sm px-6 py-5 shadow-sm border border-slate-100 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Floating Input Area */}
      <div className="px-4 shrink-0 relative z-20">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSend} className="relative flex items-center bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 p-2 pl-6 transition-shadow focus-within:shadow-[0_8px_30px_rgb(99,102,241,0.15)] focus-within:border-indigo-200">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message SUGU AI..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 font-medium py-3 text-[15px]"
              autoFocus
            />
            {isLoading ? (
              <button 
                type="button" 
                className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center ml-2"
                disabled
              >
                <StopCircle className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center ml-2 hover:bg-indigo-600 transition-colors disabled:opacity-40 disabled:hover:bg-slate-900 transform active:scale-95 duration-200"
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            )}
          </form>
          <div className="text-center mt-3">
            <p className="text-[11px] text-slate-400 font-medium">
              SUGU AI can make mistakes. Always verify critical health information.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
