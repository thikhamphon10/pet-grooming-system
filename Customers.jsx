import { useEffect, useState } from 'react'
import { Plus, PawPrint, Phone } from 'lucide-react'
import { supabase } from '../lib/supabase'

const empty = { name: '', phone: '' }
const emptyPet = { name: '', species: 'dog', breed: '', weight_kg: '' }

export default function Customers() {
  const [list, setList] = useState([])
  const [form, setForm] = useState(empty)
  const [petFor, setPetFor] = useState(null)
  const [pet, setPet] = useState(emptyPet)
  const [error, setError] = useState('')

  const load = async () => {
    const { data, error } = await supabase.from('customers').select('*, pets(*)').order('created_at', { ascending: false })
    if (error) setError(error.message); else setList(data)
  }
  useEffect(() => { load() }, [])

  const addCustomer = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('customers').insert(form)
    if (error) return setError(error.message)
    setForm(empty); load()
  }
  const addPet = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('pets').insert({ ...pet, weight_kg: pet.weight_kg || null, customer_id: petFor })
    if (error) return setError(error.message)
    setPet(emptyPet); setPetFor(null); load()
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-semibold">ลูกค้าและสัตว์เลี้ยง</h1>
      {error && <p className="rounded-xl bg-coral/15 p-3 text-sm">{error}</p>}
      <form onSubmit={addCustomer} className="panel grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <input className="input" placeholder="ชื่อลูกค้า" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="เบอร์โทร" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <button className="btn justify-center"><Plus size={18} /> เพิ่มลูกค้า</button>
      </form>
      {list.length === 0 && <p className="text-ink/60">ยังไม่มีลูกค้า เพิ่มรายแรกด้านบนได้เลย</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((c) => (
          <div key={c.id} className="panel space-y-3">
            <div>
              <p className="text-lg font-semibold">{c.name}</p>
              <p className="flex items-center gap-1 text-sm text-ink/60"><Phone size={14} /> {c.phone}</p>
            </div>
            <ul className="space-y-1">
              {c.pets.map((p) => (
                <li key={p.id} className="flex items-center gap-2 rounded-xl bg-foam px-3 py-2 text-sm">
                  <PawPrint size={16} className="text-lagoon" /> <b>{p.name}</b>
                  <span className="text-ink/60">{p.breed} {p.weight_kg && `· ${p.weight_kg} กก.`}</span>
                </li>
              ))}
            </ul>
            {petFor === c.id ? (
              <form onSubmit={addPet} className="grid grid-cols-2 gap-2">
                <input className="input" placeholder="ชื่อสัตว์เลี้ยง" required value={pet.name} onChange={(e) => setPet({ ...pet, name: e.target.value })} />
                <select className="input" value={pet.species} onChange={(e) => setPet({ ...pet, species: e.target.value })}>
                  <option value="dog">สุนัข</option><option value="cat">แมว</option><option value="other">อื่น ๆ</option>
                </select>
                <input className="input" placeholder="สายพันธุ์" value={pet.breed} onChange={(e) => setPet({ ...pet, breed: e.target.value })} />
                <input className="input" type="number" step="0.1" placeholder="น้ำหนัก (กก.)" value={pet.weight_kg} onChange={(e) => setPet({ ...pet, weight_kg: e.target.value })} />
                <button className="btn justify-center">บันทึกสัตว์เลี้ยง</button>
                <button type="button" className="btn-ghost justify-center" onClick={() => setPetFor(null)}>ยกเลิก</button>
              </form>
            ) : (
              <button className="btn-ghost" onClick={() => setPetFor(c.id)}><Plus size={16} /> เพิ่มสัตว์เลี้ยง</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
