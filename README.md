# Pet Grooming Management System
1. `npm install` แล้วคัดลอก `.env.example` เป็น `.env` ใส่ค่า Supabase
2. รัน `supabase/schema.sql` ใน Supabase SQL Editor
3. `npm run dev` — deploy ด้วย Vercel (ตั้ง env ทั้งสองตัว)

ลำดับพัฒนา: Layout+Dashboard → Customer & Pet → Booking (บริการ/ทรงตัดขน/บรีฟ/รูป) → Queue+สถานะ → Notification → POS
