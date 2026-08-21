import { NavLink } from 'react-router-dom'
import './Navbar.css'

const navItems = [
  { path: '/home', label: 'בית', icon: '🏠' },
  { path: '/now', label: 'עכשיו בגן', icon: '📌' },
  { path: '/qa', label: 'שאלות', icon: '💬' },
  { path: '/activities', label: 'פעילויות', icon: '🎨' },
  { path: '/inspiration', label: 'השראה', icon: '✨' },
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
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
