import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import twemoji from '@twemoji/api'
import './App.css'
import BackHome from './components/BackHome'
import ToolboxButton from './components/Toolbox'
import AboutButton from './components/About'
import Landing from './pages/Landing'
import Home from './pages/Home'
import QandA from './pages/QandA'
import Activities from './pages/Activities'
import Independence from './pages/Independence'
import Boundaries from './pages/Boundaries'
import Tasks from './pages/Tasks'
import Schedule from './pages/Schedule'
import Reminders from './pages/Reminders'
import SpeechTraining from './pages/SpeechTraining'
import GanUpdates from './pages/GanUpdates'
import Poster from './pages/Poster'
import TipsCards from './pages/TipsCards'
import NowAtGan from './pages/NowAtGan'

function App() {
  const location = useLocation()
  const isLanding = location.pathname === '/'
  const isPoster = location.pathname === '/poster' || location.pathname === '/tips-poster'
  const isHome = location.pathname === '/home'

  useEffect(() => {
    twemoji.parse(document.body, { folder: 'svg', ext: '.svg' })
  })

  // מעבר לעמוד חדש תמיד מתחיל מראש העמוד ולא ממשיך את הגלילה הקודמת
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/now" element={<NowAtGan />} />
        <Route path="/qa" element={<QandA />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/independence" element={<Independence />} />
        <Route path="/boundaries" element={<Boundaries />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/speech" element={<SpeechTraining />} />
        <Route path="/gan-updates" element={<GanUpdates />} />
        <Route path="/poster" element={<Poster />} />
        <Route path="/tips-poster" element={<TipsCards />} />
      </Routes>
      {!isLanding && !isPoster && <ToolboxButton />}
      {!isLanding && !isPoster && <AboutButton />}
      {!isLanding && !isPoster && !isHome && <BackHome />}
    </>
  )
}

export default App
