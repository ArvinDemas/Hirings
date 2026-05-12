# Panduan untuk Tim Full-Stack / Front-End

Halo Tim FS! Berikut adalah panduan terkait *Dashboard* Data Science yang telah selesai kami buat.

## 1. File Dashboard
Dashboard Streamlit sudah jadi dan dapat ditemukan pada file:
`D:\hirings\(Ridho Akbar Fadhilah) - EDA & Dashboard\app.py`

Dashboard ini menggunakan framework **Streamlit** dan library **Plotly** untuk visualisasinya. 

## 2. Struktur Tab
Sesuai rancangan *Project Plan*, Dashboard terbagi menjadi 3 Tab utama:
1. **Tab 1: Tren Skill LinkedIn** (Insight global)
2. **Tab 2: Info Gaji JobStreet** (Insight lokal Indonesia)
3. **Tab 3: Prediksi Tren Skill** (Mewadahi proyeksi dari model LSTM)

## 3. Integrasi ke Aplikasi Web Utama (Hirings)
Tim Data Science merekomendasikan opsi berikut untuk mengintegrasikan Streamlit ini ke dalam platform *web app* utama kalian (yang dibangun dengan Next.js / Vite / dsb):
- **Opsi A (Paling Mudah):** Melakukan *hosting* aplikasi Streamlit secara terpisah di **Streamlit Community Cloud** atau platform sejenis (misal: Railway, Render, HuggingFace Spaces), lalu sematkan (embed) URL tersebut menggunakan elemen `<iframe>` di dalam *web app* kalian.
- **Opsi B (Lanjutan):** Jika menginginkan kustomisasi tampilan total yang menyatu, kalian dapat menjadikan skrip `app.py` ini sebagai acuan perhitungan agregasinya saja (via REST API atau database query) dan menggambar ulang *chart*-nya di *frontend* menggunakan `Chart.js` atau `Recharts`. Namun ini butuh penyesuaian kode tambahan.

## 4. Dataset Requirement
Saat men-*deploy* aplikasi Streamlit (`app.py`), pastikan folder data referensi (dari Kaggle atau folder `33k/` dan `salary/`) dikonfigurasi dengan benar melalui *relative paths* atau dibiarkan menggunakan modul `kagglehub` di *production environment*.

Semangat melanjutkan implementasi antarmuka utamanya!
