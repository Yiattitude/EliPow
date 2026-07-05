import { LearningPathMap } from './components/LearningPathMap';
import { SocraticChatPanel } from './components/SocraticChatPanel';
import { Compass, Book, User, Settings, Zap } from 'lucide-react';
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      
      {/* 极简侧边栏 - App Shell */}
      <aside className="w-[64px] md:w-[220px] h-full border-r border-white/10 flex flex-col bg-background/50 z-20 transition-all duration-300">
        <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-white/10">
          <Zap size={24} className="text-primary" />
          <span className="hidden md:block ml-3 font-semibold tracking-wide">ELIPOW</span>
        </div>
        
        <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
          <NavItem icon={<Compass size={20} />} label="知识星图" active />
          <NavItem icon={<Book size={20} />} label="错题库" />
          <NavItem icon={<User size={20} />} label="能力档案" />
        </nav>
        
        <div className="p-3 border-t border-white/10">
          <NavItem icon={<Settings size={20} />} label="设置" />
        </div>
      </aside>

      {/* 核心工作区 */}
      <main className="flex-1 h-full relative">
        {/* 顶部悬浮状态栏 */}
        <header className="absolute top-0 left-0 w-full h-16 z-20 pointer-events-none flex justify-end px-6 items-center">
          <div className="pointer-events-auto glass-panel px-4 py-1.5 rounded-full flex items-center gap-3 text-sm border-white/10">
            <span className="text-white/60">BKT 掌握度评估:</span>
            <span className="text-primary font-mono font-medium drop-shadow-[0_0_8px_rgba(170,59,255,0.8)]">Lvl.4 进阶</span>
          </div>
        </header>

        {/* 画布区域 */}
        <div className="w-full h-full absolute inset-0">
          <LearningPathMap />
        </div>

        {/* 画中画：悬浮问答舱 */}
        <SocraticChatPanel />
      </main>

    </div>
  );
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center justify-center md:justify-start px-0 md:px-3 py-3 rounded-lg transition-colors ${
      active ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80 hover:bg-white/5'
    }`}>
      {icon}
      <span className="hidden md:block ml-3 text-sm">{label}</span>
    </button>
  );
}

export default App;
