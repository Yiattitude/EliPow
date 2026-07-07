import { Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, FileQuestion, BarChart3, Settings, LogOut, Zap
} from 'lucide-react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Onboarding from './pages/Onboarding'
import DashboardHome from './pages/DashboardHome'
import QuizList from './pages/QuizList'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import { useAuth } from './store/auth'

/* ===== Dashboard 布局（侧边栏 + 主内容） ===== */
function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useAuth((s) => s.logout)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      {/* 侧边栏 */}
      <aside className="w-[64px] md:w-[200px] h-full border-r border-border flex flex-col bg-card z-20 transition-all duration-200">
        <div className="h-14 flex items-center justify-center md:justify-start md:px-5 border-b border-border">
          <Zap size={20} className="text-primary shrink-0" />
          <span className="hidden md:block ml-2.5 font-semibold tracking-tight text-sm">ELIPOW</span>
        </div>

        <nav className="flex-1 py-4 flex flex-col gap-0.5 px-2">
          <NavItem icon={<LayoutDashboard size={18} />} label="学习计划" active={isActive('/dashboard')}
            onClick={() => navigate('/dashboard')} />
          <NavItem icon={<FileQuestion size={18} />} label="错题库" active={isActive('/dashboard/quiz')}
            onClick={() => navigate('/dashboard/quiz')} />
          <NavItem icon={<BarChart3 size={18} />} label="能力档案" active={isActive('/dashboard/profile')}
            onClick={() => navigate('/dashboard/profile')} />
        </nav>

        <div className="p-2 border-t border-border space-y-0.5">
          <NavItem icon={<Settings size={18} />} label="设置" onClick={() => {}} />
          <NavItem icon={<LogOut size={18} />} label="退出登录" onClick={handleLogout} />
        </div>
      </aside>

      {/* 内容区 */}
      <main className="flex-1 h-full overflow-y-auto">
        <div className="p-6 max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

function NavItem({ icon, label, active, onClick }: {
  icon: React.ReactNode; label: string; active?: boolean; onClick: () => void
}) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors duration-150 ${
        active ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
      }`}>
      <span className="shrink-0 flex items-center justify-center w-5 h-5">{icon}</span>
      <span className="hidden md:inline truncate">{label}</span>
    </button>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="onboarding" element={<Onboarding />} />
      </Route>

      {/* Dashboard 嵌套路由 */}
      <Route path="dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="quiz" element={<QuizList />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
