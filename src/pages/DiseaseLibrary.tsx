import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Filter, ShieldAlert, Activity, ArrowRight, Bookmark, X, Loader2, Sparkles, Brain, TestTube, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { groqGenerateText } from '@/lib/groq';

const diseases = [
  { id: 1, name: 'Diabetes Type II', category: 'Metabolic', severity: 'Moderate', color: 'from-orange-500 to-amber-500', iconBg: 'bg-orange-100', overview: 'A chronic condition that affects the way the body processes blood sugar (glucose). Treatment involves diet, exercise, medication, and insulin therapy.' },
  { id: 2, name: 'Hypertension', category: 'Cardiovascular', severity: 'High', color: 'from-rose-500 to-red-500', iconBg: 'bg-rose-100', overview: 'High blood pressure, a condition in which the force of the blood against the artery walls is too high. Can lead to severe health complications if unmanaged.' },
  { id: 3, name: 'Asthma', category: 'Respiratory', severity: 'Moderate', color: 'from-sky-500 to-blue-500', iconBg: 'bg-sky-100', overview: 'A condition in which your airways narrow and swell. Can trigger coughing, wheezing and shortness of breath.' },
  { id: 4, name: 'Rheumatoid Arthritis', category: 'Autoimmune', severity: 'High', color: 'from-purple-500 to-indigo-500', iconBg: 'bg-purple-100', overview: 'A chronic inflammatory disorder affecting many joints, including those in the hands and feet.' },
  { id: 5, name: 'Migraine', category: 'Neurological', severity: 'Low', color: 'from-teal-500 to-emerald-500', iconBg: 'bg-teal-100', overview: 'A headache of varying intensity, often accompanied by nausea and sensitivity to light and sound.' },
  { id: 6, name: 'Osteoporosis', category: 'Skeletal', severity: 'Moderate', color: 'from-slate-500 to-gray-500', iconBg: 'bg-slate-100', overview: 'A condition in which bones become weak and brittle. The body constantly absorbs and replaces bone tissue.' },
];

