import React, { useState, useEffect, useRef } from 'react';
import { Search, Star, Phone, Video, Mail, MessageSquare, X, Send, Sparkles, Stethoscope, Clock, ShieldCheck, Award } from 'lucide-react';
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { motion, AnimatePresence } from 'framer-motion';

const doctors = [
  {
    id: 1,
    name: "Dr. Sugumar",
    specialty: "Neurologist",
    exp: "18 yrs exp",
    email: "manokarsugumar79@gmail.com",
    phone: "+919566377414",
    skills: ["Epilepsy", "Stroke"],
    rating: 4.5,
    slots: ["10:00 AM", "12:00 PM", "4:00 PM"]
  },
  {
    id: 2,
    name: "Dr. Varshitha",
    specialty: "Cardiologist",
    exp: "18 yrs exp",
    email: "varshithakaruppusamy@gmail.com",
    phone: "+918610437950",
    skills: ["Heart Care", "Surgery"],
    rating: 4.8,
    slots: ["9:00 AM", "1:00 PM", "6:00 PM"]
  }
];

export function Doctors() {
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatOpen]);

  // 🔥 REALTIME LISTENER
  useEffect(() => {
    if (!selectedDoctor) return;

    const unsubscribe = onSnapshot(
      collection(db, "chats", selectedDoctor.name, "messages"),
      (snapshot) => {
        const msgs = snapshot.docs.map(doc => doc.data());
        msgs.sort((a, b) => {
          const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (new Date(a.createdAt || 0)).getTime();
          const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (new Date(b.createdAt || 0)).getTime();
          return timeA - timeB;
        });
        setMessages(msgs);
      }
    );

    return () => unsubscribe();
  }, [selectedDoctor]);

  // 🔥 SEND MESSAGE TO FIREBASE
  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim()) return;

    await addDoc(
      collection(db, "chats", selectedDoctor.name, "messages"),
      {
        text: message,
        sender: "user",
        createdAt: new Date()
      }
    );

    setMessage("");
  };

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase()) || 
    d.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12 pt-4">
      {/* Premium Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center justify-center text-center"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/10 to-blue-500/5 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-500/5 to-teal-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 text-white flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.3)] mb-8 animate-[pulse_3s_ease-in-out_infinite]">
             <Stethoscope className="w-12 h-12" />
          </div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-[pulse_1.5s_ease-in-out_infinite]"></span>
            Top Specialists
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Medical <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Directory</span>
          </h2>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mb-10 leading-relaxed">
            Connect instantly with world-class healthcare professionals. Schedule appointments, chat, or voice call seamlessly.
          </p>
          
          {/* Awesome Search Bar */}
          <div className="w-full max-w-2xl relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
              <Search className="w-6 h-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, specialty, or expert skills..."
              className="w-full pl-16 pr-6 py-5 rounded-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-medium text-lg text-slate-800 placeholder-slate-400 shadow-sm"
            />
          </div>
        </div>
      </motion.div>

      {/* Grid of Tantalizing Doctor Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
        <AnimatePresence>
          {filtered.map((doc, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.1 }}
              key={doc.id} 
              className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col group hover:shadow-[0_8px_30px_rgb(99,102,241,0.08)] hover:border-indigo-100 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-[100px] -z-0 pointer-events-none group-hover:bg-indigo-100/50 transition-colors duration-500"></div>
              
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-start gap-6 mb-8">
                {/* Avatar Profile placeholder */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-blue-50 border-4 border-white shadow-lg shrink-0 flex items-center justify-center relative">
                   <span className="text-3xl font-extrabold text-indigo-400">{doc.name.charAt(4)}</span>
                   <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-400 border-4 border-white flex items-center justify-center">
                     <ShieldCheck className="w-4 h-4 text-white" />
                   </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
                        {doc.name}
                      </h3>
                      <p className="text-indigo-500 font-bold mb-3">{doc.specialty}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-extrabold text-amber-700 text-sm">{doc.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 text-sm font-semibold rounded-lg border border-slate-100">
                      <Award className="w-4 h-4 text-slate-400" />
                      {doc.exp}
                    </div>
                    {doc.skills.map((skill, i) => (
                      <div key={i} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider rounded-lg border border-indigo-100/50">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Slots row */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Available Slots Today</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {doc.slots.map((slot, i) => (
                    <div key={i} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm cursor-pointer transition-all active:scale-95">
                      {slot}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="mt-auto grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
                <a href={`tel:${doc.phone}`} className="flex-1 sm:flex-none btn-red !px-4 !py-3 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-xl flex justify-center items-center gap-2 font-bold shadow-Rose-500/20 shadow-lg hover:shadow-Rose-500/40">
                  <Phone className="w-4 h-4" /> <span className="hidden sm:inline">Call</span>
                </a>

                <a href="https://meet.jit.si/SuguHealthRoom" target="_blank" rel="noreferrer" className="flex-1 sm:flex-none btn-blue !px-4 !py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl flex justify-center items-center gap-2 font-bold shadow-blue-500/20 shadow-lg hover:shadow-blue-500/40">
                  <Video className="w-4 h-4" /> <span className="hidden sm:inline">Video</span>
                </a>

                <a href={`mailto:${doc.email}`} className="flex-1 sm:flex-none btn-green !px-4 !py-3 bg-gradient-to-r from-emerald-400 to-green-500 text-white rounded-xl flex justify-center items-center gap-2 font-bold shadow-emerald-500/20 shadow-lg hover:shadow-emerald-500/40">
                  <Mail className="w-4 h-4" /> <span className="hidden sm:inline">Email</span>
                </a>

                <a href={`https://wa.me/${doc.phone}`} target="_blank" rel="noreferrer" className="flex-1 sm:flex-none btn-teal !px-4 !py-3 bg-gradient-to-r from-teal-400 to-emerald-500 text-white rounded-xl flex justify-center items-center gap-2 font-bold shadow-teal-500/20 shadow-lg hover:shadow-teal-500/40">
                  <MessageSquare className="w-4 h-4" /> <span className="hidden sm:inline">WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    setSelectedDoctor(doc);
                    setChatOpen(true);
                  }}
                  className="col-span-2 sm:flex-1 btn-yellow !px-4 !py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl flex justify-center items-center gap-2 font-bold !shadow-lg hover:!shadow-amber-500/30 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" /> <span className="font-bold">SUGU Chat</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filtered.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-white rounded-[3rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
               <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800">No Specialists Found</h3>
            <p className="text-slate-500 font-medium">Try adjusting your search terms.</p>
          </div>
        )}
      </div>

      {/* 🔥 REAL CHAT UI - Redesigned Premium Glass Pane */}
      <AnimatePresence>
        {chatOpen && selectedDoctor && (
          <>
            {/* Backdrop for mobile, invisible on desktop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 sm:hidden"
              onClick={() => setChatOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed bottom-0 sm:bottom-6 right-0 sm:right-6 w-full sm:w-[400px] sm:h-[600px] h-[85vh] bg-white/95 backdrop-blur-xl sm:rounded-[2.5rem] rounded-t-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-t sm:border border-white/20 z-50 flex flex-col overflow-hidden"
            >
              {/* Chat Header */}
              <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center justify-between shadow-md z-10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <span className="font-bold text-white text-lg">{selectedDoctor.name.charAt(4)}</span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white leading-tight">{selectedDoctor.name}</h3>
                    <div className="flex items-center gap-1.5 opacity-90 text-xs mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Online • Direct Secure Line
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setChatOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-5 scrollbar-hide space-y-4 bg-slate-50/50">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4 opacity-50">
                    <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
                    <p className="text-sm font-medium text-slate-500">Send a message to instantly connect with {selectedDoctor.name}.</p>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === "user" ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl ${
                        msg.sender === "user" 
                          ? 'bg-indigo-600 text-white rounded-br-sm shadow-indigo-600/20 shadow-lg' 
                          : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm shadow-[0_4px_20px_rgb(0,0,0,0.03)]'
                      }`}>
                        <p className="text-[15px] font-medium leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                <form onSubmit={sendMessage} className="flex items-center gap-2">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your health query..."
                    className="flex-1 bg-slate-50 border border-slate-200 px-5 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-medium text-[15px]"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="w-14 h-14 shrink-0 bg-indigo-600 text-white rounded-full font-bold flex items-center justify-center shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transform active:scale-95 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    <Send className="w-5 h-5 ml-0.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
