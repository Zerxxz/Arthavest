# SahamKita — Demo Video Script (2 menit)

**Tujuan**: Untuk submission Sui Overflow Hackathon. Video menampilkan alur lengkap produk, dengan narasi singkat dan visual yang jelas.

**Format**: 120 detik total, 6 scene, shot dari layar browser (1280×720 minimum). Narasi dubbing Indonesia, subtitle English opsional.

**Pacing**: 20 detik per scene average. Cukup waktu untuk jury memahami tanpa boring.

---

## Scene 1 — Hook & Problem (0:00 - 0:15)

**Visual**: 
- Buka dengan frame statis: angka besar "64M UMKM Indonesia · 60% PDB · 87% ditolak bank"
- Slow zoom-in ke angka, lalu crossfade ke screenshot hero SahamKita

**Narasi (Indonesia)**:
> "Enam puluh empat juta UMKM Indonesia menyumbang 60% PDB, tapi 9 dari 10 tidak bisa akses pinjaman bank. Investor retail juga tidak punya jalur investasi kecil ke bisnis lokal. SahamKita mengubah ini — pakai kekuatan unik Sui."

**On-screen text**: "SahamKita · Investasi UMKM Indonesia · Profit mengalir per detik"

---

## Scene 2 — Marketplace Tour (0:15 - 0:35)

**Visual**:
- Browser preview SahamKita sudah ke-load
- Mouse cursor bergerak ke tab "Marketplace", hover salah satu card UMKM (Kopi Senja)
- Klik card → modal detail terbuka, scroll singkat menampilkan grafik performa + buy box
- Highlight badge "KYC Verified", "Walrus: walrus_b1x9af...k3p7", estimasi APY 18.7%

**Narasi**:
> "Marketplace menampilkan UMKM terverifikasi — kopi Senja dari Bandung, catering Bu Tini Jakarta, laundry Surabaya, dan lainnya. Setiap UMKM punya dokumen legal permanen di Walrus storage, dengan blob ID tercatat on-chain. Investor bisa mulai dari satu saham — seratus ribu rupiah."

**On-screen text**: "Walrus immutable storage · KYC verified · Fraksional dari 1 saham"

---

## Scene 3 — Buy Flow + PTB (0:35 - 0:55)

**Visual**:
- Di modal detail Kopi Senja, set "Jumlah saham = 3"
- Klik tombol "Beli 3 saham · Rp 3.0 jt"
- Tampilkan PTB phases berjalan real-time: "Membangun PTB" → "Menandatangani" → "Eksekusi atomik"
- Toast sukses muncul: "Transaksi PTB terkonfirmasi!"

**Narasi**:
> "Beli saham dieksekusi via Programmable Transaction Block — tiga langkah dalam satu transaksi atomik: pay SUI, terima share token, mint receipt NFT. Sub-second finality, gas cuma nol koma nol tiga SUI. Bandingkan dengan Ethereum yang bisa empat sampai dua belas dollar per transaksi."

**On-screen text**: "PTB atomic · ~800ms finality · 0.03 SUI gas (vs $4-12 ETH)"

---

## Scene 4 — Investor Dashboard + Live Stream (0:55 - 1:15)

**Visual**:
- Klik tab "Portfolio"
- Tampilkan dashboard dengan animasi partikel uang mengalir (StreamVisualizer)
- 3 stream aktif, counter "saldo tersedia" update real-time (naik tiap detik)
- Klik tombol "Withdraw" di salah satu stream → toast "Withdraw berhasil!"
- Saldo IDR di header naik

**Narasi**:
> "Profit bulanan UMKM otomatis mengalir ke wallet investor via SuiStream primitive. Setiap detik, saldo accrual bertambah. Investor bisa withdraw kapan saja — atomic, gasless buat first-timer via sponsored transaction. Ini adalah SuiStream: money stream sebagai object Move yang composable."

**On-screen text**: "SuiStream primitive · Live accrual per detik · Withdraw atomic"

---

## Scene 5 — Owner Distribute Profit (1:15 - 1:35)

**Visual**:
- Klik tab "Dashboard UMKM"
- Tampilkan 2 UMKM yang dikelola (Kopi Senja + Bakso Pak Joko)
- Klik "Distribusi Profit Sekarang" di Kopi Senja
- Modal terbuka, tampilkan 3 fase berjalan: "Upload bukti ke Walrus" → "Verifikasi DAO jury" → "PTB bulk create_stream"
- Toast sukses: "152 investor menerima stream · Total Rp 28 jt"

**Narasi**:
> "Dari sisi UMKM owner, distribusi profit ke ratusan investor adalah satu klik. Satu PTB bulk create stream untuk 152 investor — atomic, tidak ada partial failure. DAO jury sudah verifikasi bukti profit di Walrus sebelumnya. Inilah kombinasi Sui features yang tidak mungkin sebersih ini di EVM."

