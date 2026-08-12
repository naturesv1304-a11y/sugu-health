import { Phone, AlertTriangle, Activity, Brain, ShieldAlert } from 'lucide-react';

export function Emergency() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-rose-600 rounded-3xl p-10 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-rose-200" />
            <h2 className="text-3xl font-bold">Emergency Guidance</h2>
          </div>
          <p className="text-rose-100 text-lg max-w-2xl mb-8">
            When to call 112 and what to do in medical emergencies. Stay calm and follow instructions.
          </p>
          <a 
            href="tel:112"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-rose-600 rounded-xl font-bold text-xl hover:bg-rose-50 transition-colors shadow-lg"
          >
            <Phone className="w-6 h-6" />
            CALL 112 IMMEDIATELY
          </a>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <ShieldAlert className="w-64 h-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Breathing & Circulation</h3>
          </div>
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start gap-2"><span className="text-rose-500 font-bold">•</span> Difficulty breathing or shortness of breath</li>
            <li className="flex items-start gap-2"><span className="text-rose-500 font-bold">•</span> Chest pain or pressure</li>
            <li className="flex items-start gap-2"><span className="text-rose-500 font-bold">•</span> Rapid or irregular heartbeat</li>
            <li className="flex items-start gap-2"><span className="text-rose-500 font-bold">•</span> Severe bleeding that won't stop</li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Neurological</h3>
          </div>
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold">•</span> Loss of consciousness or altered mental state</li>
            <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold">•</span> Severe headache with stiff neck</li>
            <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold">•</span> Seizures</li>
            <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold">•</span> Slurred speech or confusion</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
          <h3 className="text-xl font-bold text-emerald-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">✅</span> DO:
          </h3>
          <ul className="space-y-3 text-emerald-700">
            <li className="flex items-start gap-2">Stay with the injured person</li>
            <li className="flex items-start gap-2">Keep them calm and comfortable</li>
            <li className="flex items-start gap-2">Apply direct pressure to bleeding wounds</li>
            <li className="flex items-start gap-2">Monitor breathing and pulse</li>
            <li className="flex items-start gap-2">Follow dispatcher instructions</li>
          </ul>
        </div>

        <div className="bg-rose-50 rounded-3xl p-8 border border-rose-100">
          <h3 className="text-xl font-bold text-rose-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">❌</span> DON'T:
          </h3>
          <ul className="space-y-3 text-rose-700">
            <li className="flex items-start gap-2">Move someone with suspected spinal injury</li>
            <li className="flex items-start gap-2">Remove embedded objects</li>
            <li className="flex items-start gap-2">Give food/water to unconscious person</li>
            <li className="flex items-start gap-2">Leave the person alone</li>
            <li className="flex items-start gap-2">Attempt untrained procedures</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
