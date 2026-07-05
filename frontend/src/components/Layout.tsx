import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function Layout() {
  const { token, nickname, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-lg font-semibold">电荔 Elipow</div>
          <nav className="flex items-center gap-6 text-sm">
            <NavLink to="/" end className={({ isActive }) => `transition ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
              首页
            </NavLink>
            {token ? (
              <div className="flex items-center gap-3">
                <span className="text-slate-500">{nickname || '用户'}</span>
                <button onClick={logout} className="text-slate-500 hover:text-slate-900">退出</button>
              </div>
            ) : (
              <>
                <NavLink to="/login" className={({ isActive }) => `transition ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
                  登录
                </NavLink>
                <NavLink to="/register" className={({ isActive }) => `transition ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
                  注册
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}
