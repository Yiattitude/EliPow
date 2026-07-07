import { useState, useEffect } from 'react'
import { useAuth } from '../store/auth'
import { getKnowledgePoints, getCurrentPlan, getUser } from '../api'
import type { KnowledgePoint, PlanItem } from '../api'
import { Play, CheckCircle2, CalendarRange, CircleDashed, Clock } from 'lucide-react'

type ProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'planned'

interface ColumnDef {
  key: ProgressStatus
  title: string
  icon: typeof Play
  border: string
  bg: string
  text: string
  dot: string
  empty: string
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
  const [allPoints, setAllPoints] = useState<KnowledgePoint[]>([])
  const [planItems, setPlanItems] = useState<PlanItem[]>([])
  const [weakNames, setWeakNames] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    Promise.all([
      getKnowledgePoints(),
      getCurrentPlan(userId).catch(() => ({ data: { data: { items: [] } } })),
      getUser(userId).catch(() => null),
    ]).then(([kpRes, planRes, userRes]) => {
      const topLevel = kpRes.data.data.filter(k => k.parentId === null)
      setAllPoints(topLevel)
      setPlanItems(planRes.data.data.items || [])

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

  // 计划中 ID
  const plannedIds = new Set(planItems.map(p => p.knowledgePointId))

  // 薄弱科目 ID
  const weakIds = new Set(
    allPoints.filter(k => weakNames.includes(k.name)).map(k => k.id)
  )

  // 归类
  const categorized: Record<ProgressStatus, KnowledgePoint[]> = {
    planned:     allPoints.filter(k => plannedIds.has(k.id)),
    in_progress: allPoints.filter(k => !plannedIds.has(k.id) && weakIds.has(k.id) &&
                    allPoints.find(p => weakIds.has(p.id)) !== undefined),
    completed:   [],
    not_started: allPoints.filter(k => !plannedIds.has(k.id) && !weakIds.has(k.id)),
  }

  // 进行中：薄弱科目中未在计划里的
  categorized.in_progress = allPoints.filter(k => weakIds.has(k.id) && !plannedIds.has(k.id))

  // 未开始：既不在计划也不在薄弱
  categorized.not_started = allPoints.filter(k =>
    !plannedIds.has(k.id) && !weakIds.has(k.id)
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold">学习进度</h1>
        <p className="text-sm text-muted-foreground mt-1">知识掌握度总览</p>
      </div>

      {/* 统计行 */}
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
              <div className={`px-4 py-3 border-b border-border ${col.bg}`}>
                <div className="flex items-center gap-2">
                  <col.icon size={15} className={col.text} />
                  <h3 className="text-sm font-semibold">{col.title}</h3>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full border ${col.border} ${col.text}`}>
                    {items.length}
                  </span>
                </div>
              </div>

              <div className="p-3 space-y-2 min-h-[250px] max-h-[500px] overflow-y-auto">
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">{col.empty}</p>
                ) : (
                  items.map(kp => {
                    const planItem = planItems.find(p => p.knowledgePointId === kp.id)
                    const hours = kp.estimatedHours || (planItem ? Math.round(planItem.estimatedMinutes / 60 * 10) / 10 : null)
                    const remaining = col.key === 'completed' ? 0 : hours
                    return (
                      <div key={kp.id} className={`px-3 py-3 rounded-lg border ${col.border} ${col.bg}`}>
                        <div className="flex items-start gap-2.5">
                          <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${col.dot}`} />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{kp.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{kp.description}</p>
                          </div>
                        </div>
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
