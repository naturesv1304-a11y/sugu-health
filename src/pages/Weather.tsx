import { useState, useEffect } from 'react';
import { CloudRain, Thermometer, Wind, Droplets, MapPin, Loader2 } from 'lucide-react';

export function Weather() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Using a free geocoding/weather API or mock data if API key is not available
        // For demonstration, we'll use a mock response since we don't have a real OpenWeather API key
        setTimeout(() => {
          setWeather({
            name: 'Bhubaneswar',
            main: { temp: 32.5, humidity: 65 },
            weather: [{ main: 'Clear', description: 'clear sky' }],
            wind: { speed: 4.1 }
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to fetch weather data');
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  if (error) return <div className="text-rose-500 text-center p-8">{error}</div>;

  const temp = weather?.main?.temp || 0;
  const condition = weather?.weather?.[0]?.main?.toLowerCase() || '';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Weather */}
        <div className="bg-gradient-to-br from-sky-400 to-indigo-500 rounded-3xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 opacity-80" />
              <span className="text-lg font-medium">{weather?.name}</span>
            </div>
            <CloudRain className="w-8 h-8 opacity-80" />
          </div>
          
          <div className="mb-8">
            <div className="text-6xl font-bold mb-2">{temp.toFixed(1)}°C</div>
            <div className="text-xl opacity-90 capitalize">{weather?.weather?.[0]?.description}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-6">
            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5 opacity-80" />
              <div>
                <div className="text-sm opacity-80">Humidity</div>
                <div className="font-semibold">{weather?.main?.humidity}%</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Wind className="w-5 h-5 opacity-80" />
              <div>
                <div className="text-sm opacity-80">Wind</div>
                <div className="font-semibold">{weather?.wind?.speed} m/s</div>
              </div>
            </div>
          </div>
        </div>

        {/* Precautions */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-rose-500" />
              Temperature Precautions
            </h3>
            <ul className="space-y-3">
              {temp > 30 ? (
                <>
                  <li className="flex items-start gap-2 text-slate-700"><span className="text-xl">💧</span> Drink plenty of water, stay indoors during peak heat.</li>
                  <li className="flex items-start gap-2 text-slate-700"><span className="text-xl">🕶️</span> Apply sunscreen and wear sunglasses.</li>
                </>
              ) : temp < 15 ? (
                <>
                  <li className="flex items-start gap-2 text-slate-700"><span className="text-xl">🧣</span> Wear warm clothes and avoid cold winds.</li>
                  <li className="flex items-start gap-2 text-slate-700"><span className="text-xl">🍵</span> Keep light warm clothes and drink warm fluids.</li>
                </>
              ) : (
                <li className="flex items-start gap-2 text-slate-700"><span className="text-xl">🙂</span> Weather is moderate, stay hydrated and active.</li>
              )}
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-sky-500" />
              Condition Precautions
            </h3>
            <ul className="space-y-3">
              {condition.includes('rain') ? (
                <>
                  <li className="flex items-start gap-2 text-slate-700"><span className="text-xl">🌂</span> Carry an umbrella, wear waterproof shoes.</li>
                  <li className="flex items-start gap-2 text-slate-700"><span className="text-xl">🦟</span> Use mosquito repellents, avoid street food.</li>
                </>
              ) : condition.includes('clear') ? (
                <li className="flex items-start gap-2 text-slate-700"><span className="text-xl">🌞</span> Great weather for outdoor activities.</li>
              ) : (
                <li className="flex items-start gap-2 text-slate-700"><span className="text-xl">😷</span> Wear a mask if sensitive to dust or pollution.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
