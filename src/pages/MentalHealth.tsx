import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Wind, Smile, Frown, Meh, Music, BookHeart, Activity, PlayCircle, PauseCircle, ChevronRight, Headphones, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MentalHealth() {
  const [breathingState, setBreathingState] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [mood, setMood] = useState<string | null>(null);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  useEffect(() => {
    if (!isBreathingActive) {
      setBreathingState('Inhale');
      return;
    }

    const cycle = () => {
      setBreathingState('Inhale');
      setTimeout(() => {
        if (!isBreathingActive) return;
        setBreathingState('Hold');
        setTimeout(() => {
          if (!isBreathingActive) return;
          setBreathingState('Exhale');
        }, 2000);
      }, 4000);
    };
    
    cycle();
    const interval = setInterval(cycle, 10000);
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  const getBreathingScale = () => {
    if (!isBreathingActive) return 1;
    if (breathingState === 'Inhale') return 1.8;
    if (breathingState === 'Hold') return 1.85; // Slight pulse on hold
    return 1;
  };

  const affirmations = [
    "You are capable of amazing things.",
    "Every day is a fresh start.",
    "Your potential to succeed is infinite.",
    "You are stronger than you think.",
    "Breathe in peace, exhale stress."
  ];
  const [affirmation] = useState(affirmations[Math.floor(Math.random() * affirmations.length)]);

  const tools = [
    { icon: Headphones, title: 'Deep Sleep Sounds', color: 'from-blue-500 to-indigo-600', duration: '45 Min' },
    { icon: Sun, title: 'Morning Visualization', color: 'from-amber-400 to-orange-500', duration: '10 Min' },
    { icon: BookHeart, title: 'Gratitude Journal', color: 'from-emerald-400 to-teal-500', duration: 'Daily' },
  ];

  return (
    <div className="space-y-8 relative pb-20">
      {/* Immersive Backgrounds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-[80px] -z-10 group-hover:scale-110 transition-transform duration-1000" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Mental Health Oasis</h1>
            <p className="text-lg text-slate-500 font-medium max-w-xl leading-relaxed">Take a moment for yourself. Breathe profoundly, reflect beautifully, and recharge completely.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="text-center px-8 py-4 bg-white/60 rounded-[1.5rem] border border-white backdrop-blur-md shadow-lg shadow-purple-500/5">
              <h4 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 tabular-nums">98</h4>
              <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Zen Score</p>
            </div>
            <div className="text-center px-8 py-4 bg-white/60 rounded-[1.5rem] border border-white backdrop-blur-md shadow-lg shadow-indigo-500/5 hidden sm:block">
              <h4 className="text-3xl font-black text-indigo-600 tabular-nums">7</h4>
              <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Breathing Exercise - Main Interactive Block */}
        <div className="lg:col-span-7 glass-panel p-8 md:p-12 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden min-h-[500px] border-indigo-100">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent -z-10" />
          
          <div className="flex w-full justify-between items-start mb-12">
            <div>
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <Wind className="w-7 h-7 text-indigo-500" />
                Resonance Breathing
              </h2>
              <p className="text-slate-500 font-medium mt-1">Regulate your nervous system.</p>
            </div>
          </div>

          <div className="relative w-64 h-64 flex items-center justify-center mb-16">
            <motion.div
              className={cn("absolute inset-0 rounded-full blur-xl border-2 transition-colors duration-1000", isBreathingActive ? "bg-indigo-300/40 border-indigo-200" : "bg-slate-200/50 border-slate-200")}
              animate={{ scale: getBreathingScale(), opacity: isBreathingActive ? 0.8 : 0.3 }}
              transition={{ duration: breathingState === 'Hold' ? 2 : 4, ease: "easeInOut" }}
            />
            <motion.div
              className={cn("absolute inset-4 rounded-full blur-md border border-white/50 transition-colors duration-1000", isBreathingActive ? "bg-indigo-400/50" : "bg-slate-300/50")}
              animate={{ scale: getBreathingScale(), opacity: isBreathingActive ? 0.9 : 0.4 }}
              transition={{ duration: breathingState === 'Hold' ? 2 : 4, ease: "easeInOut", delay: 0.1 }}
            />
            <motion.div
              className={cn("absolute inset-8 rounded-full shadow-2xl transition-colors duration-1000 flex items-center justify-center", isBreathingActive ? "bg-gradient-to-tr from-indigo-500 to-purple-500" : "bg-slate-100 border-4 border-white")}
              animate={{ scale: getBreathingScale() }}
              transition={{ duration: breathingState === 'Hold' ? 2 : 4, ease: "easeInOut", delay: 0.2 }}
            >
              <div className="relative z-10 text-3xl font-black text-white mix-blend-overlay tracking-widest uppercase">
                {isBreathingActive ? breathingState : "Resting"}
              </div>
            </motion.div>
          </div>
          
          <div className="flex flex-col items-center">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className={cn("px-10 py-4 rounded-full font-black text-lg shadow-xl flex items-center gap-3 transition-all", 
                isBreathingActive ? "bg-white text-indigo-900 hover:bg-slate-50 border border-slate-200 shadow-xl" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30"
              )}
            >
              {isBreathingActive ? <PauseCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
              {isBreathingActive ? "Stop Exercise" : "Begin Session"}
            </motion.button>
            <p className="text-slate-400 font-medium text-sm mt-4 tracking-wide">
              {isBreathingActive ? "Follow the circle. 4s Inhale, 2s Hold, 4s Exhale." : "Press play to start your guided session."}
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          {/* Daily Affirmation */}
          <div className="glass-panel rounded-[2rem] p-8 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden group shadow-2xl shadow-indigo-900/20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/30 blur-[50px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/20 blur-[40px] rounded-full" />
            
            <Heart className="w-8 h-8 mb-6 text-pink-400 animate-pulse" />
            <h3 className="text-sm font-bold text-indigo-300 mb-3 tracking-widest uppercase">Daily Affirmation for You</h3>
            <p className="text-3xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">"{affirmation}"</p>
          </div>

          {/* Mood Tracker */}
          <div className="glass-panel rounded-[2rem] p-8 border-rose-100">
            <h2 className="text-xl font-black text-slate-800 mb-6 text-center">How's your energy right now?</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { id: 'great', icon: Smile, label: 'Thriving', color: 'text-emerald-500', bg: 'bg-emerald-50', hover: 'hover:bg-emerald-100', border: 'border-emerald-200' },
                { id: 'okay', icon: Meh, label: 'Steady', color: 'text-amber-500', bg: 'bg-amber-50', hover: 'hover:bg-amber-100', border: 'border-amber-200' },
                { id: 'bad', icon: Frown, label: 'Drained', color: 'text-rose-500', bg: 'bg-rose-50', hover: 'hover:bg-rose-100', border: 'border-rose-200' },
              ].map((m) => (
                <button 
                  key={m.id}
                  onClick={() => setMood(m.id)}
                  className={cn("flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300", 
                    mood === m.id ? cn(m.bg, m.border, "scale-105 shadow-xl") : cn("bg-slate-50 border-transparent hover:scale-105", m.hover)
                  )}
                >
                  <m.icon className={cn("w-10 h-10 mb-2 transition-transform duration-500", mood === m.id ? cn(m.color, "scale-110") : "text-slate-400")} />
                  <span className={cn("text-xs font-bold uppercase tracking-wider", mood === m.id ? m.color : "text-slate-400")}>{m.label}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {mood && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 bg-indigo-500 h-full rounded-l-xl" />
                    <p className="text-slate-600 font-medium text-sm leading-relaxed">
                      {mood === 'great' && "Incredible! Your resilience is showing. Use this momentum to tackle a creative task or spend time outdoors."}
                      {mood === 'okay' && "Neutral is a safe place to be. Take it one step at a time today, and remember to stay hydrated."}
                      {mood === 'bad' && "I'm sorry you're feeling drained. It's completely okay. Prioritize rest today and be unconditionally kind to yourself."}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-[2rem]">
        <h2 className="text-2xl font-black text-slate-800 mb-6">Therapy & Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className={cn("w-14 h-14 rounded-2xl mb-4 flex items-center justify-center shadow-lg bg-gradient-to-br", tool.color)}>
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-indigo-600 transition-colors">{tool.title}</h3>
                <p className="text-sm text-slate-500 font-medium mb-4">{tool.duration}</p>
              </div>
              
              <div className="flex items-center text-sm font-bold text-indigo-600 uppercase tracking-wider group-hover:gap-2 transition-all">
                Access Now <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
