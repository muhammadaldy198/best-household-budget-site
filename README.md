# RumahHitung — Anggaran Keluarga Santoso: 96 transaksi, 18 amplop, 14 tagihan, 7 tujuan

[![Household budget site](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Rank](https://make.fun/badge/best-household-budget-site-20261126-1457/muhammadaldy198/best-household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Reward](https://make.fun/badge/best-household-budget-site-20261126-1457/muhammadaldy198/best-household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

Situs anggaran rumah tangga yang bekerja penuh, untuk Keluarga Santoso
(November 2026): pemasukan Rp 9.750.000/bulan, 96 transaksi, 18 amplop
anggaran, 14 tagihan, 7 tujuan tabungan, 3 utang, kalkulator 50/30/20,
dan laporan 6 bulan. Semua angka dihitung ulang dari transaksi setiap
kali halaman dibuka — tidak ada total yang disimpan, jadi dasbor,
anggaran, dan laporan tidak mungkin berbeda.

## Yang bisa dilakukan situs ini

- **Dasbor** — Siap Dibagikan Rp 770.900, Aman Dibelanjakan Rp 666.900,
  donat pembagian pengeluaran, peringatan amplop yang lewat anggaran
  (Makan di Luar +Rp 299.000, Jajan & Kopi +Rp 17.000), 2 tagihan belum
  dibayar, 5 amplop terbesar.
- **Anggaran** — 18 amplop (8 kebutuhan, 6 keinginan, 4 tabungan & utang)
  dengan dianggarkan / terpakai / sisa / bilah persen; **pindah uang antar
  amplop benar-benar mengubah anggaran**.
- **Transaksi** — 96 transaksi dengan cari + filter per amplop; **tambah
  transaksi baru** (angka dasbor dan anggaran ikut berubah); unduh CSV.
- **Tagihan** — 14 tagihan + anggaran gajian 1 Desember (tagihan 1–15 Des
  Rp 4.502.000, sisa Rp 5.248.000); **tandai lunas benar-benar mengubah
  "Aman Dibelanjakan"**.
- **Tujuan & Utang** — 7 tujuan dengan cincin progres + bulan menuju
  tercapai; 3 utang (Rp 16.200.000) dengan **simulasi snowball lawan
  avalanche bulan demi bulan** — avalanche hemat bunga dibanding snowball.
- **Kalkulator 50/30/20** — ubah pemasukan dan pembagian persen, target
  dan perbandingan dengan anggaran nyata ikut berubah; plus panduan
  klasifikasi kebutuhan lawan keinginan yang benar.
- **Laporan** — batang pemasukan lawan pengeluaran 6 bulan, garis tren
  tabungan, 5 amplop terbesar, dan kesimpulan (November paling boros
  karena makan di luar).
- Data tersimpan di localStorage peramban; tombol "Kembalikan data contoh"
  dan "Unduh transaksi (CSV)" ada di kaki halaman. Tanpa jaringan,
  tanpa akun, tanpa framework — vanilla JS + SVG yang digambar tangan.

## Menjalankan

```sh
node serve.ts            # http://localhost:8080, menyajikan app/
```

Buka `app/index.html` langsung di peramban juga bisa. Penyerahan ke
make.fun: `node main.ts` menyalin `app/` + `screenshots/` dan menulis
`dossier.json` (lihat `main.ts`).

## Struktur

- `app/index.html` — kerangka + navigasi 7 halaman (hash route)
- `app/style.css` — identitas buku kas: kertas hangat, tinta hijau ledger
- `app/data.js` — data contoh Keluarga Santoso (satu sumber kebenaran)
- `app/state.js` — muat/simpan localStorage, semua hitungan turunan,
  aksi pengguna, simulasi pelunasan utang, ekspor CSV
- `app/charts.js` — donat, cincin, batang, dan garis SVG
- `app/views.js` — 7 halaman
- `app/main.js` — router + pengikat aksi
- `main.ts` — program penyerahan (menyalin + `buildDossier`)
- `vendor/makefun-frontend.ts` — salinan kit, tanpa diubah
- `screenshots/` — 4 render nyata (dasbor, anggaran, tagihan, HP)

## Lisensi

MIT — lihat `LICENSE`.
