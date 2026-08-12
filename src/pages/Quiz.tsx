import { useState } from 'react';
import { ClipboardList, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react';

const questions = [
  { question: "How many glasses of water should an average adult drink per day?", options: ["4-5 glasses", "6-7 glasses", "8-10 glasses", "12-15 glasses"], explanation: "Adults should drink 8-10 glasses (about 2-2.5 liters) of water daily to maintain proper hydration and support bodily functions.", correct: 2 },
  { question: "What is the most common symptom of dengue fever?", options: ["Continuous cough", "High fever with headache", "Stomach pain", "Skin rash only"], explanation: "Dengue fever typically starts with sudden onset of high fever (104°F) accompanied by severe headache, especially behind the eyes.", correct: 1 },
  { question: "How often should you wash your hands to prevent infections?", options: ["Once a day", "Only before meals", "Frequently throughout the day", "Only when visibly dirty"], explanation: "Regular handwashing throughout the day, especially before eating, after using the bathroom, and after touching public surfaces, is crucial for preventing infections.", correct: 2 },
  { question: "Which vitamin is primarily obtained from sunlight exposure?", options: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"], explanation: "Vitamin D is synthesized in the skin when exposed to UVB rays from sunlight. It's essential for bone health and immune function.", correct: 3 },
  { question: "What is the recommended duration for washing hands with soap?", options: ["5-10 seconds", "15-20 seconds", "20-30 seconds", "1-2 minutes"], explanation: "Washing hands with soap for at least 20-30 seconds ensures effective removal of germs and bacteria.", correct: 2 },
];

export function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-10 shadow-sm border border-slate-200 text-center">
        <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Quiz Completed!</h2>
        <p className="text-slate-500 mb-8">Here's how you did on the health awareness quiz.</p>
        
        <div className="bg-slate-50 rounded-2xl p-8 mb-8">
          <div className="text-5xl font-bold text-indigo-600 mb-2">{percentage}%</div>
          <p className="text-slate-600 font-medium">You scored {score} out of {questions.length}</p>
        </div>

        <button 
          onClick={handleRestart}
          className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <RotateCcw className="w-5 h-5" />
          Take Quiz Again
        </button>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-700">Question {currentQuestion + 1} of {questions.length}</span>
          </div>
          <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm font-bold">
            Score: {score}
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2 mb-8">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <h3 className="text-2xl font-bold text-slate-900 mb-8 leading-snug">{q.question}</h3>

        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === q.correct;
            const showCorrect = selectedAnswer !== null && isCorrect;
            const showWrong = isSelected && !isCorrect;

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selectedAnswer !== null}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                  selectedAnswer === null 
                    ? 'border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-slate-700' 
                    : showCorrect 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800' 
                      : showWrong 
                        ? 'border-rose-500 bg-rose-50 text-rose-800' 
                        : 'border-slate-200 bg-slate-50 text-slate-400 opacity-50'
                }`}
              >
                <span className="font-medium text-lg">{opt}</span>
                {showCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                {showWrong && <XCircle className="w-6 h-6 text-rose-500" />}
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 animate-in fade-in slide-in-from-bottom-4">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <span className="text-xl">💡</span> Explanation
            </h4>
            <p className="text-blue-800">{q.explanation}</p>
            
            <button 
              onClick={handleNext}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 ml-auto"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
