import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, X, Search, CheckCircle2, ChevronRight, 
  Map, Activity, HeartPulse, User, Mail, DollarSign 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Navigation Links
  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Support', href: '#support' },
  ];

  return (
    <div className="min-h-screen bg-[#0d0f17] text-slate-200 overflow-hidden relative font-sans">
      
      {/* Background Particles/Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-pink-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* 1. Navbar */}
      <nav className="fixed w-full z-50 glass-panel border-b-0 border-white/5 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center p-[2px]">
                <div className="w-full h-full bg-[#0d0f17] rounded-[10px] flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                SuguHealth
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-sm text-slate-300 hover:text-white transition">
                  {link.name}
                </a>
              ))}
              <button 
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              >
                Register
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-300">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden glass-panel border-t border-white/5 absolute w-full left-0">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="block px-3 py-2 text-slate-300 hover:text-white">
                  {link.name}
                </a>
              ))}
              <button 
                onClick={() => navigate('/login')}
                className="w-full mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              >
                Register
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        
        {/* 2. Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-purple-500/30 text-purple-300 text-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              Elevate your digital presence
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
              Web Design, Development & <span className="text-gradient">Marketing</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              We build cutting-edge digital experiences for modern agencies and SaaS companies. Transforming ideas into beautiful, scalable realities.
            </p>
          </motion.div>

          {/* 3. Glass Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[24px] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center py-2 px-3 glass-card rounded-[20px] ring-1 ring-white/10 shadow-2xl">
              <Search className="w-6 h-6 text-slate-400 ml-3" />
              <input 
                type="text" 
                placeholder="Search services, projects, or insights..." 
                className="w-full px-4 py-3 bg-transparent text-white placeholder-slate-500 focus:outline-none"
              />
              <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-medium hover:bg-slate-200 transition whitespace-nowrap">
                Get Started
              </button>
            </div>
          </motion.div>
        </div>

        {/* 6. Services Section */}
        <div id="services" className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How we deliver <span className="text-gradient-cyan">excellence</span></h2>
            <p className="text-slate-400">Our proven process to accelerate your growth</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Map className="w-8 h-8 text-purple-400" />, title: "Strategy & Planning", desc: "We map out your digital journey focusing on user needs and business goals." },
              { icon: <Activity className="w-8 h-8 text-blue-400" />, title: "Design & Development", desc: "Creating stunning, responsive interfaces backed by robust technical architecture." },
              { icon: <HeartPulse className="w-8 h-8 text-pink-400" />, title: "Launch & Scale", desc: "Continuous monitoring, optimization, and marketing to ensure sustained growth." }
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-8 rounded-[24px] hover:border-purple-500/30 transition duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-slate-400">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 py-20 items-center">
          {/* 7. About Section (Left) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              We craft digital solutions that <span className="text-gradient">inspire</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Since our inception, we've helped hundreds of founders, clinics, and modern SaaS startups scale their vision through impeccable design and robust engineering. 
            </p>
            <ul className="space-y-4 mb-10">
              {['Award-winning design team', 'Scalable modern architectures', 'Data-driven marketing strategies'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-500" />
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
            <button className="flex items-center gap-2 text-white font-medium hover:text-purple-400 transition">
              Learn more about us <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* 4. Consultation Form (Right) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 md:p-10 rounded-[30px] border-t border-l border-white/10 relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[50px]"></div>
            
            <h3 className="text-2xl font-semibold mb-2">Book a Consultation</h3>
            <p className="text-slate-400 mb-8 max-w-sm">Let's discuss how we can transform your digital presence.</p>
            
            <form className="space-y-5 relative z-10">
              <div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input type="text" placeholder="Full Name" className="w-full pl-12 pr-4 py-3.5 bg-[#0d0f17]/50 border border-white/5 rounded-2xl focus:outline-none focus:border-purple-500/50 transition" />
                </div>
              </div>
              <div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input type="email" placeholder="Work Email" className="w-full pl-12 pr-4 py-3.5 bg-[#0d0f17]/50 border border-white/5 rounded-2xl focus:outline-none focus:border-purple-500/50 transition" />
                </div>
              </div>
              <div>
                <textarea placeholder="Tell us about your project..." rows={3} className="w-full px-4 py-3.5 bg-[#0d0f17]/50 border border-white/5 rounded-2xl focus:outline-none focus:border-purple-500/50 transition resize-none"></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-200 transition shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                Request Consultation
              </button>
            </form>
          </motion.div>
        </div>

        {/* 5. Pricing Cards */}
        <div className="py-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent <span className="text-gradient">pricing</span></h2>
            <p className="text-slate-400">Choose the perfect plan for your business</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto relative z-10">
            {/* Basic Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-10 rounded-[30px] border border-white/5 hover:border-white/10 transition"
            >
              <h3 className="text-xl font-medium text-slate-300 mb-2">Basic</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">$999</span>
                <span className="text-slate-400">/project</span>
              </div>
              <p className="text-slate-400 mb-8 border-b border-white/5 pb-8">Perfect for early stage startups needing a beautiful landing page.</p>
              
              <ul className="space-y-4 mb-8">
                {['Custom UI/UX Design', 'Responsive Development', 'Basic SEO Setup', '1 Month Support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-slate-500" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3.5 rounded-2xl glass-panel text-white font-medium hover:bg-white/5 transition border border-white/10">
                Get Started
              </button>
            </motion.div>

            {/* Premium Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card p-10 rounded-[30px] bg-gradient-to-b from-purple-900/40 to-transparent border border-purple-500/30 relative"
            >
              <div className="absolute top-0 right-10 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold text-white shadow-lg">
                POPULAR
              </div>
              <h3 className="text-xl font-medium text-purple-300 mb-2">Premium</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">$2,499</span>
                <span className="text-slate-400">/project</span>
              </div>
              <p className="text-slate-400 mb-8 border-b border-white/5 pb-8">Comprehensive solution for established businesses scaling up.</p>
              
              <ul className="space-y-4 mb-8">
                {['Full Web Application Design', 'Complex Frontend Logic', 'Advanced CMS Integration', 'Marketing Strategy', '6 Months Support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-400" />
                    <span className="text-white">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:opacity-90 transition shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                Get Started
              </button>
            </motion.div>
          </div>
        </div>
      </main>

      {/* 8. Modern Footer */}
      <footer className="border-t border-white/5 bg-[#0a0c10] pt-16 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center p-[2px]">
                  <div className="w-full h-full bg-[#0a0c10] rounded-[6px] flex items-center justify-center">
                    <Activity className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
                <span className="text-lg font-bold text-white">SuguHealth</span>
              </div>
              <p className="text-slate-400 max-w-sm">Designing the future of health tech and modern SaaS applications through beautiful interfaces.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-purple-400 transition">About</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Careers</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-purple-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} SuguHealth. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
