import { useEffect } from 'react';

export function RedPlusCursor() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const s = document.createElement("div");
      s.className = "red-plus-spark";
      s.style.left = e.clientX + "px";
      s.style.top = e.clientY + "px";
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 800);
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <style>{`
      .red-plus-spark {
        position: fixed;
        color: #ef4444; /* text-red-500 */
        font-size: 28px;
        font-weight: bold;
        pointer-events: none;
        animation: spark-fade 0.8s linear forwards;
        z-index: 9999;
        transform: translate(-50%, -50%);
        text-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
      }
      .red-plus-spark::after {
        content: '+';
      }
      @keyframes spark-fade {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(2) rotate(180deg); }
      }
    `}</style>
  );
}
