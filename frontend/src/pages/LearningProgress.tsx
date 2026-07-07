import { useState, useEffect } from 'react'
import { useAuth } from '../store/auth'
import { getKnowledgePoints, getCurrentPlan, getUser } from '../api'
import type { KnowledgePoint, PlanItem } from '../api'
import { Play, CheckCircle2, CalendarRange, CircleDashed, Clock } from 'lucide-react'

// ===== 四列看板定义 =====
// planned: 本周学习计划中的任务
// in_progress: 用户标记为薄弱、正在攻克的知识点
// completed: 已完成的知识点（待后续接入 learning_progress 表）
// not_started: 其他未涉及的知识点
type ProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'planned'

interface ColumnDef {
  key: ProgressStatus
  title: string
  icon: typeof Play
  border: string  // 列边框颜色
  bg: string      // 列头背景色
  text: string    // 文字颜色
  dot: string     // 圆点颜色
  empty: string   // 空状态提示语
}

const COLUMNS: ColumnDef[] = [
  { key: 'planned',     title: '计划中',   icon: CalendarRange,
    border: 'border-blue-500/30', bg: 'bg-blue-950/10', text: 'text-blue-400', dot: 'bg-blue-400',
    empty: '本周暂无学习计划' },
  { key: 'in_progress', title: '进行中',   icon: Play,
    border: 'border-amber-500/30', bg: 'bg-amber-950/10', text: 'text-amber-400', dot: 'bg-amber-400',
    empty: '暂无进行中的学习' },
  { key: 'completed',   title: '已完成',   icon: CheckCircle2,
    border: 'border-green-500/30', bg: 'bg-green-950/10', text: 'text-green-400', dot: 'bg-green-400',
    empty: '还没有完成的知识点' },
  { key: 'not_started', title: '未开始',   icon: CircleDashed,
    border: 'border-gray-500/30', bg: 'bg-gray-950/10', text: 'text-gray-400', dot: 'bg-gray-400',
    empty: '暂无数据' },
]

export default function LearningProgress() {
  const { userId } = useAuth()
  const [allPoints, setAllPoints] = useState<KnowledgePoint[]>([])  // 所有一级知识点
  const [planItems, setPlanItems] = useState<PlanItem[]>([])        // 本周学习计划
  const [weakNames, setWeakNames] = useState<string[]>([])          // 用户标记的薄弱科目
  const [loading, setLoading] = useState(true)

  // 进入页面时加载数据：知识点列表 + 周计划 + 用户画像
  useEffect(() => {
    if (!userId) return
    Promise.all([
      getKnowledgePoints(),                          // 获取所有知识点
      getCurrentPlan(userId).catch(() => ({ data: { data: { items: [] } } })),  // 获取本周计划
      getUser(userId).catch(() => null),              // 获取用户画像（含薄弱科目）
    ]).then(([kpRes, planRes, userRes]) => {
      // 只取一级知识点（parentId === null 的顶级课程）
      const topLevel = kpRes.data.data.filter(k => k.parentId === null)
      setAllPoints(topLevel)
      setPlanItems(planRes.data.data.items || [])

      // 解析用户画像中的薄弱科目（JSON 字符串 → 数组）
      if (userRes) {
        try {
          const w = userRes.data.data.profile?.weakKnowledge
          if (w) setWeakNames(JSON.parse(w))
        } catch {}
      }
    }).finally(() => setLoading(false))
  }, [userId])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-4 animate-pulse">
        <div className="h-6 w-40 bg-secondary rounded" />
        <div className="h-64 bg-card border border-border rounded-xl" />
      </div>
    )
  }

  // ===== 知识点归类逻辑 =====
  // 1. 计划中 → 本周学习计划里的知识点
  // 2. 进行中 → 用户标记为薄弱且未在计划中的知识点
  // 3. 已完成 → 暂无（后续接入 learning_progress 表）
  // 4. 未开始 → 既不在计划也不是薄弱的知识点

  // 获取本周计划中的知识点 ID
  const plannedIds = new Set(planItems.map(p => p.knowledgePointId))
  // 获取用户薄弱科目的知识点 ID
  const weakIds = new Set(
    allPoints.filter(k => weakNames.includes(k.name)).map(k => k.id)
  )

  // 按状态归类
  const categorized: Record<ProgressStatus, KnowledgePoint[]> = {
    planned:     allPoints.filter(k => plannedIds.has(k.id)),
    in_progress: allPoints.filter(k => weakIds.has(k.id) && !plannedIds.has(k.id)),
    completed:   [],  // TODO: 从 learning_progress 表读取已完成的知识点
    not_started: allPoints.filter(k => !plannedIds.has(k.id) && !weakIds.has(k.id)),
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold">学习进度</h1>
        <p className="text-sm text-muted-foreground mt-1">知识掌握度总览</p>
      </div>

      {/* 统计行：四列各自的数量 */}
      <div className="grid grid-cols-4 gap-3">
        {COLUMNS.map(col => {
          const count = categorized[col.key].length
          return (
            <div key={col.key} className={`rounded-lg border ${col.border} ${col.bg} p-4`}>
              <div className="flex items-center gap-2 mb-1">
                <col.icon size={16} className={col.text} />
                <span className="text-sm font-medium text-foreground">{col.title}</span>
              </div>
              <span className={`text-2xl font-semibold ${col.text}`}>{count}</span>
              <span className="text-xs text-muted-foreground ml-1">项</span>
            </div>
          )
        })}
      </div>

      {/* 四列看板 */}
      <div className="grid grid-cols-4 gap-3">
        {COLUMNS.map(col => {
          const items = categorized[col.key]
          return (
            <div key={col.key} className="rounded-xl border border-border bg-card overflow-hidden">
              {/* 列头 */}
              <div className={`px-4 py-3 border-b border-border ${col.bg}`}>
                <div className="flex items-center gap-2">
                  <col.icon size={15} className={col.text} />
                  <h3 className="text-sm font-semibold">{col.title}</h3>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full border ${col.border} ${col.text}`}>
                    {items.length}
                  </span>
                </div>
              </div>

              {/* 知识点卡片列表 */}
              <div className="p-3 space-y-2 min-h-[250px] max-h-[500px] overflow-y-auto">
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">{col.empty}</p>
                ) : (
                  items.map(kp => {
                    // 优先使用数据库 estimated_hours，其次用计划中的预估分钟数换算
                    const planItem = planItems.find(p => p.knowledgePointId === kp.id)
                    const hours = kp.estimatedHours || (planItem ? Math.round(planItem.estimatedMinutes / 60 * 10) / 10 : null)
                    // 已完成 = 0 小时，其他 = 还需学习小时数
                    const remaining = col.key === 'completed' ? 0 : hours
                    return (
                      <div key={kp.id} className={`px-3 py-3 rounded-lg border ${col.border} ${col.bg}`}>
                        {/* 名称 + 描述 */}
                        <div className="flex items-start gap-2.5">
                          <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${col.dot}`} />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{kp.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{kp.description}</p>
                          </div>
                        </div>
                        {/* 还需学习时间 */}
                        {remaining !== null && remaining !== undefined && (
                          <div className="flex items-center gap-1.5 mt-2 ml-5 px-2 py-1 rounded-md bg-background/40 border border-border/50">
                            <Clock size={12} className={`shrink-0 ${col.text}`} />
                            <span className="text-xs font-medium text-foreground">
                              {col.key === 'completed' ? '已完成' : `还需 ${remaining} 小时`}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
