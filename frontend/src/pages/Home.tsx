import { Link } from 'react-router-dom'
import { BookOpen, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <section className="space-y-8">
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 text-slate-600">
          <BookOpen className="h-5 w-5" />
          <span className="text-sm">学习路径主线 · 资源复用型问答</span>
        </div>
        <h1 className="mt-4 text-3xl font-semibold">电气专业学习路径助手</h1>
        <p className="mt-3 text-slate-600">
          从画像、测评到路径推荐，构建清晰的学习阶段与下一步行动。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
          >
            进入体验
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button className="rounded-lg border px-4 py-2 text-sm text-slate-700">
            查看学习路径
          </button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: '当前阶段', desc: '基于画像与测评结果给出阶段判断' },
          { title: '下一步建议', desc: '结合知识图谱依赖给出学习任务' },
          { title: '资源复用', desc: '问答结果引用已有课程与资料' }
        ].map((item) => (
          <div key={item.title} className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
