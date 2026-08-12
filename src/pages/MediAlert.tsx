import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Clock, Pill, Syringe, Calendar, ShieldCheck, ShieldPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Alert {
  id: string;
  name: string;
  time: string;
  type: 'Medicine' | 'Vaccination';
}

export function MediAlert() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState<'Medicine' | 'Vaccination'>('Medicine');

  useEffect(() => {
    const saved = localStorage.getItem('sugu_alerts');
    if (saved) setAlerts(JSON.parse(saved));
  }, []);

  const saveAlerts = (newAlerts: Alert[]) => {
    setAlerts(newAlerts);
    localStorage.setItem('sugu_alerts', JSON.stringify(newAlerts));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !time) return;

    const newAlert: Alert = {
      id: Date.now().toString(),
      name,
      time,
      type
    };

    saveAlerts([...alerts, newAlert].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()));
    setName('');
    setTime('');
  };

  const handleRemove = (id: string) => {
    saveAlerts(alerts.filter(a => a.id !== id));
  };

  const medicineCount = alerts.filter(a => a.type === 'Medicine').length;
  const vaccinationCount = alerts.filter(a => a.type === 'Vaccination').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 pt-4">
      {/* Premium Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-8"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-white flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.3)] shrink-0 animate-[pulse_3s_ease-in-out_infinite]">
             <Bell className="w-12 h-12" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-[pulse_1.5s_ease-in-out_infinite]"></span>
              Smart Reminders
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-3">
              Medi<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500">Alert</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed">
              Never miss a dose. Track your medicines and vaccinations with seamless, automated scheduling.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="relative z-10 flex gap-4 w-full lg:w-auto">
          <div className="flex-1 bg-blue-50/80 backdrop-blur-sm rounded-3xl p-5 border border-blue-100/50 flex flex-col items-center justify-center min-w-[140px]">
            <span className="text-sm font-semibold text-blue-600 mb-1">Medicines</span>
            <span className="text-3xl font-extrabold text-blue-700">{medicineCount}</span>
          </div>
          <div className="flex-1 bg-purple-50/80 backdrop-blur-sm rounded-3xl p-5 border border-purple-100/50 flex flex-col items-center justify-center min-w-[140px]">
            <span className="text-sm font-semibold text-purple-600 mb-1">Vaccines</span>
            <span className="text-3xl font-extrabold text-purple-700">{vaccinationCount}</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Add Alert Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="xl:col-span-1"
        >
          <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-50 text-indigo-600 flex items-center justify-center shadow-inner border border-indigo-100/50">
                <ShieldPlus className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800">New Alert</h2>
            </div>

            <form onSubmit={handleAdd} className="space-y-5 relative z-10">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Medication / Vaccine Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Paracetamol 500mg"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-medium text-slate-800 placeholder-slate-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Schedule Time</label>
                <input
                  type="datetime-local"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-medium text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Category</label>
                <div className="relative">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-medium text-slate-800 appearance-none cursor-pointer"
                  >
                    <option value="Medicine">💊 Medicine</option>
                    <option value="Vaccination">💉 Vaccination</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 transform active:scale-95 shadow-lg hover:shadow-indigo-500/25 duration-200"
                >
                  <Plus className="w-5 h-5" />
                  Create Alert
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Alerts List */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2"
        >
          <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex-1 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-800">Your Schedule</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Manage active alerts</p>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                <span className="text-sm font-extrabold text-slate-700">
                  {alerts.length} Active
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              {alerts.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-12 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                    <ShieldCheck className="w-10 h-10 text-emerald-400" />
                  </div>
                  <p className="text-lg font-semibold text-slate-500">All caught up!</p>
                  <p className="text-sm mt-1">No upcoming alerts scheduled.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {alerts.map((alert) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, x: -20 }}
                        layout
                        key={alert.id} 
                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 lg:p-6 rounded-[2rem] border border-slate-100 bg-white hover:bg-slate-50/50 hover:border-indigo-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(99,102,241,0.08)] transition-all duration-300 relative overflow-hidden gap-4 sm:gap-0"
                      >
                        {/* Decorative side accent */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${alert.type === 'Medicine' ? 'bg-blue-400' : 'bg-purple-400'} rounded-l-full`}></div>
                        
                        <div className="flex items-center gap-5 ml-2">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                            alert.type === 'Medicine' 
                              ? 'bg-blue-50 text-blue-500 border-blue-100/50 group-hover:scale-110 transition-transform' 
                              : 'bg-purple-50 text-purple-500 border-purple-100/50 group-hover:scale-110 transition-transform'
                          }`}>
                            {alert.type === 'Medicine' ? <Pill className="w-7 h-7" /> : <Syringe className="w-7 h-7" />}
                          </div>
                          <div>
                            <h3 className="text-xl text-slate-800 font-extrabold mb-1 tracking-tight">{alert.name}</h3>
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-sm font-semibold text-slate-600">
                                <Clock className="w-4 h-4 text-slate-400" />
                                {new Date(alert.time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at {new Date(alert.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <div className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                                alert.type === 'Medicine' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'
                              }`}>
                                {alert.type}
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemove(alert.id)}
                          className="w-12 h-12 flex flex-col items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all hover:scale-105 active:scale-95 shrink-0 hover:shadow-sm sm:self-auto self-end"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
