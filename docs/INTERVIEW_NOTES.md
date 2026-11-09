# Catatan untuk technical interview

## Jika ditanya kenapa tidak pakai microservices

> Karena scope tugas adalah frontend React, API autentikasi sudah disediakan
> DummyJSON, dan penyimpanan task ditentukan menggunakan localStorage. Saya
> menggunakan pemisahan berbasis fitur agar komponen UI, business logic,
> HTTP integration, dan persistence tidak bercampur. Ketika backend nyata
> dibutuhkan, saya bisa mengganti repository tanpa menulis ulang seluruh UI.

## Jika ditanya state management

> Saya menggunakan React Context untuk menyampaikan auth state dan task state
> ke komponen yang membutuhkannya. Custom hook `useLocalTasks` mengelola CRUD
> dan sinkronisasi localStorage. Logika pemindahan dan filter saya buat sebagai
> pure function sehingga bisa dites tanpa browser.

## Jika ditanya drag-and-drop

> Board memakai dnd-kit. `useKanbanDrag` mengatur sensor pointer dan keyboard.
> Saat drop, saya panggil `moveTask` untuk mengganti status dan mengatur ulang
> urutan task. Perubahan state langsung tersimpan, sehingga tetap ada saat
> browser di-refresh.

## Jika ditanya Axios interceptor

> Semua request API melewati Axios instance. Request interceptor menambahkan
> access token, sedangkan response interceptor menangani HTTP 401 dan mencoba
> refresh token sekali. Jika refresh gagal, sesi dibersihkan. Tampilannya
> juga membedakan error login, masalah jaringan, dan server error.

## Jika ditanya tradeoff / limitation

> localStorage hanya tersedia di browser yang sama, bukan untuk kolaborasi
> real-time. Penyimpanan access token di localStorage merupakan kompromi
> terhadap kebutuhan tes; untuk aplikasi produksi saya akan mempertimbangkan
> sesi httpOnly secure cookies. Setelah siap backend, saya akan menambahkan
> server-side access control, integration tests, dan query caching.

Sebelum interview, benar-benar jalankan project, buat/edit/drag/delete task
sendiri, dan pahami fungsi-fungsi inti. Jangan mengklaim sudah melakukan
E2E test jika belum dijalankan pada browser lokal.
