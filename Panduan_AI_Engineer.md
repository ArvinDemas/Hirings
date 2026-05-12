# Panduan untuk Tim AI Engineer (Ainur & Alya)

Halo Tim AI! Berikut adalah dokumentasi untuk mempermudah pekerjaan kalian dalam membangun model.

## 1. File Dataset & Fitur yang Tersedia
Karena batasan ukuran GitHub, dataset hasil *cleaning* dan vektor fitur tidak di-*push* ke *repository* ini. Kalian dapat mengunduhnya melalui folder **Google Drive** yang telah dibagikan oleh tim Data Science berikut:
🔗 **[Folder Dataset Data Science (Google Drive)](https://drive.google.com/drive/folders/1C8hbTSYALuCJP7bucDXzOcCNLSrttYVM?usp=drive_link)**
- **`linkedin_jobs_cleaned.csv`** (Dataset utama, 123K baris)
- **`tfidf_matrix.npz`** & **`tfidf_feature_names.pkl`** (Vektor TF-IDF untuk fitur *job description*)
- **`job_embeddings.npy`** (Vektor Semantik dari model `all-MiniLM-L6-v2`)

> 📖 **Data Dictionary:** Kalian bisa melihat penjelasan setiap kolom pada file data dictionary di dalam folder `(Arvin Demas Naryama) - Data Wrangling/output/data_dictionary.md`.

## 2. Recommendation Engine
Gunakan `job_embeddings.npy` atau kombinasi dengan TF-IDF untuk menghitung *cosine similarity* ketika mencocokkan profil pengguna dengan lowongan. Baris (row index) di matriks/embedding **100% selaras (aligned)** dengan baris pada `linkedin_jobs_cleaned.csv`.

## 3. Integrasi LSTM Forecasting
Untuk fitur *Forecasting Tren Skill*:
- Tim Data Science telah menyiapkan **Tab 3 di dalam Dashboard Streamlit (`app.py`)** menggunakan prediksi *baseline*.
- Setelah kalian selesai melatih model **LSTM** (untuk memprediksi probabilitas permintaan suatu skill dalam 1-2 tahun ke depan), harap sediakan *fungsi prediksi* atau *endpoint API* untuk menggantikan fungsi `Simulasi data tren historis` di Tab 3 tersebut.
- Format yang diharapkan Dashboard: *Array/DataFrame* dengan *growth projection* per kategori *skill* per kuartal.

Semangat! Jangan ragu menghubungi kami (Arvin & Ridho) jika ada pertanyaan terkait data mentahnya.
