import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  MessageCircle, AlertTriangle, Bell, Brain, Stethoscope, 
  CloudRain, Building2, Scan, ClipboardList, Newspaper, 
  PhoneCall, Users, LogOut, Menu, X, Activity, Heart, Apple,
  User, CalendarDays, ShieldAlert, Library, LifeBuoy,
  Mic, ThermometerSun, FileText, Scale
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const getBackgroundTheme = (path: string) => {
  switch (path) {
    case '/': return { bg: 'bg-slate-50', orb1: 'bg-indigo-300/30', orb2: 'bg-sky-300/30' };
    case '/chat': return { bg: 'bg-purple-50', orb1: 'bg-fuchsia-300/30', orb2: 'bg-purple-300/30' };
    case '/outbreak': return { bg: 'bg-rose-50', orb1: 'bg-rose-400/20', orb2: 'bg-red-300/30' };
    case '/news': return { bg: 'bg-orange-50', orb1: 'bg-amber-300/30', orb2: 'bg-orange-300/30' };
    case '/ai-detector': return { bg: 'bg-blue-50', orb1: 'bg-cyan-300/30', orb2: 'bg-blue-300/30' };
    case '/mental-health': return { bg: 'bg-emerald-50', orb1: 'bg-teal-300/30', orb2: 'bg-emerald-300/30' };
    case '/nutrition': return { bg: 'bg-lime-50', orb1: 'bg-green-300/30', orb2: 'bg-lime-300/30' };
    case '/myth-busters': return { bg: 'bg-fuchsia-50', orb1: 'bg-pink-300/30', orb2: 'bg-purple-300/30' };
    case '/doctors': return { bg: 'bg-cyan-50', orb1: 'bg-sky-300/30', orb2: 'bg-cyan-300/30' };
    case '/hospitals': return { bg: 'bg-indigo-50', orb1: 'bg-indigo-300/30', orb2: 'bg-violet-300/30' };
    case '/weather': return { bg: 'bg-sky-50', orb1: 'bg-blue-300/30', orb2: 'bg-sky-300/30' };
    case '/quiz': return { bg: 'bg-yellow-50', orb1: 'bg-yellow-400/20', orb2: 'bg-orange-300/30' };
    case '/medialert': return { bg: 'bg-rose-50', orb1: 'bg-rose-300/30', orb2: 'bg-red-300/30' };
    case '/emergency': return { bg: 'bg-red-50', orb1: 'bg-red-400/30', orb2: 'bg-rose-400/30' };
    case '/team': return { bg: 'bg-slate-100', orb1: 'bg-slate-300/40', orb2: 'bg-gray-300/40' };
    case '/symptoms': return { bg: 'bg-indigo-50', orb1: 'bg-indigo-300/30', orb2: 'bg-purple-300/30' };
    case '/health-dashboard': return { bg: 'bg-slate-50', orb1: 'bg-indigo-400/20', orb2: 'bg-purple-400/20' };

    case '/disease-library': return { bg: 'bg-slate-50', orb1: 'bg-blue-400/20', orb2: 'bg-indigo-400/20' };
    case '/first-aid': return { bg: 'bg-red-50', orb1: 'bg-red-500/20', orb2: 'bg-rose-500/20' };
    case '/profile': return { bg: 'bg-slate-50', orb1: 'bg-slate-400/20', orb2: 'bg-indigo-300/20' };
    case '/appointments': return { bg: 'bg-indigo-50', orb1: 'bg-indigo-400/20', orb2: 'bg-sky-400/20' };
    case '/ai-diet-planner': return { bg: 'bg-lime-50', orb1: 'bg-emerald-300/20', orb2: 'bg-lime-300/20' };
    case '/disease-comparison': return { bg: 'bg-sky-50', orb1: 'bg-sky-400/20', orb2: 'bg-rose-300/20' };
    case '/voice-assistant': return { bg: 'bg-slate-50', orb1: 'bg-indigo-300/10', orb2: 'bg-purple-300/10' };
    case '/seasonal-predictor': return { bg: 'bg-sky-50', orb1: 'bg-sky-400/20', orb2: 'bg-indigo-300/20' };
    case '/ai-prescription': return { bg: 'bg-slate-50', orb1: 'bg-indigo-300/20', orb2: 'bg-sky-300/20' };
    default: return { bg: 'bg-[#f8fafc]', orb1: 'bg-indigo-300/20', orb2: 'bg-sky-300/20' };
  }
};

