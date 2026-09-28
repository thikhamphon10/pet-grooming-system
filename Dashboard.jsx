import { useEffect, useState } from 'react'
import { supabase, STATUS, baht } from '../lib/supabase'

export default function Dashboard() {
  const [jobs, setJobs] = useState([])
  const [revenue, setRevenue] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    const start = new Date(); start.setHours(0, 0, 0, 0)
    const iso = start.toISOString()
    Promise.all([
      supabase.from('bookings').select('id,status,scheduled_at,pets(name,breed)').gte('scheduled_at', iso).order('scheduled_at'),
      supabase.from('payments').select('amount').gte('paid_at', iso),
    ]).then(([b, p]) => {
      if (b.error || p.error) return setError((b.error || p.error).message)
      setJobs(b.data)
      setRevenue(p.data.reduce((s, x) => s + Number(x.amount), 0))
    })
  }, [])

  const count = (s) => jobs.filter((j) => j.status === s).length
  const stats = [
    { label: 'งานวันนี้', value: jobs.length },
    { label: 'รอคิว', value: count('waiting') },
    { label: 'กำลังทำ', value: count('bathing') + count('grooming') },
    { label: 'รายได้วันนี้', value: baht(revenue) },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-semibold">วันนี้มีน้อง ๆ มาอาบน้ำกี่ตัวนะ</h1>
      {error && <p className="rounded-xl bg-coral/15 p-3 text-sm">เชื่อมต่อฐานข้อมูลไม่ได้: {error} — ตรวจสอบไฟล์ .env และรัน schema.sql</p>}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="panel">
            <p className="text-sm text-ink/60">{s.label}</p>
            <p className="mt-1 text-3xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>
      <section className="panel">
        <h2 className="mb-3 font-semibold">คิววันนี้</h2>
        {jobs.length === 0 ? <p className="text-ink/60">ยังไม่มีงานวันนี้ เริ่มจากเพิ่มการจองในหน้า “การจอง”</p> : (
          <ul className="divide-y divide-ink/10">
            {jobs.map((j) => (
              <li key={j.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{j.pets?.name}</p>
                  <p className="text-sm text-ink/60">{j.pets?.breed} · {new Date(j.scheduled_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm ${STATUS[j.status]?.color}`}>{STATUS[j.status]?.label}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
