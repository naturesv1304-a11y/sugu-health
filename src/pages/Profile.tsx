import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, CreditCard, Shield, Bell, Smartphone, Activity, Camera, ChevronRight, Edit3, X, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export function Profile() {
  const { user } = useAuth();
  
  // Interactive States
  const [isEditing, setIsEditing] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [appleConnected, setAppleConnected] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  
  // Real-time Visual Overrides for Prototype Feedback
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [localDisplayName, setLocalDisplayName] = useState(user?.displayName || 'Guest User');
  const [isPro, setIsPro] = useState(false);
  
  // Global Modals State
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);
  
  // Custom states for functional modals
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [devices, setDevices] = useState([
    { id: 1, name: 'Apple Heart Monitor', status: 'Active', icon: Smartphone, colorClass: 'bg-rose-100 text-rose-500', dotClass: 'text-emerald-500' },
    { id: 2, name: 'Oura Ring Gen 3', status: 'Offline', icon: Activity, colorClass: 'bg-indigo-100 text-indigo-500', dotClass: 'text-slate-400' }
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuItems = [
    { icon: Settings, label: 'General Settings', desc: 'Account defaults and preferences.' },
    { icon: Shield, label: 'Privacy & Security', desc: 'Two-factor auth and active sessions.' },
    { icon: Bell, label: 'Notifications', desc: 'Email and push alerts configuration.' },
    { icon: CreditCard, label: 'Billing & Subscriptions', desc: 'Manage your SuguHealth Plus plan.' },
    { icon: Smartphone, label: 'Connected Devices', desc: 'Manage wearables and health trackers.' }
  ];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setAvatarPreview(ev.target.result as string);
          showToast('Profile picture updated successfully!');
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPaymentForm(false);
    showToast('Payment method saved securely!');
  };

  const removeDevice = (id: number) => {
    setDevices(prev => prev.filter(d => d.id !== id));
    showToast('Device connection removed.');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const newName = fd.get('displayName') as string;
    
    if (newName) setLocalDisplayName(newName);
    setIsEditing(false);
    showToast('Profile details saved successfully!');
  };

  const handleUpgrade = () => {
    setShowUpgradeModal(false);
    setIsPro(true);
    showToast('Payment processed! You are now a Pro Member.');
  };

  const defaultAvatar = `https://ui-avatars.com/api/?name=${localDisplayName.replace(' ', '+')}&background=random&size=200`;

  return (
    <div className="space-y-8 relative pb-20">
      {/* Dynamic Toast Notification - Moved to bottom center to avoid top header z-index issues */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-4 rounded-full font-bold shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center gap-3 border border-slate-700"
          >
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-[80px] -z-10 group-hover:scale-110 transition-transform duration-1000" />
        
        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-8">Personal Profile</h1>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="relative group/avatar cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-sky-500 relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-md" />
              <img 
                src={avatarPreview || user?.photoURL || defaultAvatar}
                alt="Profile"
                className="w-full h-full rounded-full object-cover relative z-10 border-4 border-white shadow-xl bg-white"
              />
              <button className="absolute bottom-0 right-0 p-2.5 bg-slate-900 text-white rounded-full shadow-lg scale-100 hover:scale-110 transition-transform z-20 hover:bg-indigo-600">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-3xl font-bold text-slate-800">{localDisplayName}</h2>
              <span className={cn("px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1 transition-colors", 
                isPro ? "bg-emerald-100 text-emerald-700 shadow-sm" : "bg-indigo-100 text-indigo-700"
              )}>
                <ShieldCheck className="w-3 h-3" /> {isPro ? "Pro Member" : "Basic Member"}
              </span>
            </div>
            <p className="text-slate-500 font-medium text-lg mb-6">{user?.email || 'user@example.com'}</p>
            
            <div className="flex gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" /> Edit Profile
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open(`http://localhost:3000/profile`, '_blank')}
                className="px-6 py-2.5 bg-white/80 text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-white shadow-sm transition-colors flex items-center gap-2"
              >
                View Public <ExternalLink className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          
          <div className="hidden lg:flex gap-6 shrink-0">
            <div className="text-center p-6 bg-white/40 rounded-[2rem] border border-white backdrop-blur-md shadow-sm">
              <h4 className="text-3xl font-black text-slate-800 tabular-nums">1.2k</h4>
              <p className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">Health Score</p>
            </div>
            <div className="text-center p-6 bg-white/40 rounded-[2rem] border border-white backdrop-blur-md shadow-sm">
              <h4 className="text-3xl font-black text-slate-800 tabular-nums">14</h4>
              <p className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">Days Streak</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-slate-800 ml-2 mb-2">Account Settings</h3>
          {menuItems.map((item, i) => (
            <motion.div 
              key={i}
              onClick={() => setSelectedSetting(item.label)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 5 }}
              className="glass-panel p-4 rounded-2xl flex items-center gap-4 group cursor-pointer hover:bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5 transition-all outline-none focus:ring-2 focus:ring-indigo-500"
              role="button"
              tabIndex={0}
            >
              <div className="p-3 bg-slate-100 group-hover:bg-indigo-100 rounded-xl text-slate-500 group-hover:text-indigo-600 transition-colors">
                <item.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800">{item.label}</h4>
                <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors mr-2 group-hover:translate-x-1" />
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-[2rem] bg-gradient-to-b from-indigo-900 via-slate-900 to-black text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[40px] rounded-full" />
            <div className="absolute top-4 right-4 animate-pulse">
              <Activity className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">SuguHealth Plus</h3>
            <p className="text-indigo-200 text-sm font-medium mb-6 leading-relaxed">Unlock advanced AI predictive models, 24/7 doctor chat, and unlimited cloud storage.</p>
            <motion.button 
              onClick={() => isPro ? showToast("You already subscribed to Pro!") : setShowUpgradeModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn("w-full py-3 rounded-xl font-black tabular-nums shadow-xl transition-all", 
                isPro ? "bg-emerald-500 text-white" : "bg-white text-indigo-900 hover:bg-slate-50"
              )}
            >
              {isPro ? "Pro Active ✓" : "Upgrade - $9.99/mo"}
            </motion.button>
          </div>

          <div className="glass-panel p-6 rounded-[2rem]">
            <h3 className="font-bold text-slate-800 mb-4">Integrations</h3>
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100 group transition-all">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center relative overflow-hidden transition-colors", appleConnected ? "bg-red-500/10 text-red-500" : "bg-slate-200 text-slate-400")}>
                <Smartphone className="w-5 h-5 relative z-10" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm">Apple Health</h4>
                <p className="text-xs text-slate-500">{appleConnected ? "Connected yesterday" : "Offline"}</p>
              </div>
              <button 
                onClick={() => setAppleConnected(!appleConnected)}
                className={cn("px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors", appleConnected ? "bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-600" : "bg-indigo-600 text-white shadow-md shadow-indigo-600/20")}
              >
                {appleConnected ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings Modals */}
      <AnimatePresence>
        {selectedSetting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedSetting(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 blur-[40px] rounded-full" />
              <div className="p-8 relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-slate-800">{selectedSetting}</h2>
                  <button onClick={() => setSelectedSetting(null)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                    <X className="w-5 h-5"/>
                  </button>
                </div>

                <div className="space-y-5">
                  {selectedSetting === 'General Settings' && (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Language</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium appearance-none">
                          <option>English (US)</option>
                          <option>Spanish</option>
                          <option>French</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Timezone</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium appearance-none">
                          <option>(GMT-05:00) Eastern Time</option>
                          <option>(GMT-08:00) Pacific Time</option>
                          <option>(GMT+00:00) UTC</option>
                        </select>
                      </div>
                    </>
                  )}

                  {selectedSetting === 'Privacy & Security' && (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 mt-2">
                        <div>
                          <p className="font-bold text-slate-800">Two-Factor Auth</p>
                          <p className="text-xs text-slate-500">Secure via SMS</p>
                        </div>
                        <input type="checkbox" className="w-5 h-5 accent-indigo-600 cursor-pointer" defaultChecked />
                      </div>
                    </>
                  )}

                  {selectedSetting === 'Notifications' && (
                    <>
                      {[
                        { title: 'Push Notifications', desc: 'Receive alerts on this device' },
                        { title: 'Email Alerts', desc: 'Health reports and updates' },
                        { title: 'SMS Alerts', desc: 'Emergency contacts and tracking' }
                      ].map((n, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <div>
                            <p className="font-bold text-slate-800">{n.title}</p>
                            <p className="text-xs text-slate-500">{n.desc}</p>
                          </div>
                          <input type="checkbox" className="w-5 h-5 accent-indigo-600 cursor-pointer" defaultChecked={idx !== 2} />
                        </div>
                      ))}
                    </>
                  )}

                  {selectedSetting === 'Billing & Subscriptions' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl border-2 border-indigo-100 bg-indigo-50/50">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-bold text-indigo-900">{isPro ? "SuguHealth Plus" : "Basic Tier"}</p>
                          <p className="font-black text-indigo-600">{isPro ? "$9.99/mo" : "Free"}</p>
                        </div>
                        <p className="text-sm text-slate-600">{isPro ? "Next billing date: Next Month" : "You are currently on the free tier."}</p>
                      </div>
                      
                      <AnimatePresence mode="wait">
                        {!showPaymentForm ? (
                          <motion.button 
                            key="btn"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPaymentForm(true)}
                            className="w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-200 transition-colors"
                          >
                            Add Payment Method
                          </motion.button>
                        ) : (
                          <motion.form 
                            key="form"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={handleAddPayment}
                            className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200"
                          >
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                              <div className="relative">
                                <CreditCard className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input required type="text" placeholder="0000 0000 0000 0000" className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Expiry Date</label>
                                <input required type="text" placeholder="MM/YY" className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">CVC</label>
                                <input required type="password" placeholder="123" className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20" />
                              </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors text-sm">Save Card</button>
                              <button type="button" onClick={() => setShowPaymentForm(false)} className="px-4 py-2 bg-white text-slate-600 font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-sm">Cancel</button>
                            </div>
                          </motion.form>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {selectedSetting === 'Connected Devices' && (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {devices.length === 0 && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 text-center text-slate-400 font-medium bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            No devices paired.
                          </motion.div>
                        )}
                        {devices.map(device => (
                          <motion.div 
                            key={device.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className="flex items-center justify-between mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden"
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", device.colorClass)}>
                                <device.icon className="w-5 h-5"/>
                              </div>
                              <div>
                                <p className="font-bold text-slate-800">{device.name}</p>
                                <p className={cn("text-xs font-bold", device.dotClass)}>● {device.status}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => removeDevice(device.id)}
                              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm"
                            >
                              Remove
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => {
                    setSelectedSetting(null);
                    showToast(`${selectedSetting} preferences saved!`);
                  }}
                  className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" /> Save Configuration
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsEditing(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-full" />
              <div className="p-8 relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-slate-800">Edit Profile</h2>
                  <button onClick={() => setIsEditing(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                    <X className="w-5 h-5"/>
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Display Name</label>
                    <input name="displayName" defaultValue={localDisplayName} required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                    <input defaultValue={user?.email || 'user@example.com'} required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-500" disabled />
                    <p className="text-xs text-slate-400 mt-2 font-medium">Emails cannot be changed directly for security reasons.</p>
                  </div>

                  <button type="submit" className="w-full mt-6 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors">
                    <CheckCircle className="w-5 h-5" /> Save Changes
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowUpgradeModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-gradient-to-br from-indigo-900 via-slate-900 to-black rounded-[2rem] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/40 blur-[50px] rounded-full mix-blend-screen" />
              <div className="p-8 relative z-10 text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-md shadow-2xl">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Upgrade to Pro</h2>
                <p className="text-indigo-200 font-medium mb-8">Confirm your payment of $9.99/mo to unlock unlimited AI services.</p>
                
                <div className="space-y-3">
                  <button onClick={handleUpgrade} className="w-full py-4 bg-white text-indigo-900 rounded-xl font-black shadow-xl hover:scale-[1.02] transition-transform">
                    Confirm Subscription
                  </button>
                  <button onClick={() => setShowUpgradeModal(false)} className="w-full py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors">
                    Cancel
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
