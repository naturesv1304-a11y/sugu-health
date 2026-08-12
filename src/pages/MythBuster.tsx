import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, HelpCircle, Sparkles, Zap, ShieldQuestion, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mythDataset = [
  { text: "Eating garlic cures cold", isFact: false, explanation: "Garlic has mild antimicrobial properties, but it cannot cure a viral infection like the common cold." },
  { text: "Drinking turmeric milk boosts immunity", isFact: true, explanation: "Turmeric contains curcumin, which has potent anti-inflammatory and antioxidant properties." },
  { text: "COVID-19 spreads through 5G towers", isFact: false, explanation: "Viruses cannot travel on radio waves/mobile networks. COVID-19 is spread through respiratory droplets." },
  { text: "Regular exercise improves heart health", isFact: true, explanation: "Cardiovascular exercise strengthens the heart muscle and improves blood flow." },
  { text: "Bananas increase weight instantly", isFact: false, explanation: "Weight gain happens from an overall caloric surplus over time, not from eating a single specific food." },
  { text: "Cracking knuckles causes arthritis", isFact: false, explanation: "The popping sound is just gas bubbles bursting in the joint fluid. Studies show no link to arthritis." },
  { text: "Vaccines cause autism", isFact: false, explanation: "Extensive scientific studies have proven there is absolutely no link between vaccines and autism." },
  { text: "Hand dryers kill all germs", isFact: false, explanation: "Hand dryers don't kill germs. In fact, some can blow bacteria from the room onto your hands." },
  { text: "Sitting too close to the TV ruins eyesight", isFact: false, explanation: "It may cause temporary eye strain or fatigue, but it does not cause permanent physical damage." },
  { text: "Eating carrots improves night vision", isFact: false, explanation: "Carrots have Vitamin A which maintains healthy eyes, but they won't give you superhuman night vision." },
  { text: "Green tea helps in weight loss", isFact: true, explanation: "Green tea contains antioxidants like EGCG that can mildly boost metabolism." },
  { text: "Stress can cause gray hair", isFact: true, explanation: "Severe stress can trigger a condition called telogen effluvium, causing hair disruption and graying." },
  { text: "Dark chocolate is good for heart", isFact: true, explanation: "Rich in flavonoids, dark chocolate can help lower blood pressure and improve blood flow." },
  { text: "Washing hands prevents infections", isFact: true, explanation: "Proper handwashing with soap and water is the most effective way to prevent the spread of infections." },
  { text: "Sleeping 7–8 hours improves immunity", isFact: true, explanation: "Adequate sleep empowers the immune system to recognize and react to dangerous antigens." },
];

