import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-semibold">页面不存在</h2>
      <p className="text-sm text-slate-600">返回首页继续浏览学习路径。</p>
      <Link className="rounded-lg border px-4 py-2 text-sm" to="/">
        返回首页
      </Link>
    </div>
  )
}
