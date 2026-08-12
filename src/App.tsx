import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { MythBuster } from './pages/MythBuster';
import { Outbreak } from './pages/Outbreak';
import { MediAlert } from './pages/MediAlert';
import { Weather } from './pages/Weather';
import { Doctors } from './pages/Doctors';
import { Hospitals } from './pages/Hospitals';
import { Emergency } from './pages/Emergency';
import { News } from './pages/News';
import { AIDetector } from './pages/AIDetector';
import { Quiz } from './pages/Quiz';
import { Team } from './pages/Team';
import { MentalHealth } from './pages/MentalHealth';
import { Nutrition } from './pages/Nutrition';
import { LandingPage } from './pages/LandingPage';
import { SymptomsTracker } from './pages/SymptomsTracker';
import { HealthDashboard } from './pages/HealthDashboard';

import { DiseaseLibrary } from './pages/DiseaseLibrary';
import { FirstAidAI } from './pages/FirstAidAI';
import { Profile } from './pages/Profile';
import { Appointments } from './pages/Appointments';
import { AIDietPlanner } from './pages/AIDietPlanner';
import { DiseaseComparison } from './pages/DiseaseComparison';
import { VoiceAssistant } from './pages/VoiceAssistant';
import { SeasonalPredictor } from './pages/SeasonalPredictor';
import { AIPrescription } from './pages/AIPrescription';
import { useAuth } from './hooks/useAuth';
import { RedPlusCursor } from './components/RedPlusCursor';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <RedPlusCursor />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<Chat />} />
          <Route path="myth-busters" element={<MythBuster />} />
          <Route path="outbreak" element={<Outbreak />} />
          <Route path="medialert" element={<MediAlert />} />
          <Route path="weather" element={<Weather />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="hospitals" element={<Hospitals />} />
          <Route path="emergency" element={<Emergency />} />
          <Route path="news" element={<News />} />
          <Route path="ai-detector" element={<AIDetector />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="mental-health" element={<MentalHealth />} />
          <Route path="nutrition" element={<Nutrition />} />
          <Route path="team" element={<Team />} />
          <Route path="symptoms" element={<SymptomsTracker />} />
          <Route path="health-dashboard" element={<HealthDashboard />} />

          <Route path="disease-library" element={<DiseaseLibrary />} />
          <Route path="first-aid" element={<FirstAidAI />} />
          <Route path="profile" element={<Profile />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="ai-diet-planner" element={<AIDietPlanner />} />
          <Route path="disease-comparison" element={<DiseaseComparison />} />
          <Route path="voice-assistant" element={<VoiceAssistant />} />
          <Route path="seasonal-predictor" element={<SeasonalPredictor />} />
          <Route path="ai-prescription" element={<AIPrescription />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
