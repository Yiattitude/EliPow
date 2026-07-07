import { useState, useEffect } from 'react'
import { useAuth } from '../store/auth'
import { getUser, getKnowledgePoints } from '../api'
import type { UserInfo, KnowledgePoint } from '../api'
import { ShieldCheck, BookOpen, AlertTriangle, Clock, Target, GraduationCap, TrendingUp } from 'lucide-react'

const LEVEL_LABELS: Record<string, string> = {
  'BEGINNER': '入门', 'INTERMEDIATE': '进阶', 'ADVANCED': '高级'
}

// 已从数据库 estimated_hours 字段获取，见 KnowledgePoint.estimatedHours

export default function Profile() {
  const { userId } = useAuth()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [allPoints, setAllPoints] = useState<KnowledgePoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    Promise.all([getUser(userId), getKnowledgePoints()])
      .then(([userRes, kpRes]) => {
        setUser(userRes.data.data)
        setAllPoints(kpRes.data.data.filter(k => k.parentId === null))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 animate-pulse">
        <div className="h-6 w-32 bg-secondary rounded" />
        <div className="h-48 bg-card border border-border rounded-xl" />
      </div>
    )
  }
  if (!user) return null

  // 解析薄弱科目
  const weakNames: string[] = user.profile?.weakKnowledge
    ? (() => { try { return JSON.parse(user.profile.weakKnowledge) } catch { return [] } })()
    : []

  // 找薄弱科目的前置（父节点）
  const parentNames = allPoints
    .filter(k => weakNames.includes(k.name))
    .map(k => k.name)

  // 归类
  const mastered = allPoints.filter(k => !weakNames.includes(k.name) && !parentNames.includes(k.name))
  const learning = allPoints.filter(k => parentNames.includes(k.name) && !weakNames.includes(k.name))
  const weak = allPoints.filter(k => weakNames.includes(k.name))

  const columns = [
    { key: 'mastered', title: '已掌握', icon: ShieldCheck, color: 'green',
      items: mastered, border: 'border-green-500/30', bg: 'bg-green-950/10', text: 'text-green-400', dot: 'bg-green-400' },
    { key: 'learning', title: '学习中', icon: BookOpen, color: 'amber',
      items: learning, border: 'border-amber-500/30', bg: 'bg-amber-950/10', text: 'text-amber-400', dot: 'bg-amber-400' },
    { key: 'weak', title: '待提升', icon: AlertTriangle, color: 'red',
      items: weak, border: 'border-red-500/30', bg: 'bg-red-950/10', text: 'text-red-400', dot: 'bg-red-400' },
  ]

  const total = allPoints.length
  const masteredCount = mastered.length
  const weakCount = weak.length
  const learningCount = learning.length

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 用户画像摘要 */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <GraduationCap size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">年级</span>
            <span className="font-medium">{user.profile?.grade || '-'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Target size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">目标</span>
            <span className="font-medium">{user.profile?.target || '-'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">水平</span>
            <span className="font-medium">{user.profile?.abilityLevel ? LEVEL_LABELS[user.profile.abilityLevel] : '-'}</span>
          </div>
        </div>
        {/* 概览条 */}
        <div className="mt-4 pt-3 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400" /> 已掌握 {masteredCount}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> 学习中 {learningCount}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400" /> 待提升 {weakCount}
          </span>
          <span className="ml-auto">
            整体掌握度 {total > 0 ? Math.round((masteredCount / total) * 100) : 0}%
          </span>
        </div>
        {/* 进度条 */}
        <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden flex">
          <div className="h-full bg-green-400 transition-all" style={{ width: `${(masteredCount / total) * 100}%` }} />
          <div className="h-full bg-amber-400 transition-all" style={{ width: `${(learningCount / total) * 100}%` }} />
          <div className="h-full bg-red-400 transition-all" style={{ width: `${(weakCount / total) * 100}%` }} />
        </div>
      </div>

      {/* 看板三列 */}
      <div className="grid grid-cols-3 gap-4">
        {columns.map(col => (
          <div key={col.key} className="rounded-xl border border-border bg-card overflow-hidden">
            {/* 列头 */}
            <div className={`px-4 py-3 border-b border-border ${col.bg}`}>
              <div className="flex items-center gap-2">
                <col.icon size={15} className={col.text} />
                <h3 className="text-sm font-semibold">{col.title}</h3>
                <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full border ${col.border} ${col.text}`}>
                  {col.items.length}
                </span>
              </div>
            </div>

            {/* 卡片列表 */}
            <div className="p-3 space-y-2 min-h-[200px]">
              {col.items.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  {col.key === 'mastered' ? '标记薄弱科目后可看到已掌握的知识' :
                   col.key === 'learning' ? '暂无进行中的学习' : '太棒了，没有待提升项'}
                </p>
              ) : (
                col.items.map(kp => (
                  <div key={kp.id}
                    className={`px-3 py-2.5 rounded-lg border ${col.border} ${col.bg} transition-colors`}>
                    <div className="flex items-start gap-2.5">
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${col.dot}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{kp.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{kp.description}</p>
                      </div>
                    </div>
                    {kp.estimatedHours && (
                      <div className="flex items-center gap-1 mt-1.5 ml-5">
                        <Clock size={10} className="text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">
                          约需 {kp.estimatedHours} 小时
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
