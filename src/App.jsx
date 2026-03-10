import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import QandA from './pages/QandA'
import Activities from './pages/Activities'
import Independence from './pages/Independence'
import Boundaries from './pages/Boundaries'
import Tasks from './pages/Tasks'
import Inspiration from './pages/Inspiration'
import Schedule from './pages/Schedule'
import Reminders from './pages/Reminders'
import SpeechTraining from './pages/SpeechTraining'
import GanUpdates from './pages/GanUpdates'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/qa" element={<QandA />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/independence" element={<Independence />} />
        <Route path="/boundaries" element={<Boundaries />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/inspiration" element={<Inspiration />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/speech" element={<SpeechTraining />} />
        <Route path="/gan-updates" element={<GanUpdates />} />
      </Routes>
      <Navbar />
    </>
  )
}

export default App
