import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { register as registerApi } from '../api'
import { useAuth } from '../store/auth'

const schema = z.object({
  email: z.string().email('请输入正确邮箱'),
  password: z.string().min(6, '至少 6 位密码'),
  nickname: z.string().optional()
})

type FormValues = z.infer<typeof schema>

export default function Register() {
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
      const res = await registerApi(data.email, data.password, data.nickname)
      const d = res.data.data
      setAuth(d.token, d.email, d.nickname)
      navigate('/')
    } catch {
      setApiError('注册失败，邮箱可能已被使用')
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border bg-white p-8 shadow-sm">
      <h2 className="text-xl font-semibold">注册</h2>
      <p className="mt-2 text-sm text-slate-600">创建账号开始学习路径。</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {apiError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{apiError}</p>
        )}
        <div>
          <label className="text-sm font-medium">邮箱</label>
          <input
            className="mt-2 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="name@school.edu"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">密码</label>
          <input
            className="mt-2 w-full rounded-lg border px-3 py-2 text-sm"
            type="password"
            placeholder="至少 6 位密码"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">昵称（选填）</label>
          <input
            className="mt-2 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="如何称呼你"
            {...register('nickname')}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {isSubmitting ? '注册中...' : '注册'}
        </button>
        <p className="text-center text-xs text-slate-500">
          已有账号？<Link to="/login" className="text-slate-900 underline">登录</Link>
        </p>
      </form>
    </div>
  )
}
