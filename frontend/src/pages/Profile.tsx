import { useState, useEffect } from 'react'
import { useAuth } from '../store/auth'
import { getUser } from '../api'
import type { UserInfo } from '../api'
import { GraduationCap, Target, TrendingUp, Mail, User as UserIcon } from 'lucide-react'

const LEVEL_LABELS: Record<string, string> = {
  'BEGINNER': '入门', 'INTERMEDIATE': '进阶', 'ADVANCED': '高级'
}

export default function Profile() {
  const { userId } = useAuth()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    getUser(userId)
      .then(res => setUser(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse space-y-4">
        <div className="h-6 w-32 bg-secondary rounded" />
        <div className="h-48 bg-card border border-border rounded-xl" />
      </div>
    )
  }
  if (!user) return null

  const items = [
    { icon: UserIcon, label: '昵称', value: user.nickname || '未设置' },
    { icon: Mail, label: '邮箱', value: user.email },
    { icon: GraduationCap, label: '年级', value: user.profile?.grade || '未设置' },
    { icon: Target, label: '学习目标', value: user.profile?.target || '未设置' },
    { icon: TrendingUp, label: '自评水平', value: user.profile?.abilityLevel ? LEVEL_LABELS[user.profile.abilityLevel] : '未设置' },
    { icon: UserIcon, label: '角色', value: user.role === 'STUDENT' ? '学生' : user.role },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold">能力档案</h1>
        <p className="text-sm text-muted-foreground mt-1">你的个人信息与学习画像</p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* 头部 */}
        <div className="px-6 py-5 border-b border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-lg font-semibold text-primary">
              {(user.nickname || user.email)[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="font-semibold">{user.nickname || '未命名用户'}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* 信息列表 */}
        <div className="divide-y divide-border">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <item.icon size={16} className="text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground w-20">{item.label}</span>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 薄弱科目标签 */}
      {user.profile?.weakKnowledge && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold mb-3">薄弱科目</h3>
          <div className="flex flex-wrap gap-2">
            {(() => {
              try {
                const list = JSON.parse(user.profile.weakKnowledge)
                return list.map((k: string) => (
                  <span key={k} className="px-3 py-1 rounded-full text-xs font-medium bg-red-950/20 text-red-400 border border-red-800/30">
                    {k}
                  </span>
                ))
              } catch {
                return <span className="text-xs text-muted-foreground">-</span>
              }
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
