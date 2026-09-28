import { NavLink, Route, Routes } from 'react-router-dom'
import { LayoutDashboard, PawPrint, CalendarDays, ListChecks, Receipt } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'

const nav = [
  { to: '/', label: 'แดชบอร์ด', icon: LayoutDashboard },
  { to: '/customers', label: 'ลูกค้าและสัตว์เลี้ยง', icon: PawPrint },
  { to: '/booking', label: 'การจอง', icon: CalendarDays },
  { to: '/queue', label: 'คิวงาน', icon: ListChecks },
  { to: '/pos', label: 'ชำระเงิน', icon: Receipt },
]
const Soon = ({ name }) => <div className="panel">หน้า {name} — กำลังพัฒนา</div>

export default function App() {
  return (
    <div className="min-h-screen md:flex">
      <aside className="bg-ink text-white md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0">
        <div className="flex items-center gap-3 px-5 py-5 text-lg font-semibold">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sun text-ink"><PawPrint size={22} /></span>
          Bubble Paws
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => `flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm transition ${isActive ? 'bg-lagoon text-white' : 'text-white/70 hover:bg-white/10'}`}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/booking" element={<Soon name="การจอง" />} />
          <Route path="/queue" element={<Soon name="คิวงาน" />} />
          <Route path="/pos" element={<Soon name="ชำระเงิน" />} />
        </Routes>
      </main>
    </div>
  )
}
