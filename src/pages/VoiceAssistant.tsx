import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, StopCircle, Radio, Sparkles, AlertCircle, Loader2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { groqGenerateText } from '@/lib/groq';

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [transcript, setTranscript] = useState("Hi Sugumar! I'm your AI Medical Assistant. Tap to speak to me.");
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);
  
  // Fallback text input state
  const [textInput, setTextInput] = useState("");
  const [showFallbackMenu, setShowFallbackMenu] = useState(false);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        const current = event.resultIndex;
        const currentTranscript = event.results[current][0].transcript;
        setTranscript(currentTranscript);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
           setError("Microphone blocked! Because you are accessing this preview via an IP address instead of localhost, Google Chrome has blocked the microphone for your safety. To use your headset, open http://localhost:3000 on this computer or use the text fallback below.");
           setIsListening(false);
           setShowFallbackMenu(true);
        } else if (event.error !== 'aborted') {
           setError("Cannot access microphone or no speech detected. Try the text fallback.");
           setIsListening(false);
           setShowFallbackMenu(true);
        }
      };

      setRecognition(rec);
    } else {
      setError("Speech recognition is not supported natively in this browser. Please use text fallback.");
      setShowFallbackMenu(true);
    }
    
    // Cleanup any ongoing speech synthesis
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleProcessSpeech = async (text: string) => {
    if (!text || text === "Hi Sugumar! I'm your AI Medical Assistant. Tap to speak to me." || text === "Listening...") return;
    setIsThinking(true);
    setError(null);
    
    try {
      const prompt = `You are a friendly, empathetic AI medical assistant. The user just said: "${text}". 
      Respond directly, concisely, and naturally, as if in a spoken conversation. 
      Limit your response to 1-3 short sentences. Do not use complex medical jargon or markdown formatting. 
      If it sounds like a serious emergency, advise them to call emergency services.`;
      
      const responseText = await groqGenerateText(prompt, 'openai/gpt-oss-120b');

      const aiResponse = responseText || "I'm sorry, I couldn't understand that.";
      setTranscript(aiResponse);
      
      // Speak back
      const utterance = new SpeechSynthesisUtterance(aiResponse);
      if (window.speechSynthesis.getVoices().length > 0) {
          // try to pick a good voice
          const voices = window.speechSynthesis.getVoices();
          const preferred = voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Female'));
          if (preferred) utterance.voice = preferred;
      }
      utterance.rate = 1.05;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
      
    } catch (err) {
      console.error("AI Error:", err);
      setError("Could not connect to AI services. Are you offline?");
    } finally {
      setIsThinking(false);
    }
  };

  // When listening stops, process the final text (for voice)
  useEffect(() => {
    if (!isListening && transcript && !isThinking && transcript !== "Hi Sugumar! I'm your AI Medical Assistant. Tap to speak to me." && transcript !== "Listening..." && textInput.length === 0) {
      // Small timeout to Ensure we have the final transcript
      const timer = setTimeout(() => {
        handleProcessSpeech(transcript);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isListening, transcript]);

  const toggleListen = () => {
    setError(null);
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      // Stop anything that's currently speaking
      window.speechSynthesis.cancel();
      
      setTranscript("Listening...");
      try {
        recognition?.start();
        setIsListening(true);
      } catch (e) {
        // If it was already started or crashed
        console.error(e);
        setIsListening(false);
        setError("Microphone launch failed. Your environment may block audio contexts on HTTP.");
        setShowFallbackMenu(true);
      }
    }
  };

  const handleManualTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || isThinking) return;
    setTranscript(textInput);
    handleProcessSpeech(textInput);
    setTextInput("");
  };

  const waves = Array.from({ length: 9 }).map((_, i) => i);

  return (
    <div className="space-y-8 relative pb-20 min-h-[80vh] flex flex-col items-center justify-center">
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 bg-slate-50 flex items-center justify-center">
        <motion.div 
          className={cn("w-[800px] h-[800px] rounded-full blur-[100px] transition-colors duration-1000",
             isListening ? "bg-gradient-to-tr from-rose-500/20 to-orange-500/20" : 
             isThinking ? "bg-gradient-to-tr from-sky-500/20 to-indigo-500/20" : 
             "bg-gradient-to-tr from-indigo-500/20 to-purple-500/20"
          )}
          animate={{ scale: isListening || isThinking ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="text-center z-10 w-full max-w-4xl px-4 flex flex-col items-center">
        
        {error && (
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="mb-8 flex items-center gap-3 bg-rose-100 text-rose-700 px-8 py-4 rounded-[2rem] font-bold shadow-lg border border-rose-200 relative"
          >
             <AlertCircle className="w-6 h-6 shrink-0" />
             <p className="max-w-[500px] leading-relaxed text-sm text-left">{error}</p>
          </motion.div>
        )}

        {/* Floating Voice Orb */}
        <div className="mb-14 relative">
          <motion.div
            className={cn("w-48 h-48 rounded-full flex items-center justify-center relative z-20 cursor-pointer hover:scale-105 transition-all duration-500 shadow-2xl",
              isListening ? "bg-gradient-to-br from-rose-500 to-orange-600 shadow-rose-500/50" : 
              isThinking ? "bg-gradient-to-br from-sky-400 to-indigo-600 shadow-indigo-500/50" : 
              "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/50"
            )}
            animate={{ 
              boxShadow: isListening ? "0 0 80px rgba(244, 63, 94, 0.8)" : 
                         isThinking ? "0 0 80px rgba(99, 102, 241, 0.8)" : 
                         "0 20px 40px rgba(99, 102, 241, 0.3)",
              scale: isListening || isThinking ? [1, 1.05, 1] : 1
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            onClick={toggleListen}
          >
            <div className="absolute inset-1 rounded-full border border-white/20" />
            
            {isThinking ? (
              <Loader2 className="w-16 h-16 text-white animate-spin" />
            ) : isListening ? (
              <div className="flex gap-2 items-end h-16">
                {waves.map((i) => (
                  <motion.div 
                    key={i}
                    className="w-1.5 bg-white rounded-full bg-opacity-90"
                    animate={{ height: [10, Math.random() * 60 + 20, 10] }}
                    transition={{ duration: Math.random() * 0.4 + 0.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                ))}
              </div>
            ) : (
              <Mic className="w-16 h-16 text-white" />
            )}
          </motion.div>

          {/* Pulse Rings */}
          <AnimatePresence>
            {isListening && (
              <>
                <motion.div
                  initial={{ opacity: 0.8, scale: 1 }}
                  animate={{ opacity: 0, scale: 2 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 border-2 border-rose-400 rounded-full z-10 pointer-events-none"
                />
                <motion.div
                  initial={{ opacity: 0.8, scale: 1 }}
                  animate={{ opacity: 0, scale: 2 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
                  className="absolute inset-0 border-2 border-orange-400 rounded-full z-10 pointer-events-none"
                />
              </>
            )}
          </AnimatePresence>
        </div>

        {/* AI Transcription / Speakback Screen */}
        <div className="min-h-[160px] flex items-center justify-center w-full relative max-w-2xl bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-2xl mb-10">
          {!isListening && !isThinking && <Sparkles className="absolute -top-6 -right-6 w-12 h-12 text-amber-400 animate-pulse drop-shadow-lg" />}
          <motion.p 
            key={transcript}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("text-2xl md:text-3xl font-black text-center leading-relaxed tracking-tight", 
               isListening ? "text-rose-600" : 
               isThinking ? "text-sky-600" : 
               "bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700"
            )}
          >
            "{transcript}"
          </motion.p>
        </div>

        {/* Text Fallback Box */}
        <AnimatePresence>
          {showFallbackMenu && (
             <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleManualTextSubmit}
                className="w-full max-w-2xl relative mb-6"
             >
                <input 
                   type="text" 
                   value={textInput}
                   onChange={e => setTextInput(e.target.value)}
                   disabled={isThinking}
                   placeholder="Type your question manually..."
                   className="w-full bg-white px-8 py-5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 text-lg font-medium tracking-wide text-slate-800 placeholder-slate-400 transition-all"
                />
                <button 
                  type="submit"
                  disabled={isThinking || !textInput.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-md"
                >
                  <Send className="w-5 h-5 ml-1" />
                </button>
             </motion.form>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button 
            onClick={toggleListen}
            disabled={isThinking}
            className={cn("px-10 py-5 rounded-full font-bold text-xl shadow-xl flex items-center gap-3 transition-all", 
              isThinking ? "opacity-50 cursor-not-allowed bg-slate-100 text-slate-500" :
              isListening ? "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/30" : 
              "bg-white text-indigo-900 border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200"
            )}
          >
            {isListening ? <StopCircle className="w-6 h-6" /> : <Radio className="w-6 h-6 text-indigo-500" />}
            {isListening ? 'Stop Listening' : 'Tap to Speak'}
          </button>
          
          {!showFallbackMenu && (
             <button 
               onClick={() => setShowFallbackMenu(true)}
               disabled={isThinking || isListening}
               className="px-6 py-5 rounded-full font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
             >
                Show Keyboard Fallback
             </button>
          )}
        </div>

      </div>
    </div>
  );
}
