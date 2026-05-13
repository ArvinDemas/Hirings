# Kontrak API: Integrasi Model AI Hirings

Dokumen ini berisi spesifikasi *API Contract* untuk menjembatani komunikasi antara **Backend/Frontend (Tim Full-Stack)** dengan **Model Machine Learning (Tim AI Engineer)**. 

Semua *endpoint* di bawah ini berbasis REST API menggunakan arsitektur **FastAPI** yang berjalan pada port `8000` (atau URL publik Ngrok yang di-*generate* saat *runtime*).

---

## 1. Job Recommendation Endpoint
Mengembalikan daftar rekomendasi pekerjaan (*Top 5*) berdasarkan *skill* yang diinputkan pengguna. Menggunakan sistem *hybrid* (TF-IDF + Sentence-Transformers NLP).

* **URL:** `/recommend`
* **Method:** `POST`
* **Content-Type:** `application/json`

### Request Payload (Body)
```json
{
  "skills": "Python SQL TensorFlow Machine Learning Data Analysis"
}
```

### Success Response
* **Code:** `200 OK`
* **Format:** Array of Objects
```json
[
  {
    "job_id": 3895215696,
    "company_id": 13331595,
    "title": "Data Analyst",
    "location": "United States"
  },
  {
    "job_id": 3902828481,
    "company_id": 3715179,
    "title": "Remote opportunity for P&C Insurance Data Scientist",
    "location": "United States"
  }
]
```

---

## 2. Skill Trend Forecasting Endpoint
Memprediksi angka permintaan *skill* di masa depan (1 langkah ke depan) menggunakan model *Deep Learning* LSTM (Long Short-Term Memory).

* **URL:** `/forecast`
* **Method:** `POST`
* **Content-Type:** `application/json`

### Request Payload (Body)
*Catatan: `trend` harus berupa array/list berisi minimal 3 angka (sesuai `window_size` arsitektur).*
```json
{
  "trend": [70, 80, 90]
}
```

### Success Response
* **Code:** `200 OK`
* **Format:** Object
```json
{
  "prediction": 88.69312
}
```

---

## 3. AI Career Suggestion Endpoint
Memberikan paragraf saran pengembangan karier otomatis berdasarkan *skillset* yang dimiliki pengguna saat ini.

* **URL:** `/career-suggestion`
* **Method:** `POST`
* **Content-Type:** `application/json`

### Request Payload (Body)
```json
{
  "skills": "React Node.js MongoDB"
}
```

### Success Response
* **Code:** `200 OK`
* **Format:** Object
```json
{
  "career_suggestion": "\n        Based on your current skills in React Node.js MongoDB,\n        you are suitable for software development roles\n        such as Frontend Developer, Mobile Developer,\n        or Fullstack Developer.\n\n        To advance your career,\n        consider improving:\n        - Backend Development\n        - API Integration\n        - System Design\n        - Cloud Deployment\n\n        Your profile shows strong potential\n        in modern software engineering careers.\n        "
}
```

---

## Informasi Tambahan untuk Tim Full-Stack
1. **Host URL:** Karena model dijalankan di Google Colab, URL dasarnya (*base URL*) akan berubah-ubah melalui `ngrok`. Pastikan sistem *Backend/Frontend* kalian menggunakan variabel `.env` untuk `AI_API_URL` agar mudah diganti setiap kali Colab dijalankan ulang.
2. **Asynchronous:** Walaupun FastAPI sangat cepat, beberapa proses prediksi model *Deep Learning* memakan waktu sekian detik. Pastikan kalian menggunakan proses *Asynchronous* (`async/await`) atau menampilkan *loading state* (Animasi Loading) di *frontend* Reac JS saat memanggil API ini.
