import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock, Activity, AlertCircle, TrendingUp, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  description: string;
  author: string;
}

export function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // High quality Real-Time Health News from NYT Health RSS converted seamlessly to JSON
        const RSS_URL = "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml";
        const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}&api_key=`;
        
        const res = await fetch(API_URL);
        const data = await res.json();

        if (data.status === "ok") {
          const formattedNews = data.items.map((item: any) => ({
            title: item.title,
            link: item.link,
            pubDate: new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            thumbnail: item.thumbnail || (item.enclosure && item.enclosure.link) || null,
            description: item.description.replace(/<[^>]+>/g, ''), // Strip HTML tags
            author: item.author || 'Medical Contributor'
          }));
          
          setNews(formattedNews);
        } else {
          throw new Error('Invalid feed status');
        }
      } catch (err) {
        console.error(err);
        setError('Unable to fetch live health news. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Premium Header */}
      <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full blur-3xl opacity-60 pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Newspaper className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
              Real-Time Health News
              <span className="flex items-center gap-1 text-xs font-bold px-3 py-1 bg-rose-100 text-rose-600 rounded-full uppercase tracking-wider animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Live
              </span>
            </h2>
          </div>
          <p className="text-slate-500 text-lg font-medium max-w-2xl">
            Stay informed with the latest breaking stories, global health trends, medical discoveries, and critical policies.
          </p>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="animate-pulse bg-white rounded-[2rem] h-96 border border-slate-100 p-6 flex flex-col gap-4 shadow-sm">
              <div className="w-full h-48 bg-slate-100 rounded-2xl"></div>
              <div className="h-6 bg-slate-100 rounded-md w-3/4"></div>
              <div className="h-4 bg-slate-100 rounded-md w-full"></div>
              <div className="h-4 bg-slate-100 rounded-md w-5/6"></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-rose-50 rounded-3xl p-8 flex flex-col items-center justify-center text-center border border-rose-100">
          <AlertCircle className="w-12 h-12 text-rose-400 mb-4" />
          <h3 className="text-xl font-bold text-rose-800 mb-2">Feed Interrupted</h3>
          <p className="text-rose-600 font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, idx) => (
            <motion.a 
              key={idx} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.03)] border border-slate-100 hover:shadow-xl hover:-translate-y-2 hover:border-transparent transition-all duration-300 flex flex-col h-full overflow-hidden relative"
            >
              {/* Image Section */}
              <div className="relative w-full h-56 bg-slate-100 overflow-hidden shrink-0">
                {item.thumbnail ? (
                  <img src={item.thumbnail} alt="News thumbnail" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                    <TrendingUp className="w-12 h-12 text-slate-300" />
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="flex items-center gap-1 text-white font-semibold text-sm">
                    Read full article <ExternalLink className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex flex-col flex-1 relative z-10 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold text-amber-500 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">Report</span>
                </div>
                
                <h3 className="font-extrabold text-xl text-slate-800 mb-3 group-hover:text-amber-600 transition-colors line-clamp-3 leading-tight">
                  {item.title}
                </h3>
                
                <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
                
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs uppercase">
                      {item.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">{item.author}</p>
                      <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.pubDate}
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}
