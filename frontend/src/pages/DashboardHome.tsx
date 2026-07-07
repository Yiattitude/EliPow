import { useState, useEffect } from 'react'
import { useAuth } from '../store/auth'
import { generatePlan, getCurrentPlan, type PlanItem } from '../api'
import { Clock, ChevronRight, ArrowRight, BookOpen, RefreshCw } from 'lucide-react'

/**
 * 仪表盘首页 - 动态学习计划
 *
 * 用户流程：
 * 1. 进入页面 → 检查是否有本周计划
 * 2. 无计划 → 弹出时间预算窗口，用户输入每周可用学习时间
 * 3. 提交预算 → 后端 StudyPlanService 自动生成任务列表
 * 4. 展示计划 → 按优先级排列的知识点列表，含预估耗时
 * 5. 可随时点击"重新规划"调整时间预算
 */
export default function DashboardHome() {
  const { userId } = useAuth()

  const [showBudget, setShowBudget] = useState(false)  // 是否显示预算弹窗
  const [hours, setHours] = useState(10)                // 用户输入的每周可用小时数
  const [plan, setPlan] = useState<PlanItem[]>([])      // 当前周计划列表
  const [totalMinutes, setTotalMinutes] = useState(0)   // 计划总时长（分钟）
  const [loading, setLoading] = useState(false)          // 生成请求中
  const [hasPlan, setHasPlan] = useState(false)          // 是否有计划

  // 进入页面时检查当前用户是否已有周计划
  useEffect(() => {
    if (!userId) return
    getCurrentPlan(userId)
      .then(res => {
        const d = res.data.data
        if (d.items && d.items.length > 0) {
          // 已有计划，直接展示
          setPlan(d.items)
          setTotalMinutes(d.totalMinutes)
          setHasPlan(true)
        } else {
          // 无计划，弹出预算窗口
          setShowBudget(true)
        }
      })
      .catch(() => setShowBudget(true))  // 请求失败也弹窗
  }, [userId])

  // 生成新的学习计划
  const handleGenerate = async () => {
    if (!userId) return
    setLoading(true)
    try {
      // 调用后端 API，小时→分钟
      const res = await generatePlan(userId, hours * 60)
      const d = res.data.data
      setPlan(d.items)
      setTotalMinutes(d.totalMinutes)
      setHasPlan(true)
      setShowBudget(false)  // 关闭预算弹窗
    } catch {
      alert('生成计划失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 任务类型的中文标签和颜色映射
  const reasonLabel: Record<string, string> = {
    '薄弱科目': '重点攻克',
    '前置基础': '前置复习',
    '拓展学习': '拓展学习',
  }

  const reasonColor: Record<string, string> = {
    '薄弱科目': 'border-red-500/30 bg-red-950/10 text-red-400',
    '前置基础': 'border-amber-500/30 bg-amber-950/10 text-amber-400',
    '拓展学习': 'border-blue-500/30 bg-blue-950/10 text-blue-400',
  }

  return (
    <div className="space-y-6">
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">本周学习计划</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {hasPlan ? `共 ${plan.length} 项任务 · 预计 ${Math.round(totalMinutes / 60 * 10) / 10}h` : '还没有本周计划'}
          </p>
        </div>
        {hasPlan && (
          <button onClick={() => setShowBudget(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw size={12} /> 重新规划
          </button>
        )}
      </div>

      {/* ===== 时间预算弹窗 ===== */}
      {showBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20 mb-3">
                <Clock size={20} className="text-primary" />
              </div>
              <h2 className="text-base font-semibold">制定本周计划</h2>
              <p className="text-xs text-muted-foreground mt-1.5">这周你计划投入多少时间学习？</p>
            </div>

            {/* 小时数输入 */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <input type="number" value={hours}
                onChange={e => setHours(Math.max(1, Math.min(40, parseInt(e.target.value) || 1)))}
                className="w-20 text-center h-10 rounded-lg border border-border bg-secondary text-lg font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <span className="text-sm text-muted-foreground">小时 / 周</span>
            </div>

            <button onClick={handleGenerate} disabled={loading || !hours}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2">
              {loading ? '生成中...' : '生成学习计划'}
              {!loading && <ArrowRight size={14} />}
            </button>
          </div>
        </div>
      )}

      {/* ===== 计划任务列表 ===== */}
      {hasPlan && plan.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          {/* 图例 */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> 前置复习</span>
            <span className="flex items-center gap-1 ml-3"><span className="w-2 h-2 rounded-full bg-red-400" /> 重点攻克</span>
            <span className="flex items-center gap-1 ml-3"><span className="w-2 h-2 rounded-full bg-blue-400" /> 拓展学习</span>
          </div>

          {/* 每项任务卡片 */}
          <div className="space-y-2">
            {plan.map((item, i) => (
              <div key={item.knowledgePointId}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
                  reasonColor[item.reason] || 'border-border'
                }`}>
                <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">{i + 1}</span>
                {i > 0 && <ChevronRight size={12} className="text-muted-foreground shrink-0 -ml-1" />}

                {/* 知识点名称和描述 */}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium">{item.name}</span>
                  {item.description && (
                    <span className="text-xs text-muted-foreground ml-2">{item.description}</span>
                  )}
                </div>

                {/* 类型标签 */}
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  reasonColor[item.reason] || 'border-border text-muted-foreground'
                }`}>
                  {reasonLabel[item.reason] || item.reason}
                </span>

                {/* 预估耗时 */}
                <span className="text-xs text-muted-foreground shrink-0 w-12 text-right">
                  {Math.round(item.estimatedMinutes / 6) / 10}h
                </span>
              </div>
            ))}
          </div>

          {/* 进度条 */}
          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>已完成 0/{plan.length}</span>
              <span>总计划 {Math.round(totalMinutes / 60 * 10) / 10}h</span>
            </div>
            <div className="h-1 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: '0%' }} />
            </div>
          </div>
        </div>
      )}

      {/* 加载中 */}
      {!hasPlan && !showBudget && (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">加载中...</p>
        </div>
      )}
    </div>
  )
}
