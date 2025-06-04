import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Game from './pages/Game'
import Leaderboard from './pages/Leaderboard'
import UsernameInput from './pages/UsernameInput'

// Temporary component to test game complete modal
const TestGameComplete = () => {
  return (
    <Game testMode="complete" />
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start" element={<UsernameInput />} />
        <Route path="/game" element={<Game />} />
        <Route path="/test-complete" element={<TestGameComplete />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  )
}

export default App
