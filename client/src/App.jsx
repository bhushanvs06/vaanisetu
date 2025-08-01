// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginSignupPage from './components/login/login';
import Dashboard from './components/home/home'
import SarvamAIInterface from './components/ai_teacher/aiteacher'
import FlashcardsApp from './components/flash/flashcards'
import Quiz from './components/quiz/quiz'
// import Leaderboard from './components/leaderboard/leader'
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginSignupPage />} />
      <Route path="/home" element={<Dashboard />} />
      <Route path="/aiteacher" element={<SarvamAIInterface />} />
      <Route path="/flashcards" element={<FlashcardsApp/>} />
      <Route path="/quiz" element={<Quiz/>} />
      {/* <Route path="/leaderboard" element={<Leaderboard />} /> */}
    </Routes>
  );
}

export default App;
