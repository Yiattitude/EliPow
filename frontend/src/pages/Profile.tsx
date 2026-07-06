import { useState, useEffect } from 'react'
import { useAuth } from '../store/auth'
import { getUser, getKnowledgePoints } from '../api'
import type { UserInfo, KnowledgePoint } from '../api'
import { GraduationCap, Target, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react'

const LEVEL_LABELS: Record<string, string> = {
  'BEGINNER': '入门',
  'INTERMEDIATE': '进阶',
  'ADVANCED': '高级'
}

export default function Profile() {
  const { userId } = useAuth()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [allPoints, setAllPoints] = useState<KnowledgePoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    Promise.all([
      getUser(userId),
      getKnowledgePoints()
    ]).then(([userRes, kpRes]) => {
      setUser(userRes.data.data)
      setAllPoints(kpRes.data.data.filter(k => k.parentId === null))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [userId])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="h-6 w-32 bg-secondary rounded" />
        <div className="h-40 bg-card border border-border rounded-xl" />
        <div className="h-40 bg-card border border-border rounded-xl" />
      </div>
    )
  }

  if (!user) return null

  const profile = user.profile
  const weakNames: string[] = profile?.weakKnowledge
    ? (() => { try { return JSON.parse(profile.weakKnowledge) } catch { return [] } })()
    : []

  const mastered = allPoints.filter(k => !weakNames.includes(k.name))
  const weak = allPoints.filter(k => weakNames.includes(k.name))

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold">能力档案</h1>
        <p className="text-sm text-muted-foreground mt-1">你的学习画像与知识掌握概览</p>
      </div>

      {/* 基本信息卡片 */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <GraduationCap size={15} className="text-primary" /> 基本信息
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: GraduationCap, label: '年级', value: profile?.grade || '未设置' },
            { icon: Target, label: '目标', value: profile?.target || '未设置' },
            { icon: TrendingUp, label: '水平', value: profile?.abilityLevel ? LEVEL_LABELS[profile.abilityLevel] : '未设置' },
          ].map((item, i) => (
            <div key={i} className="rounded-lg bg-secondary/50 border border-border p-3 text-center">
              <item.icon size={14} className="text-muted-foreground mx-auto mb-1.5" />
              <div className="text-xs text-muted-foreground">{item.label}</div>
              <div className="text-sm font-semibold mt-0.5">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 已掌握 */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <ShieldCheck size={15} className="text-green-400" /> 已掌握领域
        </h2>
        {mastered.length > 0 ? (
          <div className="space-y-2">
            {mastered.map(k => (
              <div key={k.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-green-950/10 border border-green-800/20">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-sm text-green-300/80">{k.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">{k.description}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">完成画像后可查看已掌握的知识领域</p>
        )}
      </div>

      {/* 薄弱项 */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle size={15} className="text-amber-400" /> 待提升领域
        </h2>
        {weak.length > 0 ? (
          <div className="space-y-2">
            {weak.map(k => (
              <div key={k.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-amber-950/10 border border-amber-800/20">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-sm text-amber-300/80">{k.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">{k.description}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">太棒了，没有标记薄弱项！可以在设置中更新</p>
        )}

        {weak.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">整体掌握度</span>
              <span className="font-medium text-foreground">
                {allPoints.length > 0 ? Math.round((mastered.length / allPoints.length) * 100) : 0}%
              </span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-green-400 transition-all duration-700"
                style={{ width: `${allPoints.length > 0 ? Math.round((mastered.length / allPoints.length) * 100) : 0}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
              <span>0%</span>
              <span>掌握 {mastered.length}/{allPoints.length} 门核心课程</span>
              <span>100%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
