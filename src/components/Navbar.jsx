import { NavLink } from 'react-router-dom'
import './Navbar.css'

const navItems = [
  { path: '/home',       label: 'בית',      icon: 'https://www.genspark.ai/api/files/s/ww3wWEDa?cache_control=3600', emoji: '🏠' },
  { path: '/qa',         label: 'שאלות',    icon: 'https://www.genspark.ai/api/files/s/wMKMpOsS?cache_control=3600', emoji: '💬' },
  { path: '/activities', label: 'פעילויות', icon: 'https://www.genspark.ai/api/files/s/DE3IEmAW?cache_control=3600', emoji: '🎨' },
  { path: '/schedule',   label: 'יומן',     icon: 'https://www.genspark.ai/api/files/s/LheG615d?cache_control=3600', emoji: '📅' },
  { path: '/inspiration',label: 'השראה',    icon: 'https://www.genspark.ai/api/files/s/gGCtvwJi?cache_control=3600', emoji: '✨' },
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
