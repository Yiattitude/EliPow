import { useState, useEffect } from 'react'
import { useAuth } from '../store/auth'
import { generatePlan, getCurrentPlan, type PlanItem } from '../api'
import { Clock, ChevronRight, ArrowRight, BookOpen, RefreshCw } from 'lucide-react'

export default function DashboardHome() {
  const { userId } = useAuth()

  const [showBudget, setShowBudget] = useState(false)
  const [hours, setHours] = useState(10)
  const [plan, setPlan] = useState<PlanItem[]>([])
  const [totalMinutes, setTotalMinutes] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasPlan, setHasPlan] = useState(false)

  // 进入时检查是否有当前计划
  useEffect(() => {
    if (!userId) return
    getCurrentPlan(userId)
      .then(res => {
        const d = res.data.data
        if (d.items && d.items.length > 0) {
          setPlan(d.items)
          setTotalMinutes(d.totalMinutes)
          setHasPlan(true)
        } else {
          setShowBudget(true)
        }
      })
      .catch(() => setShowBudget(true))
  }, [userId])

  const handleGenerate = async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await generatePlan(userId, hours * 60)
      const d = res.data.data
      setPlan(d.items)
      setTotalMinutes(d.totalMinutes)
      setHasPlan(true)
      setShowBudget(false)
    } catch {
      alert('生成计划失败，请重试')
    } finally {
      setLoading(false)
    }
  }

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
      {/* 顶栏 */}
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

      {/* 预算弹窗 */}
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

      {/* 计划时间轴 */}
      {hasPlan && plan.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> 前置复习</span>
            <span className="flex items-center gap-1 ml-3"><span className="w-2 h-2 rounded-full bg-red-400" /> 重点攻克</span>
            <span className="flex items-center gap-1 ml-3"><span className="w-2 h-2 rounded-full bg-blue-400" /> 拓展学习</span>
          </div>

          <div className="space-y-2">
            {plan.map((item, i) => (
              <div key={item.knowledgePointId}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
                  reasonColor[item.reason] || 'border-border'
                }`}>
                {/* 序号 */}
                <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">{i + 1}</span>

                {/* 箭头 */}
                {i > 0 && <ChevronRight size={12} className="text-muted-foreground shrink-0 -ml-1" />}

                {/* 名称 */}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium">{item.name}</span>
                  {item.description && (
                    <span className="text-xs text-muted-foreground ml-2">{item.description}</span>
                  )}
                </div>

                {/* 标签 */}
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  reasonColor[item.reason] || 'border-border text-muted-foreground'
                }`}>
                  {reasonLabel[item.reason] || item.reason}
                </span>

                {/* 耗时 */}
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

      {/* 空状态 */}
      {!hasPlan && !showBudget && (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">加载中...</p>
        </div>
      )}
    </div>
  )
}
