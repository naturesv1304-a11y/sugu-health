import React, { useState } from 'react';
import { Apple, Scale, Utensils, Droplets, Flame } from 'lucide-react';

export function Nutrition() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height) / 100; // convert cm to m
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      setBmi(w / (h * h));
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (bmi < 25) return { label: 'Normal weight', color: 'text-green-600', bg: 'bg-green-100' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Obese', color: 'text-red-600', bg: 'bg-red-100' };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-800">Nutrition & Diet</h1>
        <p className="text-slate-600">Track your BMI and discover healthy meal suggestions.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* BMI Calculator */}
        <div className="md:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <Scale className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">BMI Calculator</h2>
          </div>

          <form onSubmit={calculateBMI} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="e.g., 175"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="e.g., 70"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Calculate BMI
            </button>
          </form>

          {bmi !== null && (
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <p className="text-sm text-slate-500 mb-1">Your BMI is</p>
              <p className="text-3xl font-bold text-slate-800 mb-2">{bmi.toFixed(1)}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getBMICategory(bmi).bg} ${getBMICategory(bmi).color}`}>
                {getBMICategory(bmi).label}
              </span>
            </div>
          )}
        </div>

        {/* Nutrition Tips */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
              <Apple className="w-8 h-8 text-emerald-600 mb-4" />
              <h3 className="font-semibold text-emerald-900 mb-2">Eat Whole Foods</h3>
              <p className="text-sm text-emerald-700">Focus on unprocessed foods like fruits, vegetables, whole grains, and lean proteins.</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <Droplets className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold text-blue-900 mb-2">Stay Hydrated</h3>
              <p className="text-sm text-blue-700">Drink at least 8 glasses of water a day to maintain energy levels and support digestion.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-orange-500" />
              Healthy Meal Ideas
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="w-16 h-16 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                  <Flame className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Oatmeal with Berries & Nuts</h4>
                  <p className="text-sm text-slate-500 mt-1">High in fiber and antioxidants. Great for sustained morning energy.</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-600">Breakfast</span>
                    <span className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-600">350 kcal</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                  <Utensils className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Grilled Chicken Quinoa Salad</h4>
                  <p className="text-sm text-slate-500 mt-1">Packed with lean protein and complex carbs. Keeps you full longer.</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-600">Lunch</span>
                    <span className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-600">450 kcal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