export function MythBuster() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setResult] = useState<{ found: boolean, isFact?: boolean, text?: string, explanation?: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) {
      setResult(null);
      return;
    }
    
    setIsSearching(true);
    
    // Fake a small delay for premium feel
    setTimeout(() => {
      const query = searchQuery.toLowerCase().trim();
      const found = mythDataset.find(m => 
        m.text.toLowerCase().includes(query) || 
        query.split(' ').some(word => word.length > 4 && m.text.toLowerCase().includes(word))
      );
      
      if (found) {
        setResult({ found: true, isFact: found.isFact, text: found.text, explanation: found.explanation });
      } else {
        setResult({ found: false });
      }
      setIsSearching(false);
    }, 600);
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    // Have to do it immediately because state update might mock actual search
    setTimeout(() => {
      document.getElementById('myth-search-btn')?.click();
    }, 50);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16 pt-4">
      {/* Premium Search Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center justify-center text-center"
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 rounded-full blur-3xl -mr-40 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/5 to-cyan-500/10 rounded-full blur-3xl -ml-40 -mb-40 pointer-events-none"></div>

        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.3)] mb-8 relative animate-[pulse_3s_ease-in-out_infinite] z-10">
          <Sparkles className="w-12 h-12" />
          <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-amber-400 text-white flex items-center justify-center border-4 border-white shadow-sm">
            <Zap className="w-4 h-4 fill-white" />
          </div>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 relative z-10">
          Health <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">MythBuster</span>
        </h2>
        <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mb-10 relative z-10">
          We separate medical facts from viral fiction. Type a common health belief below to instantly verify its authenticity.
        </p>
        
        <form onSubmit={handleSearch} className="w-full max-w-3xl relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
              <Search className="w-6 h-6 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., 'Does cracking knuckles cause arthritis?'"
              className="w-full pl-16 pr-6 py-5 rounded-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-400 transition-all font-medium text-lg text-slate-800 placeholder-slate-400 shadow-sm"
            />
          </div>
          <button
            id="myth-search-btn"
            type="submit"
            disabled={isSearching}
            className="px-10 py-5 bg-slate-900 text-white rounded-full font-bold hover:bg-violet-600 transition-all transform active:scale-95 shadow-xl hover:shadow-violet-500/25 duration-200 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2 text-lg sm:w-auto w-full shrink-0"
          >
            {isSearching ? 'Analyzing...' : 'Verify Claim'}
          </button>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-3 relative z-10">
          <span className="text-sm font-bold text-slate-400 self-center mr-2 uppercase tracking-widest">Trending</span>
          {['Vaccines and autism', 'Green tea weight loss', 'Carrots and eyesight'].map((query, i) => (
            <button 
              key={i}
              type="button"
              onClick={() => handleQuickSearch(query)}
              className="px-4 py-2 bg-white/60 backdrop-blur-md border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:bg-violet-50 hover:text-violet-700 transition duration-200 shadow-sm"
            >
              {query}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Dynamic Results Area */}
      <AnimatePresence>
        {searchResult && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`max-w-4xl mx-auto p-8 md:p-10 rounded-[2.5rem] border ${
              !searchResult.found 
                ? 'bg-slate-50 border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.03)]' 
                : searchResult.isFact 
                  ? 'bg-emerald-50 border-emerald-100 shadow-[0_20px_40px_rgba(16,185,129,0.1)]' 
                  : 'bg-rose-50 border-rose-100 shadow-[0_20px_40px_rgba(244,63,94,0.1)]'
            }`}
          >
            {!searchResult.found ? (
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg mb-2">
                  <ShieldQuestion className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-800">Claim Not Recognized</h3>
                <p className="text-slate-500 font-medium max-w-md">
                  We don't have enough verified medical data on this specific claim. Always consult a healthcare professional for unverified health advice.
                </p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="shrink-0 relative">
                  <div className={`w-32 h-32 rounded-[2rem] flex items-center justify-center shadow-2xl relative z-10 ${
                    searchResult.isFact ? 'bg-gradient-to-br from-emerald-400 to-green-500' : 'bg-gradient-to-br from-rose-500 to-red-600'
                  }`}>
                    {searchResult.isFact ? <CheckCircle2 className="w-16 h-16 text-white" /> : <XCircle className="w-16 h-16 text-white" />}
                  </div>
                  <div className={`absolute inset-0 blur-2xl opacity-50 z-0 ${
                    searchResult.isFact ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}></div>
                </div>
                
                <div className="text-center md:text-left">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-extrabold uppercase tracking-widest mb-4 border ${
                    searchResult.isFact ? 'bg-white text-emerald-600 border-emerald-100' : 'bg-white text-rose-600 border-rose-100'
                  }`}>
                    {searchResult.isFact ? 'Verified Fact' : 'Busted Myth'}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-4">
                    "{searchResult.text}"
                  </h3>
                  <p className={`text-lg font-medium ${searchResult.isFact ? 'text-emerald-800/80' : 'text-rose-800/80'}`}>
                    {searchResult.explanation || (searchResult.isFact ? "Medical science supports this claim as factual." : "This is a commonly circulated myth with no scientific backing.")}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of Common Myths and Facts */}
      <div className="pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore the Database</h3>
            <p className="text-slate-500 font-medium mt-1">Discover the truth behind popular health claims</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mythDataset.map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={idx} 
              className="group flex flex-col p-6 rounded-[2rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(139,92,246,0.08)] hover:border-violet-100 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden relative"
              onClick={() => handleQuickSearch(item.text)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl flex items-center justify-center shrink-0 ${
                  item.isFact ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
                }`}>
                  {item.isFact ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                </div>
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border ${
                  item.isFact ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
                }`}>
                  {item.isFact ? 'Fact' : 'Myth'}
                </span>
              </div>
              
              <h4 className="text-lg font-bold text-slate-800 mb-2 leading-snug group-hover:text-violet-700 transition-colors">
                {item.text}
              </h4>
              
              <div className="mt-auto pt-4 flex items-center text-sm font-bold text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                Verify this <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
