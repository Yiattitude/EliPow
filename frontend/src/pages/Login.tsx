import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api'
import { useAuth } from '../store/auth'
import { Zap } from 'lucide-react'

const schema = z.object({
  email: z.string().email('请输入正确的邮箱地址'),
  password: z.string().min(6, '密码至少 6 位'),
})

type FormValues = z.infer<typeof schema>

export default function Login() {
  const [apiError, setApiError] = useState('')
  const navigate = useNavigate()
  const setAuth = useAuth((s) => s.setAuth)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    setApiError('')
    try {
      const res = await login(data.email, data.password)
      const d = res.data.data
      setAuth(d.token, d.id, d.email, d.nickname, d.hasProfile)
      navigate(d.hasProfile ? '/dashboard' : '/onboarding')
    } catch {
      setApiError('邮箱或密码错误，请重试')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary mb-4">
            <Zap size={20} className="text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">欢迎回来</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">登录你的学习账号</p>
        </div>

        {/* 卡片 */}
        <div className="rounded-xl border border-border bg-card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {apiError && (
              <div className="rounded-md bg-red-950/40 border border-red-800/50 px-3 py-2 text-xs text-red-400">
                {apiError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">邮箱</label>
              <input
                className="w-full h-9 rounded-md border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground/50
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                placeholder="name@school.edu"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">密码</label>
              <input
                type="password"
                className="w-full h-9 rounded-md border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground/50
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                placeholder="输入密码"
                {...register('password')}
              />
              {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium
                hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isSubmitting ? '登录中...' : '登录'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          还没有账号？<Link to="/register" className="text-primary hover:underline">立即注册</Link>
        </p>
      </div>
    </div>
  )
}
