import { NavLink } from 'react-router-dom'
import './Navbar.css'

const navItems = [
  { path: '/home',        label: 'בית',      icon: '/icons/icon-home.png'        },
  { path: '/qa',          label: 'שאלות',    icon: '/icons/icon-qa.png'          },
  { path: '/activities',  label: 'פעילויות', icon: '/icons/icon-activities.png'  },
  { path: '/schedule',    label: 'יומן',     icon: '/icons/icon-schedule.png'    },
  { path: '/inspiration', label: 'השראה',    icon: '/icons/icon-inspiration.png' },
]

export default function Navbar() {
  return (
    <nav className="navbar">
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
    </nav>
  )
}
