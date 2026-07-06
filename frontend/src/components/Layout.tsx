import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { Zap } from 'lucide-react'

export default function Layout() {
  const { token, nickname, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 顶栏 */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 h-14">
          <NavLink to="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-base">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Zap size={14} className="text-primary-foreground" />
            </div>
            电荔 Elipow
          </NavLink>
          <nav className="flex items-center gap-1 text-sm">
            <NavLink to="/" end className={({ isActive }) =>
              `px-3 py-1.5 rounded-md transition-colors duration-150 text-xs ${isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`
            }>
              首页
            </NavLink>
            {token ? (
              <div className="flex items-center gap-2 ml-2">
                <span className="text-xs text-muted-foreground">{nickname || '用户'}</span>
                <button onClick={handleLogout}
                  className="px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  退出
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 ml-2">
                <NavLink to="/login" className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md transition-colors duration-150 text-xs ${isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`
                }>
                  登录
                </NavLink>
                <NavLink to="/register"
                  className="ml-1 px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                  注册
                </NavLink>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* 内容区 */}
      <main className="mx-auto w-full max-w-4xl px-6 py-12">
        <Outlet />
      </main>
    </div>
  )
}