export function DiseaseLibrary() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [severityFilter, setSeverityFilter] = useState('All');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [modalTab, setModalTab] = useState<'overview' | 'ai'>('overview');

  const tabs = ['All', 'Metabolic', 'Cardiovascular', 'Respiratory', 'Autoimmune'];

  const toggleBookmark = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setBookmarkedIds(prev => prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]);
  };

  const filtered = diseases.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'All' || d.category === activeTab;
    const matchesSeverity = severityFilter === 'All' || d.severity === severityFilter;
    const matchesBookmark = activeTab === 'Bookmarked' ? bookmarkedIds.includes(d.id) : true;
    return matchesSearch && matchesTab && matchesSeverity && matchesBookmark;
  });

  const generateDeepDive = async (diseaseName: string) => {
    setIsAiLoading(true);
    setAiAnalysis(null);
    setModalTab('ai');
    try {
      const prompt = `Act as an expert medical encyclopedia AI. The user is asking for a clinical deep dive into: "${diseaseName}".
      Provide exactly 3 concise, highly readable paragraphs focusing on: 1. Latest Research/Treatments, 2. Less known risk factors, 3. Modern prevention strategies. Do not format with markdown chunks or backticks. Keep it plain text but professional.`;
      
      const responseText = await groqGenerateText(prompt, 'openai/gpt-oss-120b');
      setAiAnalysis(responseText || "Report generation failed.");
    } catch (err) {
      console.error(err);
      setAiAnalysis("Error retrieving deep dive clinical data. Please try again later.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* Hero Section */}
      <div className="glass-panel p-10 rounded-[3rem] bg-slate-900 border border-slate-800 text-white relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-sky-500/10 to-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold mb-6 backdrop-blur-md">
              <BookOpen className="w-5 h-5 fill-indigo-400" /> Medical Encyclopedia v2.0
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-4">
              Advanced Clinical <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-sky-400">Pathology Library</span>
            </h1>
            <p className="text-slate-400 font-medium text-xl leading-relaxed max-w-xl">
              Immerse yourself in our dynamic, AI-augmented database of medical conditions. Connect with real-time research and clinical deep dives.
            </p>
          </div>
          
          <div className="w-full lg:w-96 flex flex-col gap-4 relative">
            <div className="relative group shadow-2xl rounded-2xl">
              <Search className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" />
              <input 
                type="text"
                placeholder="Search database..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white placeholder-slate-500 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 backdrop-blur-xl transition-all font-bold text-lg shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 z-40 bg-slate-50/80 backdrop-blur-xl p-4 rounded-3xl border border-slate-200/50 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide snap-x items-center px-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all duration-300 snap-center outline-none border-b-4",
                activeTab === tab 
                  ? "bg-slate-900 border-slate-900 text-white shadow-xl translate-y-[2px]" 
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 active:translate-y-[2px] active:border-b-2"
              )}
            >
              {tab}
            </button>
          ))}
          <button
            onClick={() => setActiveTab('Bookmarked')}
            className={cn(
              "px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all duration-300 snap-center flex items-center gap-2 border-b-4",
              activeTab === 'Bookmarked' ? "bg-indigo-600 border-indigo-700 text-white shadow-xl shadow-indigo-600/20 translate-y-[2px]" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 active:translate-y-[2px]"
            )}
          >
            <Bookmark className="w-5 h-5" fill={activeTab === 'Bookmarked' ? "currentColor" : "none"} /> Saved
          </button>
        </div>

        <div className="relative w-full md:w-auto px-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "w-full md:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-3 transition-all border-b-4",
              showFilters || severityFilter !== 'All' 
                ? "bg-rose-100 border-rose-200 text-rose-600 translate-y-[2px]" 
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 active:translate-y-[2px]"
            )}
          >
            <Filter className="w-5 h-5" /> 
            Filters {severityFilter !== 'All' && <span className="w-2 h-2 rounded-full bg-rose-500" />}
          </button>
          
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 md:right-0 left-0 md:left-auto top-full mt-4 bg-white rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] p-6 w-auto md:w-80 border border-slate-100 z-50 transform origin-top"
              >
                <div>
                  <h4 className="text-sm font-black text-slate-400 mb-4 uppercase tracking-widest flex items-center gap-2"><Activity className="w-4 h-4"/> Filter by Severity</h4>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Low', 'Moderate', 'High'].map(lev => (
                      <button 
                        key={lev}
                        onClick={() => setSeverityFilter(lev)}
                        className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all border-b-2 active:translate-y-[2px] active:border-b-0",
                          severityFilter === lev ? "bg-rose-500 border-rose-600 text-white shadow-lg shadow-rose-500/20" : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200"
                        )}
                      >
                        {lev}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Disease Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((disease) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, type: "spring" }}
              key={disease.id}
              className="group cursor-pointer h-full"
              onClick={() => { setSelectedDisease(disease); setModalTab('overview'); }}
            >
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col relative overflow-hidden border border-slate-100 group-hover:border-transparent group-hover:-translate-y-2">
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none", disease.color)} />
                <div className={cn("absolute -right-16 -top-16 w-48 h-48 bg-gradient-to-br opacity-10 blur-[40px] rounded-full group-hover:opacity-40 transition-opacity duration-700 pointer-events-none", disease.color)} />
                
                <div className="flex justify-between items-start mb-auto relative z-10 w-full pb-6">
                  <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-xl shadow-indigo-900/10 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500", disease.color)}>
                     <TestTube className="w-7 h-7" />
                  </div>
                  <button 
                    onClick={(e) => toggleBookmark(e, disease.id)}
                    className={cn("p-3 rounded-full transition-colors", 
                      bookmarkedIds.includes(disease.id) ? "bg-indigo-100 text-indigo-600 shadow-sm" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-indigo-500"
                    )}
                  >
                    <Bookmark className="w-5 h-5" fill={bookmarkedIds.includes(disease.id) ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="z-10 mt-auto pt-6">
                  <span className="inline-block px-3 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-black uppercase tracking-widest mb-4 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">{disease.category}</span>
                  <h3 className="text-2xl font-black text-slate-800 mb-4 leading-tight group-hover:text-indigo-600 transition-colors duration-300">{disease.name}</h3>
                  
                  <div className="flex items-center gap-2 mt-auto">
                    <ShieldAlert className={cn(
                      "w-5 h-5", 
                      disease.severity === 'High' && "text-rose-500",
                      disease.severity === 'Moderate' && "text-amber-500",
                      disease.severity === 'Low' && "text-emerald-500"
                    )} />
                    <span className={cn(
                      "font-bold text-sm",
                      disease.severity === 'High' && "text-rose-600",
                      disease.severity === 'Moderate' && "text-amber-600",
                      disease.severity === 'Low' && "text-emerald-600"
                    )}>{disease.severity} Risk</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* AI Deep Dive Modal */}
      <AnimatePresence>
        {selectedDisease && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setSelectedDisease(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-white rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.4)] overflow-hidden relative border border-white"
            >
              <div className={cn("absolute top-0 w-full h-[500px] bg-gradient-to-b from-white/20 to-transparent mix-blend-overlay pointer-events-none", selectedDisease.bg)} />
              <div className={cn("absolute right-0 top-0 w-96 h-96 bg-gradient-to-br opacity-10 blur-[80px] rounded-full pointer-events-none", selectedDisease.color)} />
              
              <div className="p-10 relative z-10">
                <div className="flex justify-between items-start mb-8">
                   <div className="flex items-center gap-6">
                      <div className={cn("p-5 rounded-3xl bg-gradient-to-br shadow-xl text-white", selectedDisease.color)}>
                        <Activity className="w-10 h-10" />
                      </div>
                      <div>
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tight leading-none mb-2">{selectedDisease.name}</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest">{selectedDisease.category}</p>
                      </div>
                   </div>
                   <button 
                    onClick={() => setSelectedDisease(null)}
                    className="p-4 bg-slate-100 rounded-full hover:bg-rose-100 hover:text-rose-600 text-slate-500 transition-colors shadow-sm"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Tabs */}
                <div className="flex gap-4 mb-8 bg-slate-50 p-2 rounded-2xl w-fit border border-slate-100">
                    <button 
                      onClick={() => setModalTab('overview')}
                      className={cn("px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all", 
                        modalTab === 'overview' ? "bg-white text-indigo-900 shadow-md" : "text-slate-500 hover:text-indigo-600"
                      )}
                    >
                      <BookOpen className="w-5 h-5"/> Standard Overview
                    </button>
                    <button 
                      onClick={() => {
                        if (!aiAnalysis) generateDeepDive(selectedDisease.name);
                        else setModalTab('ai');
                      }}
                      className={cn("px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all", 
                        modalTab === 'ai' ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-indigo-400 hover:bg-indigo-50"
                      )}
                    >
                      <Sparkles className="w-5 h-5" /> AI Deep Dive
                    </button>
                </div>

                <div className="min-h-[250px] relative">
                  <AnimatePresence mode="wait">
                    {modalTab === 'overview' ? (
                      <motion.div 
                        key="overview"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                      >
                         <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                           <h3 className="font-black text-slate-800 mb-4 text-xl flex items-center gap-2">
                             <CheckCircle className="w-6 h-6 text-indigo-500" /> Clinical Description
                           </h3>
                           <p className="text-slate-600 leading-relaxed text-lg font-medium">{selectedDisease.overview}</p>
                         </div>
                         
                         <div className="flex gap-4">
                            <div className="glass-panel border border-slate-100 flex-1 p-6 rounded-3xl flex items-center gap-4">
                              <ShieldAlert className={cn("w-10 h-10 shrink-0", selectedDisease.severity === 'High' ? "text-rose-500" : "text-amber-500")} />
                              <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Assessed Severity</span>
                                <strong className="text-2xl text-slate-800">{selectedDisease.severity}</strong>
                              </div>
                            </div>
                         </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="ai"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-indigo-950 text-white rounded-[2.5rem] p-10 overflow-hidden relative shadow-2xl border border-indigo-900"
                      >
                         <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/30 blur-[80px] rounded-full pointer-events-none" />
                         
                         <div className="relative z-10">
                           <h3 className="text-2xl font-black flex items-center gap-3 mb-8 text-white">
                             <Brain className="w-8 h-8 text-indigo-400" /> Auto-Generated Clinical Analysis
                           </h3>
                           
                           {isAiLoading ? (
                             <div className="flex flex-col items-center justify-center py-10">
                               <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mb-4" />
                               <p className="text-indigo-200 font-bold text-lg animate-pulse">Consulting global medical datasets...</p>
                             </div>
                           ) : (
                             <div className="space-y-6 text-indigo-100 text-lg leading-relaxed font-medium">
                               {aiAnalysis?.split('\n').filter(p => p.trim()).map((para, i) => (
                                 <p key={i} className="bg-white/5 p-6 rounded-2xl border border-white/10">{para}</p>
                               ))}
                             </div>
                           )}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-8 flex justify-end">
                   <button 
                     onClick={() => setSelectedDisease(null)}
                     className="px-10 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all active:scale-95"
                   >
                     Close Encyclopedia
                   </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
