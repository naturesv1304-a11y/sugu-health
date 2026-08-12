import { useState, useEffect } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';

// ✅ IMPORT LOCAL IMAGES
import doctor1 from '../assets/doctor1.jpg';
import doctor2 from '../assets/doctor2.jpg';
import doctor3 from '../assets/doctor3.jpg';
import doctor4 from '../assets/doctor4.jpg';
import doctor5 from '../assets/doctor5.jpg';
import doctor6 from '../assets/doctor6.jpg';
import doctor7 from '../assets/doctor7.jpg';

// ✅ USE IMPORTED IMAGES HERE
const team = [
  { name: "Dr. SUGUMAR", role: "Cardiologist", img: doctor1 },
  { name: "Dr. VARSHITHA", role: "Neurologist", img: doctor2 },
  { name: "Dr. SENTAMILAN", role: "Dermatologist", img: doctor3 },
  { name: "Dr. Sree Raj", role: "Pediatrician", img: doctor4 },
  { name: "Dr. Faraz", role: "Developer", img: doctor5 },
  { name: "Dr. Sachin", role: "Developer", img: doctor6 },
  { name: "Dr. Vivedha", role: "Designer", img: doctor7 },
];

export function Team() {
  const rotation = useMotionValue(0);
  const [radius, setRadius] = useState(400);

  useEffect(() => {
    const updateRadius = () => setRadius(window.innerWidth < 768 ? 250 : 400);
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  useAnimationFrame((time, delta) => {
    rotation.set(rotation.get() - (15 * (delta / 1000)));
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden flex flex-col items-center justify-center">
      
      {/* Video Background */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover blur-[6px] scale-105 -z-20"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-medical-research-with-a-microscope-in-a-laboratory-43015-large.mp4" type="video/mp4" />
      </video>
      
      {/* Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 to-black/80 -z-10" />

      {/* Title */}
      <div className="text-center mb-10 relative z-10 mt-12">
        <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-4 tracking-wide">
          Meet the Innovators
        </h2>
      </div>

      {/* 3D Circle */}
      <div className="relative h-[60vh] md:h-[80vh] w-full flex justify-center items-center">
        
        <h1 className="absolute text-5xl md:text-7xl lg:text-[5rem] font-black text-white/5 tracking-widest z-0 pointer-events-none select-none text-center w-full">
          DOCTORS
        </h1>
        
        <div 
          className="relative w-full h-full" 
          style={{ perspective: '2000px', transformStyle: 'preserve-3d' }}
        >
          <motion.div 
            className="absolute top-1/2 left-1/2 w-full h-full"
            style={{ 
              rotateY: rotation, 
              x: '-50%', 
              y: '-50%',
              transformStyle: 'preserve-3d'
            }}
          >
            {team.map((member, i) => {
              const angle = (2 * Math.PI / team.length) * i;
              const angleDeg = angle * (180 / Math.PI);
              
              return (
                <div 
                  key={i}
                  className="absolute top-1/2 left-1/2 w-[160px] h-[220px] md:w-[200px] md:h-[280px]"
                  style={{ 
                    transform: `translate(-50%, -50%) rotateY(${angleDeg}deg) translateZ(${radius}px)`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div className="w-full h-full rounded-xl overflow-hidden bg-white shadow-[0_0_20px_rgba(0,0,0,0.6)] group transition-transform duration-300 hover:scale-110 relative">
                    
                    <img 
                      src={member.img} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                      draggable={false}
                    />

                    <div className="absolute bottom-0 w-full bg-black/70 text-white text-center p-2.5 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                      <p className="text-sm font-semibold">{member.name}</p>
                      <p className="text-xs text-gray-300">{member.role}</p>
                    </div>

                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
