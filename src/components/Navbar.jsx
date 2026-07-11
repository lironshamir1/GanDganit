import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './Navbar.css'

const navItems = [
  { path: '/home',        label: 'בית',      icon: '/icons/icon-home.png'        },
  { path: '/qa',          label: 'שאלות',    icon: '/icons/icon-qa.png'          },
  { path: '/activities',  label: 'פעילויות', icon: '/icons/icon-activities.png'  },
  { path: '/schedule',    label: 'יומן',     icon: '/icons/icon-schedule.png'    },
  { path: '/inspiration', label: 'השראה',    icon: '/icons/icon-inspiration.png' },
]

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="nav-main">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="nav-icon-wrap">
              <img src={item.icon} alt={item.label} className="nav-img" />
            </div>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </div>
      <div className="nav-menu-container">
        <button
          className="nav-menu-button"
          onClick={() => setShowMenu(!showMenu)}
          aria-label="תפריט משתמש"
        >
          👤
        </button>
        {showMenu && (
          <div className="nav-menu-dropdown">
            <button onClick={handleLogout} className="logout-button">
              התנתקות
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
