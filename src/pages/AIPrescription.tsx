import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Download, Printer, Share2, ClipboardList, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { jsPDF } from 'jspdf';
import { groqGenerateText } from '@/lib/groq';

export function AIPrescription() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prescription, setPrescription] = useState<string | null>(null);
  const [showShareToast, setShowShareToast] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    
    try {

      const promptContext = `Act as an expert medical assistant. The user provides the following symptoms/instructions: "${prompt}". 
      Analyze the symptoms and generate a safe preliminary AI prescription. 
      Format exactly as the following example structure. Do NOT use markdown code blocks (\`\`\`). Keep it plain text.
      
--------------------------------
AI HEALTH PRESCRIPTION
--------------------------------
Patient: ${user?.displayName || 'Patient'}
Age: 22

Possible Condition:
→ [Condition]

Suggested Medicines:
• [Medicine 1 with dosage]
• [Medicine 2 with dosage]

Precautions:
• [Precaution 1]
• [Precaution 2]

Doctor Visit:
[Advice on when to see a doctor]
--------------------------------`;
      
      const responseText = await groqGenerateText(promptContext, 'openai/gpt-oss-120b');

      setPrescription(responseText || 'Unable to generate prescription at the moment.');
    } catch (error: any) {
      console.error("AI Error:", error);
      setPrescription(`Error connecting to AI: ${error?.message || "Please try again later."}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!prescription) return;
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Header Background
      pdf.setFillColor(79, 70, 229); // Indigo 600
      pdf.rect(0, 0, pageWidth, 45, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(26);
      pdf.setFont("helvetica", "bold");
      pdf.text("SuguHealth", 20, 22);
      
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text("Official AI Prescription", 20, 32);

      // Hospital/Clinic info
      pdf.setFontSize(10);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 50, 22);
      pdf.text("AI Generated Rx", pageWidth - 50, 28);
      
      // The Rx Label
      pdf.setTextColor(79, 70, 229);
      pdf.setFontSize(40);
      pdf.setFont("helvetica", "bolditalic");
      pdf.text("Rx", 20, 75);

      // Parse the prescription block
      pdf.setTextColor(15, 23, 42); // Slate 900
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      
      // We process the prescription text to fit nicely
      const cleanText = prescription.replace(/--------------------------------/g, '').trim();
      const lines = pdf.splitTextToSize(cleanText, pageWidth - 40);
      
      // Print the actual prescription text
      pdf.text(lines, 20, 100);
      
      // Footer Line
      pdf.setDrawColor(226, 232, 240);
      pdf.line(20, 260, pageWidth - 20, 260);
      
      // Signature/Timestamp
      pdf.setTextColor(148, 163, 184); // Slate 400
      pdf.setFontSize(9);
      pdf.text("Authorized by: SuguHealth Advanced Medical AI", 20, 270);
      pdf.text("Note: This is an automatically generated electronic preliminary prescription.", 20, 275);
      
      // Save it
      pdf.save(`AI_Prescription_${user?.displayName || 'Patient'}.pdf`);
    } catch (e) {
      console.error("PDF generation failed, falling back to txt:", e);
      const blob = new Blob([prescription], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Prescription.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handlePrint = () => {
    if (!prescription) return;
    const printWindow = window.open('', '', 'width=600,height=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>AI Prescription</title>
            <style>
              body { font-family: 'Courier New', monospace; padding: 40px; white-space: pre-wrap; line-height: 1.6; color: #1e293b; }
              .header { font-size: 1.5em; font-weight: bold; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px; }
            </style>
          </head>
          <body>${prescription}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const handleShare = async () => {
    if (!prescription) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Prescription',
          text: prescription,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(prescription).catch(() => {});
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
      } else {
        alert("Clipboard not accessible in your browser (requires HTTPS).");
      }
    }
  };

  return (
    <div className="space-y-8 relative pb-20">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">AI Prescription Gen</h1>
        <p className="text-slate-500 font-medium mt-1 max-w-2xl">Note: This is an AI-generated preliminary prescription meant for informational purposes. Always consult a certified physician.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Form */}
        <div className="glass-panel p-8 rounded-[2rem] border-indigo-100 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-full" />
          
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-500" /> Specify Condition
          </h2>

          <div className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Instructions / Symptoms Prompt</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., I have been having a mild headache and fever for the past 2 days..."
                rows={6} 
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 text-slate-800 font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all resize-none shadow-inner text-sm leading-relaxed" 
              />
            </div>
            
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className={cn("w-full py-4 text-white font-black rounded-xl text-lg shadow-xl flex items-center justify-center gap-3 transition-all", 
                isGenerating ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] shadow-indigo-600/30 active:scale-95"
              )}
            >
              {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Stethoscope className="w-6 h-6" />}
              {isGenerating ? "Generating Prescription..." : "Generate AI Rx"}
            </button>
          </div>
        </div>

        {/* Output Document */}
        <div className="relative min-h-[500px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!prescription && !isGenerating ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center p-8 border-2 border-dashed border-slate-300 rounded-[2rem] w-full h-full flex flex-col items-center justify-center text-slate-400 bg-white/50 backdrop-blur-sm"
              >
                <Stethoscope className="w-16 h-16 mb-4 text-slate-300" />
                <p className="font-bold text-lg">Awaiting Input</p>
                <p className="text-sm font-medium">Your generated prescription will appear here.</p>
              </motion.div>
            ) : isGenerating ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center p-8 rounded-[2rem] w-full flex flex-col items-center justify-center"
              >
                <div className="w-24 h-24 mb-6 relative flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                  <Stethoscope className="w-8 h-8 text-indigo-600 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Processing Symptoms</h3>
                <p className="text-indigo-500 font-medium">Cross-referencing medical databases...</p>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex justify-center"
              >
                {/* Doctor's Pad Styling */}
                <div className="w-full max-w-sm bg-white rounded-b-xl rounded-t-sm shadow-2xl relative overflow-hidden border border-slate-200">
                  <div className="h-6 w-full bg-indigo-600 flex justify-between px-4" />
                  <div className="p-8">
                    <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm text-slate-700 font-bold leading-relaxed">{prescription}</pre>
                  </div>
                  <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-center gap-4">
                    <button onClick={handleDownload} className="p-3 bg-white rounded-full shadow-sm hover:shadow-md text-slate-500 hover:text-indigo-600 transition-all border border-slate-200"><Download className="w-5 h-5"/></button>
                    <button onClick={handlePrint} className="p-3 bg-white rounded-full shadow-sm hover:shadow-md text-slate-500 hover:text-indigo-600 transition-all border border-slate-200"><Printer className="w-5 h-5"/></button>
                    <button onClick={handleShare} className="p-3 bg-white rounded-full shadow-sm hover:shadow-md text-slate-500 hover:text-indigo-600 transition-all border border-slate-200"><Share2 className="w-5 h-5"/></button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-slate-800 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-50 font-bold"
          >
            <ClipboardList className="w-5 h-5 text-indigo-400" />
            Copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
