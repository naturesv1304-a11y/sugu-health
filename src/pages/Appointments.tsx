import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Video, VideoIcon, MapPin, MoreVertical, Plus, CalendarPlus, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Appointments() {
  const [appointmentsList, setAppointmentsList] = useState([
    { 
      id: 1, 
      doctor: 'Dr. Sugumar', 
      specialty: 'Cardiologist', 
      date: 'Oct 24, 2026', 
      time: '10:00 AM', 
      type: 'Video Consult', 
      status: 'upcoming',
      img: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random'
    },
    { 
      id: 2, 
      doctor: 'Dr. Varshitha', 
      specialty: 'Dermatologist', 
      date: 'Oct 26, 2026', 
      time: '2:30 PM', 
      type: 'In-Person', 
      status: 'upcoming',
      img: 'https://ui-avatars.com/api/?name=Michael+Chen&background=random'
    },
    { 
      id: 3, 
      doctor: 'City General Hospital', 
      specialty: 'Annual Blood Work', 
      date: 'Oct 15, 2026', 
      time: '9:00 AM', 
      type: 'Lab Test', 
      status: 'completed',
      img: 'https://ui-avatars.com/api/?name=City+General&background=random'
    }
  ]);

  const [showBookModal, setShowBookModal] = useState(false);
  const [activeDate, setActiveDate] = useState<number | null>(null);
  const [isTelehealthConnecting, setIsTelehealthConnecting] = useState(false);
  const [rescheduleId, setRescheduleId] = useState<number | null>(null);
  const [newDateVal, setNewDateVal] = useState('');

  const handleCancel = (id: number) => {
    // Optionally change the status to 'cancelled' or just remove it. Here we completely remove it for immediate visual feedback.
    setAppointmentsList(prev => prev.filter(a => a.id !== id));
  };

  const handleReschedule = (id: number) => {
    if (!newDateVal) return;
    setAppointmentsList(prev => prev.map(a => 
      a.id === id ? { ...a, date: new Date(newDateVal).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } : a
    ));
    setRescheduleId(null);
    setNewDateVal('');
  };

  const handleBook = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const doctor = fd.get('doctor') as string;
    const dateInput = fd.get('date') as string;
    const time = fd.get('time') as string;
    const type = fd.get('type') as string;
    
    if(!doctor || !dateInput || !time) return;

    const formattedDate = new Date(dateInput).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    setAppointmentsList(prev => [
      {
        id: Date.now(),
        doctor,
        specialty: type === 'Lab Test' ? 'General Checkup' : 'Specialist',
        date: formattedDate,
        time,
        type,
        status: 'upcoming',
        img: `https://ui-avatars.com/api/?name=${doctor.replace(' ', '+')}&background=random`
      },
      ...prev
    ]);
    setShowBookModal(false);
  };

  const startTelehealth = () => {
    setIsTelehealthConnecting(true);
    setTimeout(() => setIsTelehealthConnecting(false), 3000);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold mb-4">
            <Calendar className="w-5 h-5" />
            My Schedule
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">Appointments</h1>
          <p className="text-slate-500 font-medium">Manage your upcoming and past medical visits.</p>
        </div>
        
        <motion.button 
          onClick={() => setShowBookModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-600/30"
        >
          <Plus className="w-5 h-5" />
          Book Appointment
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarPlus className="w-5 h-5 text-indigo-500" />
            Upcoming
          </h2>
          
          <div className="space-y-4">
            <AnimatePresence>
            {appointmentsList.filter(a => a.status === 'upcoming').length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center text-slate-400 font-bold glass-panel rounded-3xl border-dashed border-2 border-slate-200">
                You have no upcoming appointments.
              </motion.div>
            )}
            {appointmentsList.filter(a => a.status === 'upcoming').map((apt, i) => (
              <motion.div 
                key={apt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                transition={{ duration: 0.2 }}
                className="glass-panel p-6 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-[1.5rem] p-1 bg-gradient-to-br from-indigo-500 to-sky-500 shadow-md">
                    <img src={apt.img} alt={apt.doctor} className="w-full h-full rounded-2xl object-cover border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{apt.doctor}</h3>
                    <p className="text-sm font-semibold text-slate-500">{apt.specialty}</p>
                  </div>
                </div>

                {rescheduleId === apt.id ? (
                  <div className="flex flex-col md:flex-row items-center gap-3 mt-4 md:mt-0 w-full md:w-auto p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                    <input 
                      type="date" 
                      value={newDateVal} 
                      onChange={(e) => setNewDateVal(e.target.value)} 
                      className="p-2 rounded-lg border border-indigo-200 outline-none w-full shadow-sm text-sm font-bold text-slate-700"
                    />
                    <div className="flex gap-2 w-full">
                      <button onClick={() => handleReschedule(apt.id)} className="flex-1 px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg text-sm shadow-md flex items-center justify-center gap-1"><CheckCircle className="w-4 h-4"/> Save</button>
                      <button onClick={() => setRescheduleId(null)} className="flex-1 px-4 py-2 bg-white text-slate-600 font-bold rounded-lg text-sm shadow-sm border border-slate-200 flex items-center justify-center gap-1"><X className="w-4 h-4"/> Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-4 md:gap-8 bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-4 md:mt-0 w-full md:w-auto">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        <span className="font-bold text-slate-700 text-sm whitespace-nowrap">{apt.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="font-bold text-slate-700 text-sm whitespace-nowrap">{apt.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {apt.type === 'Video Consult' ? <Video className="w-4 h-4 text-sky-500" /> : <MapPin className="w-4 h-4 text-rose-500" />}
                        <span className="font-bold text-slate-700 text-sm whitespace-nowrap">{apt.type}</span>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center gap-2 justify-end mt-4 md:mt-0 w-full md:w-auto">
                      <motion.button 
                        onClick={() => setRescheduleId(apt.id)}
                        whileHover={{ scale: 1.05 }}
                        className="flex-1 md:flex-none px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20 text-sm whitespace-nowrap"
                      >
                        Reschedule
                      </motion.button>
                      <button 
                        onClick={() => handleCancel(apt.id)}
                        className="flex-1 md:flex-none px-4 py-2 bg-white text-rose-600 border border-slate-200 rounded-xl font-bold hover:bg-rose-50 hover:border-rose-200 transition-colors text-sm whitespace-nowrap"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
            </AnimatePresence>
          </div>

          <h2 className="text-xl font-bold text-slate-800 mt-12 mb-6 flex items-center gap-2 opacity-70">
            <FileText className="w-5 h-5" />
            Past Appointments
          </h2>
          <div className="space-y-4 opacity-70">
            {appointmentsList.filter(a => a.status === 'completed').map((apt, i) => (
              <div 
                key={apt.id}
                className="glass-panel p-4 rounded-[1.5rem] flex items-center justify-between pointer-events-none grayscale-[0.2]"
              >
                <div className="flex items-center gap-4">
                  <img src={apt.img} alt={apt.doctor} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                  <div>
                    <h3 className="font-bold text-slate-800">{apt.doctor}</h3>
                    <p className="text-xs font-semibold text-slate-500">{apt.date} &bull; {apt.type}</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                  Completed
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-8 rounded-[2rem] h-fit sticky top-6 bg-gradient-to-br from-slate-900 to-indigo-900 text-white shadow-2xl relative overflow-hidden shrink-0"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/30 blur-[60px] rounded-full" />
          
          <h3 className="text-xl font-bold mb-6 relative z-10 text-white/90">Calendar Overview</h3>
          
          <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center text-sm font-bold relative z-10 mb-8">
            <div className="text-indigo-300">Su</div><div className="text-indigo-300">Mo</div><div className="text-indigo-300">Tu</div>
            <div className="text-indigo-300">We</div><div className="text-indigo-300">Th</div><div className="text-indigo-300">Fr</div><div className="text-indigo-300">Sa</div>
            
            {Array.from({ length: 31 }).map((_, i) => {
              const dayNum = i + 1;
              const hasUpcoming = appointmentsList.some(a => a.status === 'upcoming' && a.date.includes(` ${dayNum},`));
              const isSelected = activeDate === dayNum;
              // Just visual mock mapping to match initial static state: 
              const isEvent1 = dayNum === 24 || dayNum === 26 || hasUpcoming;
              
              return (
                <div 
                  key={i} 
                  onClick={() => setActiveDate(dayNum)}
                  className={cn(
                    "aspect-square flex items-center justify-center rounded-xl cursor-pointer transition-all",
                    isSelected ? "bg-white text-indigo-900 shadow-xl scale-110" : "hover:bg-white/20",
                    dayNum === 15 && !isSelected && "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] text-white",
                    isEvent1 && !isSelected && "relative before:absolute before:bottom-1 before:left-1/2 before:-translate-x-1/2 before:w-1 before:h-1 before:bg-rose-400 before:rounded-full bg-indigo-500/20 text-indigo-100",
                    !isEvent1 && dayNum !== 15 && !isSelected && "text-slate-400 font-medium"
                  )}
                >
                  {dayNum}
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 relative z-10 transition-all overflow-hidden group">
            <AnimatePresence mode="wait">
              {isTelehealthConnecting ? (
                 <motion.div 
                    key="connecting"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-4 min-h-[100px]"
                 >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex flex-col items-center justify-center animate-spin shadow-lg mb-3 border-t-2 border-white">
                      
                    </div>
                    <p className="text-sm font-bold text-white tracking-widest uppercase">Connecting to Dr...</p>
                 </motion.div>
              ) : (
                <motion.div
                  key="idle" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                >
                  <h4 className="font-bold text-white mb-1">Quick Actions</h4>
                  <p className="text-indigo-200 text-xs mb-4 leading-relaxed">Need a faster consult? Chat with a doctor online right now.</p>
                  <button 
                    onClick={startTelehealth}
                    className="w-full py-3 bg-white text-indigo-900 rounded-xl font-bold shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2 transition-transform"
                  >
                    <VideoIcon className="w-4 h-4" />
                    Start Telehealth
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Book Appointment Modal */}
      <AnimatePresence>
        {showBookModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowBookModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-full" />
              <div className="p-8 relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-slate-800">New Appointment</h2>
                  <button onClick={() => setShowBookModal(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                    <X className="w-5 h-5"/>
                  </button>
                </div>

                <form onSubmit={handleBook} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Doctor Name</label>
                    <input name="doctor" required type="text" placeholder="e.g. Dr. Adam Smith" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 font-medium" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                      <input name="date" required type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 font-medium" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Time</label>
                      <input name="time" required type="time" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 font-medium" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Type of Visit</label>
                    <select name="type" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 font-medium appearance-none">
                      <option>In-Person</option>
                      <option>Video Consult</option>
                      <option>Lab Test</option>
                    </select>
                  </div>

                  <button type="submit" className="w-full mt-6 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-600/20 hover:scale-[1.02] transition-transform">
                    Confirm Booking
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
