import { LearningPathMap } from './components/LearningPathMap'
import { SocraticChatPanel } from './components/SocraticChatPanel'
import { Compass, Settings, Zap, FileQuestion, BarChart3, LogOut } from 'lucide-react'
import { Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Onboarding from './pages/Onboarding'
import QuizList from './pages/QuizList'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import { useAuth } from './store/auth'

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
          <NavItem icon={<Compass size={18} />} label="知识星图" active={isActive('/dashboard')}
            onClick={() => navigate('/dashboard')} />
          <NavItem icon={<FileQuestion size={18} />} label="错题库" active={isActive('/dashboard/quiz')}
            onClick={() => navigate('/dashboard/quiz')} />
          <NavItem icon={<BarChart3 size={18} />} label="能力档案" active={isActive('/dashboard/profile')}
            onClick={() => navigate('/dashboard/profile')} />
        </nav>

        <div className="p-2 border-t border-border space-y-0.5">
          <NavItem icon={<Settings size={18} />} label="设置"
            onClick={() => {}} />
          <NavItem icon={<LogOut size={18} />} label="退出登录"
            onClick={handleLogout} />
        </div>
      </aside>

      {/* 内容区 */}
      <main className="flex-1 h-full overflow-y-auto">
        <div className="p-6 max-w-5xl mx-auto">
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
        active
          ? 'bg-secondary text-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
      }`}>
      <span className="shrink-0 flex items-center justify-center w-5 h-5">{icon}</span>
      <span className="hidden md:inline truncate">{label}</span>
    </button>
  )
}

function DashboardMain() {
  return (
    <div className="h-full relative -m-6">
      <header className="absolute top-0 left-0 w-full h-14 z-20 pointer-events-none flex justify-end px-6 items-center">
        <div className="pointer-events-auto px-3 py-1.5 rounded-full flex items-center gap-2 text-xs bg-card border border-border">
          <span className="text-muted-foreground">BKT 掌握度评估</span>
          <span className="text-primary font-mono font-medium">Lvl.4 进阶</span>
        </div>
      </header>
      <div className="w-full h-full absolute inset-0">
        <LearningPathMap />
      </div>
      <SocraticChatPanel />
    </div>
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
        <Route index element={<DashboardMain />} />
        <Route path="quiz" element={<QuizList />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
