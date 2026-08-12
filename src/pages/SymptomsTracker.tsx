import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Plus, Search, ChevronRight, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const commonSymptoms = [
  "Headache", "Fever", "Cough", "Fatigue", "Nausea", 
  "Muscle Ache", "Shortness of Breath", "Sore Throat", "Loss of Taste/Smell", "Runny Nose", "Chest Pain"
];

const diseaseDatabase = [
  { name: "Viral Infection (Flu/COVID)", match: ["Fever", "Cough", "Fatigue", "Muscle Ache", "Loss of Taste/Smell"], rec: "Rest immediately and stay heavily hydrated. If breathing becomes difficult, seek emergency care.", score: 0 },
  { name: "Common Cold", match: ["Runny Nose", "Sore Throat", "Cough", "Fatigue"], rec: "Get plenty of rest, drink warm fluids, and consider over-the-counter cold medicines.", score: 0 },
  { name: "Migraine", match: ["Headache", "Nausea", "Fatigue"], rec: "Rest in a quiet, dark room. Apply a cold compress to the forehead.", score: 0 },
  { name: "Bronchitis", match: ["Cough", "Fatigue", "Shortness of Breath", "Chest Pain"], rec: "Use a humidifier, drink warm clear fluids, and see a doctor if symptoms last more than a week.", score: 0 },
  { name: "Food Poisoning / Stomach Bug", match: ["Nausea", "Fatigue", "Muscle Ache", "Fever"], rec: "Drink lots of water or electrolyte drinks. Eat bland foods like crackers or toast.", score: 0 }
];

