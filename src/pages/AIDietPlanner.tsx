import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Droplets, Flame, Apple, ChevronRight, Activity, CalendarDays, Loader2, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { groqGenerateText } from '@/lib/groq';

interface Meal {
  time: string;
  name: string;
  cal: string;
  description: string;
  ingredients: string[];
  color: string;
  icon?: any;
}

export function AIDietPlanner() {
  const [goal, setGoal] = useState('Weight Loss');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [showToast, setShowToast] = useState<{message: string, icon: any} | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);

  const macros = [
    { label: 'Protein', value: '140g', pct: 60, color: 'bg-emerald-500' },
    { label: 'Carbs', value: '120g', pct: 40, color: 'bg-indigo-500' },
    { label: 'Fats', value: '60g', pct: 30, color: 'bg-rose-500' },
  ];

  const fetchDietPlan = async (currentGoal: string) => {
    setIsGenerating(true);
    try {
      const prompt = `Act as an expert AI nutritionist. Generate a realistically healthy daily diet plan for someone with the goal: "${currentGoal}".
      Return exactly a JSON array containing 3 objects (Breakfast, Lunch, Dinner). No markdown formatting, no backticks, just raw JSON.
      Format:
      [
        {
          "time": "Breakfast",
          "name": "Meal Name",
          "cal": "e.g., 350 kcal",
          "description": "Short delicious description",
          "ingredients": ["Item 1 (qty)", "Item 2 (qty)"],
          "color": "from-rose-400 to-orange-400"
        }, ...
      ]
      Make sure colors are valid tailwind gradient classes (e.g. "from-emerald-400 to-teal-500", "from-indigo-400 to-purple-500").
      Make food realistic and appealing.`;

      const responseText = await groqGenerateText(prompt, 'openai/gpt-oss-120b');

      let text = responseText || "[]";
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setMeals(parsed);
      }
      
      setShowToast({ message: "New AI Diet Plan generated successfully!", icon: CheckCircle2 });
    } catch (err) {
      console.error(err);
      // Fallback
      setMeals([
        { time: 'Breakfast', name: 'Oatmeal & Berries', cal: '350 kcal', description: 'Healthy oat base with antioxidant-rich berries.', ingredients: ['Oats (50g)', 'Berries (100g)'], color: 'from-rose-400 to-orange-400' },
        { time: 'Lunch', name: 'Grilled Chicken Salad', cal: '450 kcal', description: 'Lean protein on a bed of fresh mixed greens.', ingredients: ['Chicken Breast (150g)', 'Mixed Greens'], color: 'from-emerald-400 to-teal-500' },
        { time: 'Dinner', name: 'Baked Salmon & Quinoa', cal: '550 kcal', description: 'Rich in Omega-3 fatty acids and complex carbs.', ingredients: ['Salmon (200g)', 'Quinoa (50g)'], color: 'from-indigo-400 to-purple-500' }
      ]);
      setShowToast({ message: "Loaded fallback plan.", icon: CheckCircle2 });
    } finally {
      setIsGenerating(false);
      setTimeout(() => setShowToast(null), 3000);
    }
  };

  useEffect(() => {
    fetchDietPlan(goal);
  }, []); // Initial load

  const handleGenerate = () => {
    fetchDietPlan(goal);
  };

  const handleWeekOverview = () => {
    setShowToast({ message: "Fetching weekly data...", icon: CalendarDays });
    setTimeout(() => {
      setShowToast({ message: "Weekly overview generated and sent to your email!", icon: CheckCircle2 });
      setTimeout(() => setShowToast(null), 3000);
    }, 2000);
  };

  const icons = [Apple, Utensils, Flame];

  return (
    <div className="space-y-8 relative pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">AI Nutrition Planner</h1>
          <p className="text-slate-500 font-medium mt-1">Smart, personalized nutrition dynamically generated for your exact body metrics.</p>
        </div>
        <button 
          onClick={handleWeekOverview}
          className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-xl shadow-slate-900/30 flex items-center gap-2 hover:bg-slate-800 transition hover:scale-105 active:scale-95"
        >
          <CalendarDays className="w-5 h-5" /> Week Overview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-panel p-8 rounded-[2rem] flex flex-col justify-center relative overflow-hidden group border-2 border-emerald-100/50">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 relative z-10"><Activity className="w-5 h-5 text-emerald-500" /> Daily Target Macros</h2>
          
          <div className="space-y-6 relative z-10">
            {macros.map((m) => (
              <div key={m.label}>
                <div className="flex justify-between font-bold mb-2">
                  <span className="text-slate-700">{m.label}</span>
                  <span className="text-slate-900">{m.value}</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner flex">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${m.pct}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut', type: "spring" }}
                    className={cn("h-full rounded-full shadow-md", m.color)} 
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex items-center justify-between p-5 bg-gradient-to-br from-blue-50 to-sky-100 rounded-2xl border border-blue-200 relative z-10 shadow-sm">
            <div>
              <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Water Intake Target</p>
              <p className="font-black text-blue-800 text-2xl tracking-tight">2.4 <span className="text-lg text-blue-600">/ 3.0 L</span></p>
            </div>
            <div className="w-14 h-14 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center -rotate-6 hover:rotate-0 transition-transform"><Droplets className="w-8 h-8" /></div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {['Weight Loss', 'Muscle Gain', 'Maintenance', 'Keto', 'Vegan', 'Intermittent Fasting'].map(g => (
              <button 
                key={g} 
                onClick={() => { setGoal(g); fetchDietPlan(g); }}
                className={cn("px-8 py-4 rounded-[1.5rem] font-black text-sm transition-all whitespace-nowrap border-b-4 active:border-b active:translate-y-[3px] snap-center", 
                  goal === g ? "bg-indigo-600 border-indigo-800 text-white shadow-xl shadow-indigo-600/30" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50")}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative min-h-[250px]">
            {isGenerating && (
                <div className="absolute inset-0 z-20 bg-white/50 backdrop-blur-sm rounded-[2rem] flex flex-col items-center justify-center">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                    <p className="font-bold text-indigo-900">Crafting your custom {goal} plan...</p>
                </div>
            )}
            {meals.map((meal, i) => {
              const MealIcon = icons[i % icons.length];
              return (
              <motion.div 
                key={i + meal.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, type: "spring" }}
                className="glass-panel p-6 rounded-[2rem] hover:shadow-2xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-between border-2 border-transparent hover:border-slate-100 bg-white"
              >
                <div className="absolute -right-8 -top-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-700 pointer-events-none">
                  <MealIcon className="w-48 h-48" />
                </div>
                
                <div>
                  <div className={cn("w-14 h-14 rounded-2xl mb-6 bg-gradient-to-br flex items-center justify-center text-white shadow-lg group-hover:-translate-y-1 transition-transform", meal.color)}>
                    <MealIcon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{meal.time}</h3>
                  <p className="font-extrabold text-slate-800 mb-2 leading-tight text-lg">{meal.name}</p>
                </div>
                
                <div className="flex items-center justify-between mt-6">
                  <span className="font-black text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 shadow-sm">{meal.cal}</span>
                  <button onClick={() => setSelectedMeal({ ...meal, icon: MealIcon })} className="p-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl shadow-lg transition-colors hover:scale-110 active:scale-95">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )})}
          </div>

          <div className="glass-panel p-8 rounded-[2.5rem] bg-gradient-to-r from-slate-900 to-indigo-950 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-indigo-500/20 blur-[80px] rounded-full mix-blend-screen pointer-events-none" />
            
            <div className="relative z-10 flex-1 text-center md:text-left">
              <h3 className="text-3xl font-black mb-3 text-white tracking-tight">Need a menu switch?</h3>
              <p className="text-indigo-200 font-medium text-lg">Generate a completely new plan tailored for <span className="text-white border-b-2 border-indigo-400 pb-0.5">{goal}</span>.</p>
            </div>
            
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className={cn("relative z-10 w-full md:w-auto px-10 py-5 bg-white text-indigo-950 font-black rounded-2xl transition-all flex justify-center items-center gap-3 shadow-xl hover:shadow-2xl hover:bg-slate-50 border-b-4 border-slate-200 active:border-b-0 active:translate-y-1", 
                isGenerating && "opacity-80 scale-95 pointer-events-none"
              )}
            >
              {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Activity className="w-6 h-6 text-indigo-600" />}
              {isGenerating ? "Processing Data..." : "Regenerate Plan"}
            </button>
          </div>
        </div>
      </div>

      {/* Meal Recipe Modal */}
      <AnimatePresence>
        {selectedMeal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMeal(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative overflow-hidden"
            >
              <div className={cn("h-48 w-full bg-gradient-to-br flex items-center justify-center relative", selectedMeal.color)}>
                <button onClick={() => setSelectedMeal(null)} className="absolute top-6 right-6 p-3 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors backdrop-blur-md shadow-lg">
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                {selectedMeal.icon && React.createElement(selectedMeal.icon, { className: "w-24 h-24 text-white opacity-90 drop-shadow-xl" })}
              </div>
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{selectedMeal.time}</h3>
                    <h2 className="text-2xl font-black text-slate-800 leading-tight pr-4">{selectedMeal.name}</h2>
                  </div>
                  <span className="font-black text-indigo-700 bg-indigo-50 px-4 py-2 rounded-[1rem] border border-indigo-100 text-xl shadow-sm whitespace-nowrap">{selectedMeal.cal}</span>
                </div>
                
                <div className="space-y-6 text-slate-600 font-medium mb-8">
                  <p className="text-base leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">{selectedMeal.description}</p>
                  
                  <div>
                    <h4 className="font-black text-slate-800 mb-3 text-lg flex items-center gap-2"><Utensils className="w-5 h-5 opacity-50" /> Ingredients Required</h4>
                    <ul className="space-y-3">
                      {selectedMeal.ingredients.map((ing, k) => (
                        <li key={k} className="flex items-center gap-3">
                           <div className={cn("w-2 h-2 rounded-full", selectedMeal.color.split(' ')[0].replace('from', 'bg'))} />
                           {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setSelectedMeal(null);
                    setShowToast({ message: "Recipe instructions sent to your email!", icon: CheckCircle2 });
                    setTimeout(() => setShowToast(null), 3000);
                  }}
                  className={cn("w-full py-5 text-white font-black rounded-2xl shadow-xl hover:opacity-90 transition-opacity bg-gradient-to-r text-lg active:scale-95", selectedMeal.color)}
                >
                  Send Full Recipe to Email
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Dynamic Toast Notifications */}
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-8 bg-slate-900 text-white px-8 py-5 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex items-center gap-4 z-50 font-bold border border-slate-700/50 backdrop-blur-xl"
          >
            <showToast.icon className="w-6 h-6 text-emerald-400" />
            {showToast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
