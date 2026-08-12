import React, { useState, useEffect } from 'react';
import { AlertTriangle, Map, Activity, MapPin, ShieldAlert, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialHotspots = [
  { id: 1, city: 'Chennai', top: '15%', left: '82%', severity: 'High', disease: 'Dengue', cases: 142, color: 'rose', trend: 'up' },
  { id: 2, city: 'Madurai', top: '68%', left: '45%', severity: 'Medium', disease: 'Malaria', cases: 45, color: 'amber', trend: 'stable' },
  { id: 3, city: 'Coimbatore', top: '46%', left: '18%', severity: 'Low', disease: 'Typhoid', cases: 12, color: 'blue', trend: 'down' },
  { id: 4, city: 'Tiruchirappalli', top: '48%', left: '55%', severity: 'High', disease: 'Dengue', cases: 89, color: 'rose', trend: 'up' },
  { id: 5, city: 'Salem', top: '32%', left: '43%', severity: 'Medium', disease: 'Cholera', cases: 34, color: 'amber', trend: 'down' }
];

export function Outbreak() {
  const [activeAlert, setActiveAlert] = useState<number | null>(null);
  const [hotspots, setHotspots] = useState(initialHotspots);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHotspots(current => 
        current.map(spot => {
          // 30% chance to update a spot each tick
          if (Math.random() > 0.7) {
            // Mostly increase, sometimes decrease
            const isIncrease = Math.random() > 0.3;
            const change = Math.floor(Math.random() * 3) + 1; // 1 to 3 cases
            
            let newCases = isIncrease ? spot.cases + change : spot.cases - change;
            if (newCases < 0) newCases = 0;
            
            let newTrend = spot.trend;
            if (newCases > spot.cases) newTrend = 'up';
            else if (newCases < spot.cases) newTrend = 'down';
            else newTrend = 'stable';
            
            // Update severity based on cases
            let newSeverity = spot.severity;
            let newColor = spot.color;
            if (newCases >= 80) { newSeverity = 'High'; newColor = 'rose'; }
            else if (newCases >= 30) { newSeverity = 'Medium'; newColor = 'amber'; }
            else { newSeverity = 'Low'; newColor = 'blue'; }

            return { ...spot, cases: newCases, trend: newTrend, severity: newSeverity, color: newColor };
          }
          return spot;
        })
      );
    }, 2800); // Check for updates every 2.8 seconds

    return () => clearInterval(interval);
  }, []);

  // Stats for the header
  const totalCases = hotspots.reduce((sum, h) => sum + h.cases, 0);
  const highRiskAreas = hotspots.filter(h => h.severity === 'High').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 pt-4">
      {/* Premium Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-8"
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-rose-500/5 to-orange-500/5 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-rose-500 via-red-500 to-orange-500 text-white flex items-center justify-center shadow-[0_0_40px_rgba(244,63,94,0.3)] shrink-0 animate-[pulse_3s_ease-in-out_infinite]">
             <AlertTriangle className="w-12 h-12" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-[pulse_1.5s_ease-in-out_infinite]"></span>
              Live Tracking
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-3">
              Outbreak <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Intelligence</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed">
              Real-time monitoring of disease hotspots, predictive spread analysis, and regional health warnings.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="relative z-10 flex gap-4 w-full lg:w-auto">
          <div className="flex-1 bg-slate-50/80 backdrop-blur-sm rounded-3xl p-5 border border-slate-100/50 flex flex-col items-center justify-center min-w-[140px]">
            <span className="text-sm font-semibold text-slate-500 mb-1">Active Cases</span>
            <span className="text-3xl font-extrabold text-slate-800">{totalCases}</span>
          </div>
          <div className="flex-1 bg-rose-50/80 backdrop-blur-sm rounded-3xl p-5 border border-rose-100/50 flex flex-col items-center justify-center min-w-[140px]">
            <span className="text-sm font-semibold text-rose-600 mb-1">Critical Zones</span>
            <span className="text-3xl font-extrabold text-rose-700">{highRiskAreas}</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Interactive Map Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-[2.5rem] p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative min-h-[600px] flex flex-col group/card"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 rounded-xl">
                  <MapPin className="w-6 h-6 text-indigo-600" />
                </div>
                Regional Heatmap
              </h3>
              <p className="text-slate-500 font-medium ml-[3.25rem] mt-1">Interactive overview of affected areas</p>
            </div>
            <div className="px-4 py-2 bg-slate-900 border border-slate-800 text-white rounded-2xl flex items-center gap-2 shadow-lg shadow-slate-900/20">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-bold tracking-wide">Tamil Nadu Region</span>
            </div>
          </div>

          <div className="relative flex-1 bg-gradient-to-b from-slate-50 to-slate-100/50 rounded-[2rem] overflow-hidden border border-slate-200/60 flex items-center justify-center group shadow-inner">
            
            <img 
              src="/tn-map.jpg" 
              alt="Map of Tamil Nadu" 
              className="w-full h-full object-contain mix-blend-multiply opacity-80 hover:opacity-100 transition-opacity duration-500 drop-shadow-2xl scale-[1.02]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.classList.add('map-fallback');
              }}
            />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 -z-10 group-[.map-fallback]:z-10 bg-slate-50">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Map className="w-10 h-10 text-slate-300" />
              </div>
              <p className="font-semibold text-slate-500">Map Visualization Unavailable</p>
              <p className="text-sm mt-2">Place <code className="bg-slate-200 px-2 py-1 rounded-lg text-slate-700 font-mono text-xs">tn-map.jpg</code> in the public directory.</p>
            </div>

            {/* Render Hotspots on the Map */}
            {hotspots.map((spot) => (
              <div 
                key={spot.id}
                className="absolute z-20 cursor-pointer group/pin"
                style={{ top: spot.top, left: spot.left, transform: 'translate(-50%, -50%)' }}
                onClick={() => setActiveAlert(activeAlert === spot.id ? null : spot.id)}
              >
                {/* Pulse ring */}
                <span className={`absolute inline-flex h-full w-full rounded-full bg-${spot.color}-400 opacity-30 animate-ping`} style={{ animationDuration: '2.5s' }}></span>
                
                {/* Pin core */}
                <div className="relative flex items-center justify-center">
                  <span className={`inline-flex items-center justify-center rounded-full w-6 h-6 bg-${spot.color}-500 border-4 border-white shadow-xl transition-all duration-300 group-hover/pin:scale-125 z-10`}></span>
                  <span className={`absolute w-10 h-10 bg-${spot.color}-500 rounded-full blur-md opacity-20 group-hover/pin:opacity-40 transition-opacity z-0`}></span>
                </div>

                {/* Popover */}
                <AnimatePresence>
                  {activeAlert === spot.id && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-56 bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/10 z-50 pointer-events-none"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-extrabold text-white text-lg">{spot.city}</span>
                        <span className={`px-2 py-1 bg-${spot.color}-500/20 text-${spot.color}-300 border border-${spot.color}-500/30 text-[10px] font-bold rounded-lg uppercase tracking-wider`}>
                          {spot.severity}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-300 mb-3">{spot.disease}</p>
                      
                      <div className="flex items-center justify-between bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
                        <span className="text-xs font-semibold text-slate-300">Active Cases</span>
                        <span className="text-sm font-extrabold text-white">{spot.cases}</span>
                      </div>
                      
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900/95 border-b border-r border-white/10 rotate-45"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sidebar Active Alerts List */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6 flex flex-col h-full"
        >
          <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex-1 flex flex-col">
            <h3 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-orange-500" />
                </div>
                Live Feed
              </div>
              <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulse_1.5s_ease-in-out_infinite]"></span>
                Updated
              </span>
            </h3>
            
            <div className="space-y-4 overflow-y-auto pr-2 flex-1 scrollbar-hide">
              {hotspots.map((spot, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  key={spot.id} 
                  onClick={() => setActiveAlert(spot.id)}
                  className={`p-5 rounded-3xl bg-white border cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    activeAlert === spot.id 
                    ? `border-${spot.color}-300 ring-4 ring-${spot.color}-50 bg-${spot.color}-50/30` 
                    : 'border-slate-100 hover:border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full bg-${spot.color}-100 flex items-center justify-center`}>
                        <ShieldAlert className={`w-4 h-4 text-${spot.color}-600`} />
                      </div>
                      <span className={`font-extrabold text-lg text-slate-800`}>{spot.disease}</span>
                    </div>
                    <span className={`px-2.5 py-1 bg-${spot.color}-50 text-${spot.color}-700 border border-${spot.color}-200/50 text-xs font-bold rounded-lg uppercase tracking-wide`}>
                      {spot.severity}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500">
                      <MapPin className="w-4 h-4" />
                      {spot.city}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-slate-400 font-medium">Cases</span>
                        <span className="text-sm font-extrabold text-slate-700">{spot.cases}</span>
                      </div>
                      {spot.trend === 'up' && <TrendingUp className="w-4 h-4 text-rose-500 ml-1" />}
                      {spot.trend === 'down' && <TrendingUp className="w-4 h-4 text-emerald-500 ml-1 rotate-180" />}
                      {spot.trend === 'stable' && <MapPin className="w-4 h-4 text-slate-400 ml-1 opacity-0" />}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