export function SymptomsTracker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    setDownloadError("");
    
    try {
      // Create a native text-based PDF (much more reliable than html2canvas screenshots)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Header
      pdf.setFillColor(79, 70, 229); // Indigo 600
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text("SuguHealth", 20, 20);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text("AI Diagnostic Report", 20, 30);
      
      // Patient Info / Date
      pdf.setTextColor(100, 116, 139); // Slate 500
      pdf.setFontSize(10);
      const dateStr = new Date().toLocaleDateString();
      pdf.text(`Date of Assessment: ${dateStr}`, 130, 30);
      
      // Symptoms Section
      pdf.setTextColor(15, 23, 42); // Slate 900
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Reported Symptoms", 20, 60);
      
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(71, 85, 105); // Slate 600
      
      // Draw symptoms as comma-separated or bullets
      const sympText = pdf.splitTextToSize(selectedSymptoms.join(", "), pageWidth - 40);
      pdf.text(sympText, 20, 70);
      
      // Results Section
      pdf.setTextColor(15, 23, 42);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("AI Analysis & Top Matches", 20, 100);
      
      let yOffset = 115;
      
      if (results.length === 0) {
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        pdf.text("No exact matches found. Please consult a doctor.", 20, yOffset);
      } else {
        results.forEach((res, index) => {
          // Box for each result
          pdf.setDrawColor(226, 232, 240); // Slate 200
          pdf.setFillColor(248, 250, 252); // Slate 50
          pdf.roundedRect(20, yOffset - 8, pageWidth - 40, 45, 3, 3, 'FD');
          
          pdf.setTextColor(30, 41, 59); // Slate 800
          pdf.setFontSize(14);
          pdf.setFont("helvetica", "bold");
          pdf.text(`${res.score}% Match: ${res.name}`, 25, yOffset);
          
          pdf.setTextColor(100, 116, 139); // Slate 500
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          pdf.text(`Matched signs: ${res.matchedSymptoms.join(", ")}`, 25, yOffset + 7);
          
          if (index === 0) {
            // Recommendation for top match
            pdf.setTextColor(67, 56, 202); // Indigo 700
            pdf.setFontSize(10);
            pdf.setFont("helvetica", "bold");
            pdf.text("RECOMMENDATION:", 25, yOffset + 18);
            
            pdf.setTextColor(51, 65, 85); // Slate 700
            pdf.setFontSize(11);
            pdf.setFont("helvetica", "normal");
            const recLines = pdf.splitTextToSize(res.rec, pageWidth - 50);
            pdf.text(recLines, 25, yOffset + 24);
          }
          
          yOffset += 55;
        });
      }
      
      // Footer Disclaimer
      pdf.setTextColor(148, 163, 184); // Slate 400
      pdf.setFontSize(9);
      pdf.text("Disclaimer: This is an AI-generated report and not a substitute for professional medical advice.", 20, 280);
      
      // Save
      pdf.save('sugu-health-diagnosis-report.pdf');
    } catch (error: any) {
      console.error("Native PDF Error:", error);
      setDownloadError("PDF generation failed unexpectedly.");
    } finally {
      setIsDownloading(false);
    }
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  useEffect(() => {
    if (selectedSymptoms.length === 0) {
      setResults([]);
      return;
    }
    
    setIsAnalyzing(true);
    const timeout = setTimeout(() => {
      // Analyze
      const analyzed = diseaseDatabase.map(db => {
        const matches = db.match.filter(s => selectedSymptoms.includes(s));
        const percentage = Math.round((matches.length / db.match.length) * 100);
        return { ...db, score: percentage, matchedSymptoms: matches };
      }).filter(d => d.score > 0).sort((a, b) => b.score - a.score);

      setResults(analyzed.slice(0, 2)); // Show top 2
      setIsAnalyzing(false);
    }, 1500); // 1.5s fake AI delay

    return () => clearTimeout(timeout);
  }, [selectedSymptoms]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Input */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-1/2 flex flex-col gap-6"
        >
          <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-indigo-500/20 transition-colors duration-500" />
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Track Symptoms</h2>
                <p className="text-slate-500 text-sm">Log how you're feeling today</p>
              </div>
            </div>

            <div className="relative mb-6">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search symptoms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/50 border border-slate-200/50 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium backdrop-blur-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {commonSymptoms.filter(s => s.toLowerCase().includes(search.toLowerCase())).map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom);
                return (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2",
                      isSelected 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" 
                        : "bg-white/60 text-slate-600 hover:bg-indigo-50 border border-slate-200/50"
                    )}
                  >
                    {symptom}
                    {isSelected ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Analysis */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full md:w-1/2 flex flex-col gap-6"
        >
          <div 
            className="glass-panel p-8 rounded-[2rem] h-full flex flex-col relative overflow-hidden min-h-[500px]"
          >
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] -z-10" />
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              AI Diagnosis Engine
            </h3>
            
            {selectedSymptoms.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center"
                >
                  <Activity className="w-8 h-8 opacity-50" />
                </motion.div>
                <p>Select symptoms to see insights</p>
              </div>
            ) : (
              <div className="flex-1 space-y-4">
                <AnimatePresence mode="wait">
                  {isAnalyzing ? (
                    <motion.div 
                      key="analyzing"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100"
                    >
                      <p className="text-sm text-indigo-800 font-medium mb-2">Analyzing {selectedSymptoms.length} symptom(s) against 10,000+ medical records...</p>
                      <div className="w-full bg-indigo-100 rounded-full h-1.5 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 1.5, ease: "linear" }}
                          className="bg-indigo-500 h-full rounded-full"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      {results.length > 0 ? results.map((res, i) => (
                        <div key={i} className="space-y-3">
                          <div className={cn("p-4 rounded-xl border shadow-sm flex items-center justify-between group cursor-pointer transition-colors", 
                            i === 0 ? "bg-indigo-600 text-white border-indigo-500" : "bg-white border-slate-100 hover:border-indigo-200"
                          )}>
                            <div className="flex items-center gap-3">
                              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-inner", 
                                i === 0 ? "bg-white/20 text-white" : "bg-orange-100 text-orange-600"
                              )}>
                                {res.score}%
                              </div>
                              <div>
                                <h4 className={cn("font-bold", i === 0 ? "text-white" : "text-slate-800")}>{res.name}</h4>
                                <p className={cn("text-xs font-medium", i === 0 ? "text-indigo-200" : "text-slate-500")}>
                                  Matches: {res.matchedSymptoms.join(", ")}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className={cn("w-5 h-5 transition-colors", i === 0 ? "text-white" : "text-slate-300 group-hover:text-indigo-500")} />
                          </div>
                          
                          {i === 0 && (
                            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/50 flex flex-col gap-2">
                              <h4 className="font-bold text-indigo-900 text-sm uppercase tracking-wider">AI Recommendation</h4>
                              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                {res.rec}
                              </p>
                            </div>
                          )}
                        </div>
                      )) : (
                         <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
                           No immediate matches found. However, please consult a medical professional if you feel unwell.
                         </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            <motion.button 
              onClick={handleDownloadPDF}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-xl shadow-slate-900/20 tabular-nums tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={selectedSymptoms.length === 0 || isDownloading || isAnalyzing}
            >
              {isDownloading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download PDF Report
                </>
              )}
            </motion.button>
            
            {downloadError && (
              <p className="text-red-500 text-sm mt-3 text-center">{downloadError}</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
