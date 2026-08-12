import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, Thermometer, Info, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DiseaseComparison() {
  const [d1, setD1] = useState('COVID-19');
  const [d2, setD2] = useState('Influenza A');

  const diseases = ['COVID-19', 'Influenza A', 'Common Cold', 'Dengue Fever', 'Malaria'];

  const getStats = (name: string) => {
    if (name === 'COVID-19') return { severity: 'High', incubation: '2-14 days', fatigue: true, fever: true, cough: true, rash: false, vaccine: true };
    if (name === 'Influenza A') return { severity: 'Medium', incubation: '1-4 days', fatigue: true, fever: true, cough: true, rash: false, vaccine: true };
    if (name === 'Common Cold') return { severity: 'Low', incubation: '1-3 days', fatigue: false, fever: false, cough: true, rash: false, vaccine: false };
    if (name === 'Dengue Fever') return { severity: 'High', incubation: '4-10 days', fatigue: true, fever: true, cough: false, rash: true, vaccine: true };
    return { severity: 'Medium', incubation: '10-15 days', fatigue: true, fever: true, cough: true, rash: false, vaccine: true };
  };

  const stat1 = getStats(d1);
  const stat2 = getStats(d2);

  return (
    <div className="space-y-8 relative pb-20">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Disease Comparison Matrix</h1>
        <p className="text-slate-500 font-medium mt-2 max-w-2xl">Analyze and compare pathogens side-by-side. Understand symptom overlap, severity index, and preventative measures instantly.</p>
      </div>

      <div className="glass-panel p-8 rounded-[2rem] border-sky-100 shadow-xl shadow-sky-900/5 relative overflow-hidden">
        
        {/* Dropdowns Header */}
        <div className="grid grid-cols-2 gap-8 mb-12 relative z-10">
          <div className="relative group cursor-pointer">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subject A</label>
            <select 
              value={d1} onChange={(e) => setD1(e.target.value)}
              className="w-full appearance-none bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-4 text-xl font-bold text-indigo-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all cursor-pointer shadow-sm hover:bg-white"
            >
              {diseases.map(d => <option key={`a-${d}`} value={d}>{d}</option>)}
            </select>
            <ChevronDown className="absolute right-6 top-1/2 translate-y-2 w-6 h-6 text-indigo-400 pointer-events-none group-hover:text-indigo-600 transition-colors" />
          </div>

          <div className="relative flex items-center justify-center -mx-8 pointer-events-none">
            <div className="w-12 h-12 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center font-black text-slate-400">VS</div>
          </div>

          <div className="relative group cursor-pointer">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subject B</label>
            <select 
              value={d2} onChange={(e) => setD2(e.target.value)}
              className="w-full appearance-none bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-4 text-xl font-bold text-rose-900 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 transition-all cursor-pointer shadow-sm hover:bg-white"
            >
              {diseases.map(d => <option key={`b-${d}`} value={d}>{d}</option>)}
            </select>
            <ChevronDown className="absolute right-6 top-1/2 translate-y-2 w-6 h-6 text-rose-400 pointer-events-none group-hover:text-rose-600 transition-colors" />
          </div>
        </div>

        {/* Matrix Comparison */}
        <div className="space-y-4">
          {[
            { label: 'Severity Level', a: stat1.severity, b: stat2.severity, icon: ShieldAlert },
            { label: 'Incubation Period', a: stat1.incubation, b: stat2.incubation, icon: Thermometer },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_200px_1fr] items-center text-center p-4 bg-white/50 border border-slate-100 rounded-2xl shadow-sm hover:bg-white transition-colors">
              <div className="font-bold text-lg text-indigo-800 bg-indigo-50 rounded-xl py-3 mx-4">{row.a}</div>
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><row.icon className="w-4 h-4" /></div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{row.label}</span>
              </div>
              <div className="font-bold text-lg text-rose-800 bg-rose-50 rounded-xl py-3 mx-4">{row.b}</div>
            </div>
          ))}

          {/* Boolean Symptoms Rows */}
          <div className="mt-8 pt-8 border-t border-slate-100 pb-4">
            <h3 className="text-center font-bold text-slate-800 mb-6 text-lg">Symptom Overlap</h3>
            {[
              { label: 'High Fever', a: stat1.fever, b: stat2.fever },
              { label: 'Severe Fatigue', a: stat1.fatigue, b: stat2.fatigue },
              { label: 'Continuous Cough', a: stat1.cough, b: stat2.cough },
              { label: 'Skin Rash', a: stat1.rash, b: stat2.rash },
              { label: 'Vaccine Available', a: stat1.vaccine, b: stat2.vaccine },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-[1fr_200px_1fr] items-center text-center p-3 hover:bg-white rounded-xl transition-colors">
                <div className="flex justify-center">
                  {row.a ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-slate-300" />}
                </div>
                <div className="text-sm font-bold text-slate-600">{row.label}</div>
                <div className="flex justify-center">
                  {row.b ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-slate-300" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 p-6 bg-slate-900 rounded-2xl flex items-start gap-4 shadow-xl">
          <Info className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
          <p className="text-slate-300 font-medium text-sm leading-relaxed">
            <strong className="text-white">Clinical Note:</strong> While <span className="text-indigo-300">{d1}</span> and <span className="text-rose-300">{d2}</span> may share similar initial presentations, proper clinical testing is required for an accurate diagnosis. Do not use this tool for self-medication.
          </p>
        </div>

      </div>
    </div>
  );
}
