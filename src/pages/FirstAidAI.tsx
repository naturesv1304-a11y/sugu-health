import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse, Zap, AlertOctagon, ArrowRight, Mic, Send, LifeBuoy, XCircle, StopCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { groqGenerateText } from '@/lib/groq';

function Activity(props: any) {
  return <HeartPulse {...props} />;
}

export function FirstAidAI() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([
    { role: 'bot', text: 'Hello. Provide symptoms or describe the situation. In life-threatening emergencies, always call emergency services immediately.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const emergencies = [
    { title: 'Choking', color: 'bg-rose-500', icon: XCircle },
    { title: 'Bleeding', color: 'bg-red-500', icon: HeartPulse },
    { title: 'Burns', color: 'bg-orange-500', icon: Zap },
    { title: 'Cardiac Arrest', color: 'bg-rose-600', icon: Activity },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    e?.preventDefault();
    const textToSend = customText || query.trim();
    if (!textToSend || isLoading) return;

    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsLoading(true);

    try {
      const promptContext = `You are a critical Emergency First Aid AI assistant. A user is asking for immediate help regarding: "${textToSend}". 
      Respond with extremely concise, step-by-step actionable first aid instructions. Do not write filler text. Always put a priority on telling them to call emergency services if the situation sounds lethal. Format your response cleanly using short bullet points. Do not surround your response in markdown blocks. Use bolding for critical steps.`;
      
      const responseText = await groqGenerateText(promptContext, 'openai/gpt-oss-120b');

      setMessages(prev => [...prev, { role: 'bot', text: responseText || 'Unable to process. Call 911 immediately if emergency.' }]);
    } catch (error: any) {
      console.error("AI Error: ", error);
      setMessages(prev => [...prev, { role: 'bot', text: 'Error connecting to emergency AI. Please seek physical medical help or call 911 immediately.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCall911 = () => {
    window.location.href = "tel:911";
  };

  return (
    <div className="h-full flex flex-col gap-6 relative">
      <div className="flex justify-between items-center bg-gradient-to-r from-red-600 to-rose-600 text-white p-6 rounded-[2rem] shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[60px] rounded-full mix-blend-overlay animate-pulse" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl animate-pulse">
            <LifeBuoy className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">First Aid AI</h1>
            <p className="text-white/80 font-medium">Instant guidance for medical situations</p>
          </div>
        </div>

        <motion.button 
          onClick={handleCall911}
          whileHover={{ scale: 1.05 }}
          className="bg-white text-red-600 px-6 py-3 rounded-2xl font-bold font-lg flex items-center gap-2 shadow-xl shadow-red-900/20"
        >
          <AlertOctagon className="w-5 h-5 fill-red-100" />
          Call 911 Now
        </motion.button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
        {emergencies.map((em, i) => (
          <motion.button
            onClick={() => handleSend(undefined, `What are the immediate first aid steps for ${em.title}?`)}
            key={i}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "p-4 rounded-2xl text-white font-bold flex flex-col items-center justify-center gap-3 relative overflow-hidden group shadow-lg",
              em.color
            )}
          >
            <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <em.icon className="w-8 h-8 z-10" />
            <span className="z-10">{em.title}</span>
          </motion.button>
        ))}
      </div>

      <div className="flex-1 glass-panel rounded-[2rem] p-6 flex flex-col relative overflow-hidden min-h-[400px]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto space-y-6 mb-4 pr-2 scrollbar-hide flex flex-col relative z-10">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                  msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-red-500 text-white'
                }`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <HeartPulse className="w-5 h-5" />}
                </div>
                
                <div className={`rounded-[1.5rem] px-5 py-3 shadow-sm border ${
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
                className="flex gap-4 self-start max-w-[85%]"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-lg">
                  <HeartPulse className="w-5 h-5 animate-pulse" />
                </div>
                <div className="bg-white rounded-[1.5rem] rounded-tl-sm px-6 py-4 shadow-sm border border-slate-100 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-4" />
        </div>

        <form onSubmit={handleSend} className="relative z-10 p-2 bg-white/60 rounded-[2rem] border border-slate-200 backdrop-blur-md flex items-center gap-2 shadow-lg shrink-0 focus-within:border-red-300 focus-within:shadow-[0_8px_30px_rgba(239,68,68,0.15)] transition-all">
          <button type="button" className="p-4 bg-slate-100 rounded-full text-slate-500 hover:text-red-600 hover:bg-white transition-colors">
            <Mic className="w-5 h-5" />
          </button>
          
          <input 
            type="text" 
            placeholder="Type your emergency or question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none px-4 font-medium text-slate-800 placeholder-slate-400"
          />
          
          {isLoading ? (
            <button 
              type="button" 
              className="p-4 rounded-full text-slate-400 bg-slate-100 transition-colors cursor-not-allowed"
              disabled
            >
              <StopCircle className="w-5 h-5" />
            </button>
          ) : (
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!query.trim()}
              className={cn(
                "p-4 rounded-full text-white transition-colors",
                query.trim() ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30" : "bg-slate-300 pointer-events-none"
              )}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          )}
        </form>
      </div>
    </div>
  );
}
