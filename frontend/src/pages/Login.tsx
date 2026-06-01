import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  email: z.string().email('请输入正确邮箱'),
  password: z.string().min(6, '至少 6 位密码')
})

type FormValues = z.infer<typeof schema>

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    console.log('login submit', data)
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border bg-white p-8 shadow-sm">
      <h2 className="text-xl font-semibold">登录</h2>
      <p className="mt-2 text-sm text-slate-600">使用学校邮箱进入学习路径。</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
            placeholder="请输入密码"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {isSubmitting ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  )
}
