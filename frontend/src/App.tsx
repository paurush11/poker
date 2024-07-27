"use client"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GameScreen from './pages/GameScreen';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:roomId" element={<GameScreen />} />
      </Routes>
    </Router>
  )
}

export default App
