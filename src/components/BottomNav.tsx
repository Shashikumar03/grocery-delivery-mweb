import { Home, Package } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/orders', icon: Package, label: 'Orders' },
]

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `bottom-nav__item${isActive ? ' bottom-nav__item--active' : ''}`
          }
        >
          <Icon size={22} strokeWidth={2} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
