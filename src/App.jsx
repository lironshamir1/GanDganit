import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './lib/supabase'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
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
import Toolbox from './pages/Toolbox'
import About from './pages/About'

function App() {
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'
  const isLanding = location.pathname === '/'

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #e8f5e9 0%, #fef3e2 100%)'
      }}>
        <p style={{ fontSize: '18px', color: '#666' }}>טוען...</p>
      </div>
    )
  }

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/qa" element={<ProtectedRoute><QandA /></ProtectedRoute>} />
        <Route path="/activities" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
        <Route path="/independence" element={<ProtectedRoute><Independence /></ProtectedRoute>} />
        <Route path="/boundaries" element={<ProtectedRoute><Boundaries /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/inspiration" element={<ProtectedRoute><Inspiration /></ProtectedRoute>} />
        <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
        <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
        <Route path="/speech" element={<ProtectedRoute><SpeechTraining /></ProtectedRoute>} />
        <Route path="/gan-updates" element={<ProtectedRoute><GanUpdates /></ProtectedRoute>} />
        <Route path="/toolbox" element={<ProtectedRoute><Toolbox /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
      </Routes>
      {!isAuthPage && !isLanding && <Navbar />}
    </>
  )
}

export default App
