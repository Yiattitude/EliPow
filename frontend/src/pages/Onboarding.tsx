import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { getKnowledgePoints, saveProfile } from '../api'
import type { KnowledgePoint } from '../api'
import { ArrowRight, ArrowLeft, Check, GraduationCap, Target, BookOpen, Zap } from 'lucide-react'

const GRADES = ['大一', '大二', '大三', '大四']
const TARGETS = [
  { value: '国网就业', label: '国网就业', desc: '国家电网、南方电网等' },
  { value: '考研深造', label: '考研深造', desc: '继续攻读研究生' },
  { value: '竞赛提升', label: '竞赛提升', desc: '电子设计、数学建模等' },
  { value: '考公考编', label: '考公考编', desc: '公务员、事业单位' },
  { value: '随便看看', label: '随便看看', desc: '先探索再决定' },
]
const LEVELS = [
  { value: 'BEGINNER', label: '入门', desc: '刚开始接触专业课' },
  { value: 'INTERMEDIATE', label: '进阶', desc: '有一定基础，能独立解题' },
  { value: 'ADVANCED', label: '高级', desc: '具备较深的理论功底' },
]

const selClass = 'bg-primary/10 border-primary/50 ring-1 ring-primary/20'
const baseClass = 'border-border bg-card hover:border-foreground/20 hover:bg-secondary/50'

export default function Onboarding() {
  const navigate = useNavigate()
  const { userId, setHasProfile } = useAuth()

  const [step, setStep] = useState(1)
  const [grade, setGrade] = useState('')
  const [target, setTarget] = useState('')
  const [abilityLevel, setAbilityLevel] = useState('')
  const [weakKnowledge, setWeakKnowledge] = useState<string[]>([])
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePoint[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getKnowledgePoints()
      .then(res => {
        setKnowledgePoints(res.data.data.filter(k => k.parentId === null))
      })
      .catch(() => setError('加载知识点失败'))
  }, [])

  const toggleKnowledge = (name: string) => {
    setWeakKnowledge(prev =>
      prev.includes(name) ? prev.filter(k => k !== name) : [...prev, name]
    )
  }

  const canNext = step === 1 && grade && target && abilityLevel
  const canSubmit = step === 2 && weakKnowledge.length > 0

  const handleSubmit = async () => {
    if (!canSubmit || !userId) return
    setSubmitting(true)
    setError('')
    try {
      await saveProfile(userId, { grade, target, abilityLevel, weakKnowledge })
      setHasProfile(true)
      navigate('/dashboard')
    } catch {
      setError('保存失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary mb-4">
          <Zap size={20} className="text-primary-foreground" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">完善学习画像</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {step === 1 ? '告诉我们你的起点和目标' : '选出你希望重点攻克的方向'}
        </p>
      </div>

      {/* 步骤指示器 */}
      <div className="flex items-center justify-center gap-0 mb-8">
        {[1, 2].map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border transition-all duration-300 ${
              s <= step
                ? 'bg-primary border-primary text-primary-foreground'
                : 'border-border text-muted-foreground'
            }`}>
              {s < step ? <Check size={12} /> : s}
            </div>
            <span className={`ml-2 text-xs font-medium ${s <= step ? 'text-foreground' : 'text-muted-foreground'}`}>
              {s === 1 ? '基本信息' : '薄弱科目'}
            </span>
            {i === 0 && (
              <div className={`mx-4 w-16 h-px transition-colors duration-300 ${step > 1 ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-950/40 border border-red-800/50 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      {/* ====== 步骤 1 ====== */}
      {step === 1 && (
        <div className="space-y-4">
          {/* 年级 */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap size={16} className="text-primary" />
              <h2 className="text-sm font-semibold">你的年级</h2>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {GRADES.map(g => (
                <div key={g} onClick={() => setGrade(g)}
                  className={`text-center py-2.5 rounded-lg text-sm font-medium border transition-all duration-150 cursor-pointer ${
                    grade === g ? selClass : baseClass + ' text-muted-foreground'
                  }`}>
                  {g}
                </div>
              ))}
            </div>
          </div>

          {/* 目标 */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target size={16} className="text-primary" />
              <h2 className="text-sm font-semibold">你的目标</h2>
            </div>
            <div className="space-y-2">
              {TARGETS.map(t => (
                <div key={t.value} onClick={() => setTarget(t.value)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-150 cursor-pointer ${
                    target === t.value ? selClass : baseClass
                  }`}>
                  <span className={`text-sm font-medium ${target === t.value ? 'text-primary' : 'text-foreground'}`}>
                    {t.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{t.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 水平 */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-primary" />
              <h2 className="text-sm font-semibold">自评水平</h2>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {LEVELS.map(l => (
                <div key={l.value} onClick={() => setAbilityLevel(l.value)}
                  className={`text-center py-3 rounded-lg border transition-all duration-150 cursor-pointer ${
                    abilityLevel === l.value ? selClass : baseClass
                  }`}>
                  <div className={`text-sm font-medium ${abilityLevel === l.value ? 'text-primary' : 'text-foreground'}`}>
                    {l.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{l.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 下一步 */}
          <div onClick={() => canNext && setStep(2)}
            className={`w-full text-center py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              canNext
                ? 'bg-primary text-primary-foreground hover:opacity-90 cursor-pointer'
                : 'bg-secondary text-muted-foreground cursor-not-allowed'
            }`}>
            <span className="flex items-center justify-center gap-2">
              下一步 <ArrowRight size={14} />
            </span>
          </div>
        </div>
      )}

      {/* ====== 步骤 2 ====== */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={16} className="text-primary" />
              <h2 className="text-sm font-semibold">选出你感觉吃力的科目</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-4 mt-1">可多选，选中科目将优先纳入学习计划</p>
            <div className="space-y-2">
              {knowledgePoints.map(kp => {
                const sel = weakKnowledge.includes(kp.name)
                return (
                  <div key={kp.id} onClick={() => toggleKnowledge(kp.name)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-150 cursor-pointer ${
                      sel ? selClass : baseClass
                    }`}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      sel ? 'bg-primary border-primary' : 'border-border'
                    }`}>
                      {sel && <Check size={10} className="text-primary-foreground" />}
                    </div>
                    <span className={`text-sm font-medium ${sel ? 'text-primary' : 'text-foreground'}`}>
                      {kp.name}
                    </span>
                    <span className="text-xs text-muted-foreground hidden sm:inline">{kp.description}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 已选摘要 */}
          {weakKnowledge.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground mb-2">你将重点攻克</p>
              <div className="flex flex-wrap gap-1.5">
                {weakKnowledge.map(k => (
                  <span key={k} className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 按钮 */}
          <div className="flex gap-3">
            <div onClick={() => setStep(1)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-all duration-150 cursor-pointer ${baseClass}`}>
              <ArrowLeft size={14} /> 上一步
            </div>
            <div onClick={() => canSubmit && !submitting && handleSubmit()}
              className={`flex-1 text-center py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                canSubmit && !submitting
                  ? 'bg-primary text-primary-foreground hover:opacity-90 cursor-pointer'
                  : 'bg-secondary text-muted-foreground cursor-not-allowed'
              }`}>
              {submitting ? '保存中...' : '完成，开始学习'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
