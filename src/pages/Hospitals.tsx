import { useState } from 'react';
import { Search, MapPin, Navigation, Phone } from 'lucide-react';

export function Hospitals() {
  const [disease, setDisease] = useState('');
  const [otherDisease, setOtherDisease] = useState('');
  const [medicine, setMedicine] = useState('');

  const findHospitals = () => {
    const query = disease || otherDisease;
    if (!query) {
      alert("Please select or enter a condition first!");
      return;
    }
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + " hospital near me")}`, "_blank");
  };

  const findMedicineShops = () => {
    if (!medicine) {
      alert("Please enter a medicine name!");
      return;
    }
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(medicine + " medical store near me")}`, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-3xl p-10 text-white text-center shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Find Healthcare Near You</h2>
        <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
          Instantly locate the right hospitals, clinics, or pharmacies based on your specific medical needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hospitals */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Find Hospitals</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Health Issue</label>
              <select 
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">-- Choose a condition --</option>
                <option value="cardiology">Heart / Cardiology</option>
                <option value="orthopedic">Bones / Orthopedic</option>
                <option value="neurology">Brain / Neurology</option>
                <option value="ophthalmology">Eye / Ophthalmology</option>
                <option value="oncology">Cancer / Oncology</option>
                <option value="gynecology">Women's Health / Gynecology</option>
                <option value="dentist">Dental / Dentist</option>
                <option value="general hospital">General Hospital</option>
              </select>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-sm text-slate-400 font-medium">OR</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Type Condition</label>
              <input 
                type="text"
                value={otherDisease}
                onChange={(e) => setOtherDisease(e.target.value)}
                placeholder="e.g., Skin rash, Fever"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button 
              onClick={findHospitals}
              className="w-full mt-4 py-3.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Navigation className="w-5 h-5" />
              Find Hospitals Near Me
            </button>
          </div>
        </div>

        {/* Medicines */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Find Pharmacies</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Search for Medicine</label>
              <input 
                type="text"
                value={medicine}
                onChange={(e) => setMedicine(e.target.value)}
                placeholder="e.g., Paracetamol, Insulin"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <p className="text-sm text-slate-500">
              We will locate the nearest medical stores and pharmacies around your current location on Google Maps.
            </p>

            <button 
              onClick={findMedicineShops}
              className="w-full mt-4 py-3.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <Navigation className="w-5 h-5" />
              Find Pharmacies Near Me
            </button>
          </div>
        </div>
      </div>

      <div className="bg-rose-50 rounded-3xl p-8 border border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-rose-900 mb-2">Emergency Ambulance</h3>
          <p className="text-rose-700">Need immediate medical transport? Dial the national emergency number.</p>
        </div>
        <a 
          href="tel:108"
          className="shrink-0 px-8 py-4 bg-rose-600 text-white rounded-xl font-bold text-lg hover:bg-rose-700 transition-colors flex items-center gap-3 shadow-md shadow-rose-200"
        >
          <Phone className="w-6 h-6" />
          Call 108
        </a>
      </div>
    </div>
  );
}
