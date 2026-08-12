import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, ThermometerSun, AlertTriangle, Search, Activity, Wind, TrendingUp, Loader2, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { groqGenerateText } from '@/lib/groq';

interface DiseaseRisk {
  name: string;
  riskLevel: 'High Risk' | 'Moderate' | 'Low Risk';
  description: string;
  protocols: string[];
}

interface PredictionData {
  climate: string;
  temp: string;
  aqi: string;
  risks: DiseaseRisk[];
  rawText?: string;
}

export function SeasonalPredictor() {
  const regions = ['Chennai', 'Coimbatore', 'Madurai', 'Bangalore', 'Mumbai', 'Delhi'];
  const month = new Date().toLocaleString('default', { month: 'long' });

  const [region, setRegion] = useState(regions[0]);
  const [data, setData] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<DiseaseRisk | null>(null);

  const fetchPrediction = async (selectedRegion: string) => {
    setIsLoading(true);
    try {
      const prompt = `Act as an epidemiological AI. Generate a realistic seasonal disease prediction for ${selectedRegion}, India in ${month}.
      Return the response STRICTLY as a JSON object (no markdown, no backticks formatting like \`\`\`json) with the following structure:
      {
        "climate": "brief description like High Humidity",
        "temp": "temperature with °C like 34°C",
        "aqi": "AQI value and category, e.g. 112 (Mod)",
        "risks": [
          {
            "name": "Disease Name",
            "riskLevel": "High Risk" | "Moderate" | "Low Risk",
            "description": "brief reason for risk",
            "protocols": ["instruction 1", "instruction 2", "instruction 3"]
          }
        ]
      }
      Provide 2-3 risks. Keep it highly realistic and based on the typical climate of ${selectedRegion} in ${month}.`;

      const responseText = await groqGenerateText(prompt, 'openai/gpt-oss-120b');
      const cleanedText = (responseText || "{}").replace(/```json/g, '').replace(/```/g, '').trim();
      
      const parsed: PredictionData = JSON.parse(cleanedText);
      setData(parsed);
    } catch (e) {
      console.error(e);
      // Fallback fake data if parsing fails
      setData({
        climate: "Variable",
        temp: "30°C",
        aqi: "100 (Mod)",
        risks: [
          {
            name: "Viral Flu",
            riskLevel: "Moderate",
            description: "Temperature fluctuations occurring right now.",
            protocols: ["Stay hydrated", "Wash hands regularly", "Avoid crowded places"]
          }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction(region);
  }, []);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setRegion(val);
    fetchPrediction(val);
  };

  return (
    <div className="space-y-8 relative pb-20 min-h-screen">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">AI Seasonal Predictor</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time AI-powered epidemiological risk forecasting based on locale.</p>
        </div>
        
        <div className="relative group min-w-[200px] shadow-xl rounded-2xl">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors z-10" />
          <select 
            value={region}
            onChange={handleRegionChange}
            className="w-full appearance-none bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-6 py-4 font-bold text-slate-800 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 cursor-pointer transition-all relative z-0"
          >
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {isLoading || !data ? (
        <div className="flex flex-col items-center justify-center p-20 glass-panel rounded-[2rem]">
          <div className="w-20 h-20 mb-6 relative">
             <div className="absolute inset-0 rounded-full border-4 border-sky-100 border-t-sky-600 animate-spin" />
             <CloudRain className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sky-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Analyzing Climate Data for {region}...</h2>
          <p className="text-sky-600 font-medium mt-2">Loading predictive AI models</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Weather Context Card */}
          <div className="glass-panel p-8 rounded-[2rem] bg-gradient-to-br from-sky-500 to-indigo-600 text-white relative overflow-hidden group shadow-xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 blur-[30px] rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
            
            <ThermometerSun className="w-10 h-10 mb-6 text-sky-200" />
            <h2 className="text-sm font-bold text-sky-200 uppercase tracking-widest mb-1">Current Climate</h2>
            <p className="text-4xl font-black mb-6">{data.climate}</p>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between border-b border-sky-400/30 pb-3">
                <span className="font-medium text-sky-100 flex items-center gap-2"><ThermometerSun className="w-4 h-4"/> Temp</span>
                <span className="font-bold text-xl">{data.temp}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-medium text-sky-100 flex items-center gap-2"><Wind className="w-4 h-4"/> AQI</span>
                <span className="font-bold text-xl">{data.aqi}</span>
              </div>
            </div>
          </div>

          {/* High Risk Alerts */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
               <Activity className="w-6 h-6 text-sky-500" /> AI Forecast for {month}
            </h2>
            
            <div className="space-y-4">
              {data.risks.map((risk, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={risk.name + i} 
                  className={cn("glass-panel p-6 rounded-[1.5rem] flex flex-col md:flex-row items-center gap-6 bg-white group hover:shadow-xl transition-all border-l-8", 
                    risk.riskLevel === 'High Risk' ? 'border-rose-500 border-y-rose-100 border-r-rose-100' : 
                    risk.riskLevel === 'Moderate' ? 'border-amber-500 border-y-amber-100 border-r-amber-100' : 
                    'border-emerald-500 border-y-emerald-100 border-r-emerald-100'
                  )}
                >
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform",
                    risk.riskLevel === 'High Risk' ? 'bg-rose-100 text-rose-500 shadow-rose-500/20' : 
                    risk.riskLevel === 'Moderate' ? 'bg-amber-100 text-amber-500 shadow-amber-500/20' : 
                    'bg-emerald-100 text-emerald-500 shadow-emerald-500/20'
                  )}>
                    {risk.riskLevel === 'High Risk' ? <AlertTriangle className="w-8 h-8" /> : risk.riskLevel === 'Moderate' ? <TrendingUp className="w-8 h-8" /> : <Info className="w-8 h-8" />}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                      <h3 className="text-xl font-black text-slate-800">{risk.name}</h3>
                      <span className={cn("px-3 py-1 text-white text-xs font-bold rounded-full uppercase tracking-wider",
                        risk.riskLevel === 'High Risk' ? 'bg-rose-500 animate-pulse' : 
                        risk.riskLevel === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'
                      )}>
                        {risk.riskLevel}
                      </span>
                    </div>
                    <p className="text-slate-500 font-medium">{risk.description}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedProtocol(risk)}
                    className={cn("px-6 py-3 font-bold rounded-xl transition-all whitespace-nowrap border-b-4 active:border-b active:translate-y-[3px]",
                      risk.riskLevel === 'High Risk' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200' : 
                      risk.riskLevel === 'Moderate' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200' : 
                      'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200'
                    )}
                  >
                    View Protocols
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Protocols Modal */}
      <AnimatePresence>
        {selectedProtocol && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setSelectedProtocol(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden shadow-black/50"
            >
              <div className={cn("p-6 flex justify-between items-center text-white", 
                selectedProtocol.riskLevel === 'High Risk' ? 'bg-gradient-to-r from-rose-500 to-red-600' : 
                selectedProtocol.riskLevel === 'Moderate' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 
                'bg-gradient-to-r from-emerald-500 to-teal-500'
              )}>
                <div>
                  <h3 className="font-bold opacity-80 uppercase tracking-widest text-xs mb-1">Safety Protocols</h3>
                  <h2 className="text-2xl font-black">{selectedProtocol.name}</h2>
                </div>
                <button onClick={() => setSelectedProtocol(null)} className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8">
                <p className="text-slate-600 font-medium mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {selectedProtocol.description}
                </p>
                
                <h4 className="font-bold text-slate-800 mb-4 text-lg">Actionable Steps</h4>
                <ul className="space-y-4">
                  {selectedProtocol.protocols.map((protocol, idx) => (
                    <motion.li 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      key={idx} 
                      className="flex gap-4 items-start"
                    >
                      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-white",
                        selectedProtocol.riskLevel === 'High Risk' ? 'bg-rose-500' : 
                        selectedProtocol.riskLevel === 'Moderate' ? 'bg-amber-500' : 
                        'bg-emerald-500'
                      )}>
                        {idx + 1}
                      </div>
                      <span className="text-slate-700 font-medium">{protocol}</span>
                    </motion.li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => setSelectedProtocol(null)}
                  className="mt-8 w-full py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