**On-screen text**: "1 PTB · 152 investor · Atomic · Zero manual transfer"

---

## Scene 6 — Bonus Features + Closing (1:35 - 2:00)

**Visual**:
- Quick cut ke tab "Sekunder" — tampilkan DeepBook orderbook dengan sparkline 24h
- Cut ke tab "DAO Jury" — tampilkan antrian profit report, klik tombol thumbs-up approve
- Cut ke tab "Onboard UMKM" — tampilkan 4-step wizard, klik "Submit" dengan PTB preview
- Closeup: Header badge berubah dari "Demo mode" → "Sui Testnet · Live" (jika wallet extension terinstall)
- Final frame: logo SahamKita + tagline + URL preview

**Narasi**:
> "Bonus: pasaran sekunder via DeepBook untuk likuiditas, DAO jury untuk verifikasi profit, dan onboarding UMKM 4-langkah dengan upload Walrus. SahamKita adalah Sui-native — setiap fitur Sui yang dipakai menyelesaikan masalah konkret. Built for Sui Overflow. Terima kasih."

**On-screen text**: "DeepBook · DAO Jury · Walrus · zkLogin · PTB · Object Model — Sui-native end-to-end"

---

## Catatan Produksi

### Equipment & Setup
- **Browser**: Chrome 1280×720, zoom 100%, dark theme disabled (cream background default)
- **Screen recorder**: OBS Studio / Loom / QuickTime — 30fps minimum, 1080p ideal
- **Audio**: Mic condenser atau earbud dengan noise cancellation
- **Cursor**: Highlight cursor (yellow circle) supaya jelas terlihat

### Pre-record Checklist
- [ ] Wallet sudah auto-connect via zkLogin Google (tunggu 1-2 detik setelah load)
- [ ] Semua tab bisa diakses tanpa error
- [ ] Saldo IDR cukup untuk demo beli saham (auto Rp 75 jt)
- [ ] Stream visualizer animasi jalan (partikel mengalir)
- [ ] DAO queue ada 4 item (1 approved, 3 pending)
- [ ] Secondary market ada 5 listing
- [ ] Onboarding form kosong (fresh state)

### Pacing Tips
- Jangan rush — 20 detik per scene cukup
- Pause 0.5 detik setelah klik untuk biarkan animasi selesai
- Highlight mouse movement sebelum klik supaya viewer tahu apa yang akan di-klik
- Untuk PTB phases, biarkan 3-4 detik full untuk tiap phase (building, signing, executing)
- Setelah toast sukses, tahan 1 detik sebelum cut ke scene berikutnya

### Editing
- Cut antar scene harus clean (no fade, snap cut)
- Volume narasi: -3dB, background music (jika ada): -20dB ambient pad
- Subtitle English (opsional): bottom-center, font Inter 18pt, white text dengan black outline
- Watermark "Built for Sui Overflow 2025" di pojok kanan bawah, opacity 30%

### Bilingual Version (opsional)
Untuk jury international, buat 2 versi:
1. **Indonesia version** (primary) — untuk Sui Overflow track Indonesia
2. **English version** — dubbing ulang atau AI voice-over (ElevenLabs Indonesian-English voice)

### Hasil Akhir yang Diharapkan
- Duration: 1:55-2:05 (target 2:00)
- Resolution: 1920×1080 (downscale dari 4K jika perlu)
- Format: MP4 H.264, 8-12 Mbps
- File size: ~50-80 MB

---

## Storyboard Singkat (Quick Reference)

| Time | Scene | Tab | Action Kunci |
|------|-------|-----|--------------|
| 0:00 | Hook | (static) | Stat angka UMKM → crossfade hero |
| 0:15 | Marketplace | Marketplace | Klik Kopi Senja → modal terbuka |
| 0:35 | Buy Flow | Marketplace modal | Set 3 saham → klik Buy → PTB phases |
| 0:55 | Portfolio | Portfolio | Lihat stream live → klik Withdraw |
| 1:15 | Owner | Dashboard UMKM | Klik Distribusi Profit → 3-phase flow |
| 1:35 | Bonus | Sekunder → DAO → Onboard | Quick cut 3 tab |
| 2:00 | Closing | (static) | Logo + tagline + URL |

---

## Submission Notes untuk Jury

Sertakan di deskripsi video:
> SahamKita adalah kombinasi SuiStream primitive + SahamKita marketplace — produk combo yang memanfaatkan 6 Sui-native features: Object-Centric Model, PTB, zkLogin, Sponsored Transactions, Walrus, dan DeepBook. Live demo menunjukkan 5 alur lengkap dari onboarding investor sampai distribusi profit atomik ke 152 investor dalam 1 PTB.
>
> Try the live demo: [preview link]
> Source code + Move contracts: [GitHub link]
> Pitch deck: [PPTX link]
