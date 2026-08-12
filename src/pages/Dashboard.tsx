import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, AlertTriangle, Bell, Brain, Stethoscope, 
  CloudRain, Building2, Scan, ClipboardList, Newspaper, PhoneCall,
  Heart, Apple, ArrowRight, Zap, Target, Activity, ShieldAlert, FileText, Search, Pill, Droplets, Smile, Mic, Sparkles, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const categories = [
  {
    title: "AI Power Tools",
    icon: Sparkles,
    color: "text-indigo-500",
    bg: "bg-indigo-100",
    items: [
      { name: 'AI Voice Assistant', path: '/voice-assistant', icon: Mic, cols: 'md:col-span-2 lg:col-span-1', theme: 'from-indigo-500 to-purple-600', text: 'Talk to your personal medical AI directly.' },
      { name: 'AI Skin Detector', path: '/ai-detector', icon: Scan, cols: 'col-span-1', theme: 'from-pink-500 to-rose-500', text: 'Scan lesions & diseases instantly.' },
      { name: 'First Aid AI', path: '/first-aid', icon: ShieldAlert, cols: 'col-span-1', theme: 'from-red-500 to-orange-500', text: 'Emergency guidance in seconds.' },
      { name: 'AI Chat Advisor', path: '/chat', icon: MessageCircle, cols: 'md:col-span-2 lg:col-span-1', theme: 'from-blue-500 to-cyan-500', text: 'Ask medical questions securely.' },
      { name: 'Prescription Gen', path: '/ai-prescription', icon: FileText, cols: 'col-span-1', theme: 'from-emerald-500 to-teal-500', text: 'AI drafted prescriptions.' },
    ]
  },
  {
    title: "Health & Analytics",
    icon: Activity,
    color: "text-emerald-500",
    bg: "bg-emerald-100",
    items: [
      { name: 'Health Dashboard', path: '/health-dashboard', icon: Activity, cols: 'md:col-span-2', theme: 'from-emerald-600 to-teal-700', text: 'View your live vitals and daily analytics map.' },
      { name: 'Seasonal Risks', path: '/seasonal-predictor', icon: CloudRain, cols: 'col-span-1', theme: 'from-sky-400 to-blue-500', text: 'Epidemiological weather forecasts.' },
      { name: 'AI Diet Planner', path: '/ai-diet-planner', icon: Apple, cols: 'col-span-1', theme: 'from-green-400 to-emerald-500', text: 'Personalized precise meals.' },
      { name: 'Mental Wellness', path: '/mental-health', icon: Smile, cols: 'col-span-1', theme: 'from-fuchsia-400 to-pink-500', text: 'Daily mood & meditation.' },
    ]
  },
  {
    title: "Medical Network",
    icon: Stethoscope,
    color: "text-blue-500",
    bg: "bg-blue-100",
    items: [
      { name: 'Local Hospitals', path: '/hospitals', icon: Building2, cols: 'col-span-1', theme: 'from-indigo-400 to-violet-500', text: 'Nearby clinical facilities.' },
      { name: 'Find Doctors', path: '/doctors', icon: Search, cols: 'col-span-1', theme: 'from-teal-400 to-emerald-500', text: 'Book specific specialists.' },
      { name: 'MediAlert Map', path: '/medialert', icon: Pill, cols: 'md:col-span-2 lg:col-span-1', theme: 'from-amber-400 to-orange-500', text: 'Track local vaccines & med stock dynamically.' },
      { name: 'SOS Emergency', path: '/emergency', icon: PhoneCall, cols: 'col-span-1', theme: 'from-red-600 to-rose-700', text: 'Direct 911/Ambulance calling.' },
    ]
  }
];

export function Dashboard() {
  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto">
      
      {/* Hero Welcome banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-12 shadow-2xl border border-slate-800"
      >
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[400px] h-[400px] bg-gradient-to-tr from-sky-500/20 to-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl flex flex-col items-start">
          <div className="px-4 py-2 bg-indigo-500/20 text-indigo-300 font-bold rounded-full mb-8 flex items-center gap-2 border border-indigo-500/30 backdrop-blur-md">
            <Zap className="w-4 h-4 fill-indigo-400" /> System fully operational
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            The future of your <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400">Personal Health</span>
          </h2>
          <p className="text-xl text-slate-400 leading-relaxed font-medium mb-10 max-w-2xl">
            Access world-class AI diagnostics, talk natively to your medical assistant, and navigate an entire ecosystem built around predicting and enhancing your well-being.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link to="/voice-assistant" className="group flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-xl shadow-white/10 hover:shadow-indigo-500/30 border border-transparent hover:border-indigo-100">
              <Mic className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" /> Talk to AI Assistant
            </Link>
            <Link to="/health-dashboard" className="flex items-center gap-3 bg-slate-800/50 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 backdrop-blur-md transition-colors border border-slate-700 hover:border-slate-600">
              <Activity className="w-5 h-5" /> View Vitals
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Categories Bento Grid */}
      <div className="space-y-16">
        {categories.map((cat, i) => (
          <motion.div 
            key={cat.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4 px-2">
              <div className={cn("p-3 rounded-2xl", cat.bg, cat.color)}>
                <cat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">{cat.title}</h3>
              <div className="h-px bg-slate-200 flex-1 ml-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
              {cat.items.map((item, j) => (
                <Link
                  to={item.path}
                  key={item.name}
                  className={cn(
                    "group relative bg-white rounded-[2rem] p-8 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col justify-between min-h-[220px]",
                    item.cols
                  )}
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none", item.theme)} />
                  
                  <div className="flex justify-between items-start mb-auto relative z-10 w-full">
                    <div className={cn("w-16 h-16 rounded-[1.5rem] bg-gradient-to-br flex items-center justify-center text-white shadow-xl shadow-indigo-900/10 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500", item.theme)}>
                      <item.icon className="w-8 h-8" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300 shadow-sm border border-slate-100 group-hover:border-slate-900">
                      <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  <div className="relative z-10 w-full mt-6">
                    <h4 className="text-xl font-black text-slate-800 mb-2 tracking-tight group-hover:text-slate-900 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-sm font-medium text-slate-500 line-clamp-2 leading-relaxed h-10">
                      {item.text}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