export function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();

  const theme = getBackgroundTheme(location.pathname);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Activity },
    { name: 'Health Dashboard', path: '/health-dashboard', icon: Heart },
    { name: 'Chat Assistant', path: '/chat', icon: MessageCircle },
    { name: 'Symptoms Tracker', path: '/symptoms', icon: Activity },

    { name: 'Disease Library', path: '/disease-library', icon: Library },
    { name: 'First Aid AI', path: '/first-aid', icon: LifeBuoy },
    { name: 'Appointments', path: '/appointments', icon: CalendarDays },
    { name: 'Outbreak Alerts', path: '/outbreak', icon: AlertTriangle },
    { name: 'MediAlert', path: '/medialert', icon: Bell },
    { name: 'Myth Busters', path: '/myth-busters', icon: Brain },
    { name: 'Doctor Directory', path: '/doctors', icon: Stethoscope },
    { name: 'Weather Precautions', path: '/weather', icon: CloudRain },
    { name: 'Hospitals & Meds', path: '/hospitals', icon: Building2 },
    { name: 'AI Health Detector', path: '/ai-detector', icon: Scan },
    { name: 'Health Quiz', path: '/quiz', icon: ClipboardList },
    { name: 'Mental Health', path: '/mental-health', icon: Heart },
    { name: 'Nutrition & Diet', path: '/nutrition', icon: Apple },
    { name: 'Health News', path: '/news', icon: Newspaper },
    { name: 'Emergency', path: '/emergency', icon: PhoneCall },

    { name: 'Profile', path: '/profile', icon: User },
    { name: 'AI Diet Planner', path: '/ai-diet-planner', icon: Apple },
    { name: 'Disease Compare', path: '/disease-comparison', icon: Scale },
    { name: 'Voice Assistant', path: '/voice-assistant', icon: Mic },
    { name: 'Season Predictor', path: '/seasonal-predictor', icon: ThermometerSun },
    { name: 'AI Prescription', path: '/ai-prescription', icon: FileText },
    { name: 'Our Team', path: '/team', icon: Users },
  ];

  return (
    <div className={cn("flex h-screen text-slate-800 overflow-hidden font-sans relative selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-700", theme.bg)}>
      
      {/* Background ambient blurs */}
      <div className={cn("absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none mix-blend-multiply transition-colors duration-1000", theme.orb1)} />
      <div className={cn("absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none mix-blend-multiply transition-colors duration-1000", theme.orb2)} />

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 88 }}
        className={cn(
          "relative z-40 flex flex-col m-4 rounded-[2rem] glass-panel border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hidden md:flex"
        )}
      >
        <div className="flex items-center justify-between h-24 px-6">
          <div className={cn("flex items-center gap-3", !isSidebarOpen && "justify-center w-full")}>
            <div className="flex items-center justify-center min-w-[40px] w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white font-bold shadow-lg shadow-indigo-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <AnimatePresence>
              {isSidebarOpen && (
               <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-sky-600 whitespace-nowrap overflow-hidden"
                >
                  SuguHealth
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-4 space-y-1.5 scrollbar-hide">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 group",
                  isActive 
                    ? "bg-white/80 shadow-[0_2px_15px_rgb(0,0,0,0.04)] border border-white text-indigo-700" 
                    : "text-slate-500 hover:bg-white/60 hover:text-slate-900 border border-transparent",
                  !isSidebarOpen && "justify-center px-0"
                )}
                title={!isSidebarOpen ? item.name : undefined}
              >
                {isActive && (
                  <motion.div layoutId="activeNavIndicator" className="absolute inset-0 bg-white shadow-sm rounded-2xl -z-10" />
                )}
                <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500")} />
                {isSidebarOpen && <span className="font-semibold whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </div>

        <div className="p-4 mt-auto">
          <button
            onClick={logout}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-100 transition-all font-semibold group",
              !isSidebarOpen && "justify-center px-0"
            )}
            title={!isSidebarOpen ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <header className="flex items-center justify-between h-24 px-8 shrink-0 relative z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-3 rounded-2xl bg-white/70 backdrop-blur-md shadow-sm border border-white text-slate-500 hover:text-indigo-600 transition-colors hidden md:block"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {navItems.find(item => item.path === location.pathname)?.name || 'Overview'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md shadow-sm border border-white p-2 pr-5 rounded-full transition-all hover:bg-white">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=random`} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-bold text-slate-800 leading-tight">{user.displayName}</p>
                  <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider">Active User</p>
                </div>
              </div>
            )}
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto px-8 pb-8 pt-2 scrollbar-hide relative z-10">
          <div className="max-w-7xl mx-auto h-full w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
