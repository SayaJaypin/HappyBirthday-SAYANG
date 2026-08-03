# README

## Untuk Zahra - Premium Romantic Birthday Website

Proyek ini adalah website ulang tahun interaktif premium yang dirancang khusus untuk Zahra, mengusung tema **Pinterest Cute Romantic**, **Apple Style**, dan **Luxury Glassmorphism**. 

Website ini dibangun murni menggunakan HTML5, CSS3, dan JavaScript murni tanpa framework, memanfaatkan teknologi web canggih seperti **Three.js** untuk render 3D, **GSAP** untuk animasi transisi mulus, dan **Canvas API** untuk efek partikel interaktif.

### Struktur File
Proyek ini terdiri dari 3 file utama yang saling melengkapi:
1. `index.html` - Kerangka utama website, SVG definitions, dan pemanggilan pustaka CDN eksternal.
2. `style.css` - Desain, responsivitas, sistem warna CSS Variables, dan efek Glassmorphism.
3. `script.js` - Logika interaktif penuh (Sistem PIN, 3D Engine, Particle Engine, Audio, dan GSAP Scroll).

### Fitur Utama:
- **Lock Screen Premium:** Dilengkapi keamanan PIN (090812) dengan efek getaran (Haptic Feedback) jika salah.
- **Three.js 3D Engine:** Terdapat animasi kue 3D saat proses *loading*, serta dekorasi Kucing dan Kelinci bergaya *glassmorphism* di latar belakang halaman utama.
- **Sistem Partikel Interaktif:** Termasuk efek kembang api di halaman pembuka dan sistem *Make a Wish* di mana teks diubah menjadi partikel bintang yang terbang.
- **Apple Style Carousel Gallery:** Galeri foto dan video mulus tanpa ruang kosong dengan dukungan *scroll-snap*.
- **Floating Music Player & Realtime Clock:** Pemutar musik ambien dengan *equalizer* animasi CSS dan jam dunia *realtime* (WIB, WITA, WIT, UTC).
- **SVG Animation:** Animasi jalur (*path animation*) membentuk hati sebagai syarat untuk membuka hadiah rahasia.

### Cara Menjalankan:
1. Letakkan `index.html`, `style.css`, dan `script.js` di dalam satu folder yang sama.
2. Buka file `index.html` menggunakan browser modern (Google Chrome, Safari, atau Firefox disarankan).
3. **Penting:** Pastikan perangkat terkoneksi internet saat pertama kali dibuka karena *library* (Three.js & GSAP) beserta aset gambar/video ditarik melalui CDN publik untuk meminimalisasi ukuran file.
4. Masukkan PIN **090812** untuk memulai pengalaman.

### Catatan Kustomisasi (Opsional):
Jika ingin mengubah musik latar, Anda dapat memodifikasi tautan pada tag `<audio id="bg-music" src="...">` di dalam file `index.html`. Desain gambar hadiah rahasia juga dapat diganti pada bagian ID `#gift-content`.
