import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
export const STATUS = {
  booked: { label: 'จองแล้ว', color: 'bg-ink/10 text-ink' },
  waiting: { label: 'รอคิว', color: 'bg-sun/30 text-ink' },
  bathing: { label: 'กำลังอาบน้ำ', color: 'bg-lagoon/20 text-lagoon-dark' },
  grooming: { label: 'กำลังตัดขน', color: 'bg-coral/20 text-coral' },
  done: { label: 'เสร็จแล้ว', color: 'bg-emerald-100 text-emerald-700' },
  paid: { label: 'ชำระแล้ว', color: 'bg-ink text-white' },
}
export const baht = (n) => '฿' + Number(n || 0).toLocaleString('th-TH')
