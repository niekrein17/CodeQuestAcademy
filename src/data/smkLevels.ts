import { SmkLevel } from '../types/game';

export const SMK_LEVELS: SmkLevel[] = [
  {
    id: 1,
    title: 'Sistem Kasir Pintar',
    subtitle: 'Variabel, Operator Aritmatika & Percabangan',
    concept: 'Variabel & Kondisi Dasar',
    difficulty: 'Dasar',
    industryContext: 'Aplikasi POS (Point of Sale) Minimarket Modern',
    description: 'Sebagai programmer junior di toko retail, kamu diminta membuat logika kasir otomatis. Toko memberikan diskon 10% jika total belanja mencapai Rp 100.000 atau lebih. Hitung kembalian pelanggan dengan benar.',
    taskGoal: 'Lengkapi fungsi `hitungKasir(totalBelanja, uangDibayar)` agar mengembalikan object: `{ totalAkhir, diskon, kembalian }`.',
    hints: [
      'Cek apakah `totalBelanja >= 100000`. Jika ya, diskon adalah `totalBelanja * 0.1`, jika tidak diskon = 0.',
      'totalAkhir adalah `totalBelanja - diskon`.',
      'kembalian adalah `uangDibayar - totalAkhir`.',
    ],
    initialCode: `// Misi 1: Sistem Kasir Toko Retail
// Lengkapi fungsi di bawah ini:
function hitungKasir(totalBelanja, uangDibayar) {
  let diskon = 0;
  
  // Tulis logika diskon 10% di sini jika totalBelanja >= 100000:
  
  let totalAkhir = totalBelanja - diskon;
  let kembalian = uangDibayar - totalAkhir;
  
  return {
    totalAkhir: totalAkhir,
    diskon: diskon,
    kembalian: kembalian
  };
}`,
    solutionTemplate: `function hitungKasir(totalBelanja, uangDibayar) {
  let diskon = 0;
  if (totalBelanja >= 100000) {
    diskon = totalBelanja * 0.1;
  }
  let totalAkhir = totalBelanja - diskon;
  let kembalian = uangDibayar - totalAkhir;
  return {
    totalAkhir: totalAkhir,
    diskon: diskon,
    kembalian: kembalian
  };
}`,
    functionName: 'hitungKasir',
    testCases: [
      {
        id: 1,
        inputDescription: 'Belanja Rp 50.000, Bayar Rp 100.000 (Tanpa Diskon)',
        inputs: [50000, 100000],
        expectedOutput: { totalAkhir: 50000, diskon: 0, kembalian: 50000 },
        explanation: 'Belanja di bawah 100rb, tidak dapat diskon.',
      },
      {
        id: 2,
        inputDescription: 'Belanja Rp 150.000, Bayar Rp 200.000 (Dapat Diskon 10% = 15.000)',
        inputs: [150000, 200000],
        expectedOutput: { totalAkhir: 135000, diskon: 15000, kembalian: 65000 },
        explanation: 'Total 150rb dapat diskon 15rb. Total bayar 135rb, kembalian 65rb.',
      },
      {
        id: 3,
        inputDescription: 'Belanja pas Rp 100.000, Bayar Rp 100.000 (Diskon 10% = 10.000)',
        inputs: [100000, 100000],
        expectedOutput: { totalAkhir: 90000, diskon: 10000, kembalian: 10000 },
        explanation: 'Batas minimal 100rb terpenuhi, total akhir 90rb, kembalian 10rb.',
      },
    ],
    theory: {
      title: 'Variabel & Percabangan If-Else',
      explanation: 'Variabel (`let`, `const`) digunakan untuk menyimpan data dalam memori program. Struktur `if (kondisi)` memungkinkan program mengambil jalur keputusan berbeda berdasarkan nilai perbandingan (`>=`, `<=`, `===`).',
      exampleCode: `let umur = 17;
if (umur >= 17) {
  console.log("Boleh memiliki SIM");
} else {
  console.log("Belum cukup umur");
}`,
    },
  },
  {
    id: 2,
    title: 'Validasi Akses Keamanan Server',
    subtitle: 'Fungsi, Parameter & Operator Logika Boolean',
    concept: 'Fungsi & Logika Boolean (&&, ||, !)',
    difficulty: 'Menengah',
    industryContext: 'Sistem Keamanan Data Center & Hak Akses Jaringan',
    description: 'Di lingkungan data center SMK Network Security, akses ruangan server dibatasi ketat: \n1. Pengguna berstatus "admin" SELALU boleh masuk jika kartunya aktif.\n2. Pengguna berstatus "teknisi" boleh masuk jika kartunya aktif DAN bukan saat waktu maintenance.\n3. Pengguna selain itu (misal "tamu") DITOLAK (false).',
    taskGoal: 'Buat fungsi `cekHakAkses(role, kartuAktif, sedangMaintenance)` yang mengembalikan nilai boolean (`true` atau `false`).',
    hints: [
      'Jika `!kartuAktif` (kartu mati), maka langsung return `false`.',
      'Jika `role === "admin"`, return `true` (karena kartu sudah dipastikan aktif).',
      'Jika `role === "teknisi"` dan `!sedangMaintenance`, return `true`.',
      'Selain kondisi di atas, kembalikan `false`.',
    ],
    initialCode: `// Misi 2: Security Access Controller
function cekHakAkses(role, kartuAktif, sedangMaintenance) {
  // Jika kartu tidak aktif, akses otomatis ditolak:
  if (!kartuAktif) {
    return false;
  }

  // Tulis logika untuk admin dan teknisi di bawah ini:
  
  return false;
}`,
    solutionTemplate: `function cekHakAkses(role, kartuAktif, sedangMaintenance) {
  if (!kartuAktif) return false;
  if (role === 'admin') return true;
  if (role === 'teknisi' && !sedangMaintenance) return true;
  return false;
}`,
    functionName: 'cekHakAkses',
    testCases: [
      {
        id: 1,
        inputDescription: 'Admin dengan kartu aktif saat maintenance',
        inputs: ['admin', true, true],
        expectedOutput: true,
        explanation: 'Admin berhak masuk kapan saja selama kartu aktif.',
      },
      {
        id: 2,
        inputDescription: 'Teknisi kartu aktif tapi server sedang maintenance',
        inputs: ['teknisi', true, true],
        expectedOutput: false,
        explanation: 'Teknisi dilarang masuk saat sedang maintenance.',
      },
      {
        id: 3,
        inputDescription: 'Teknisi kartu aktif di waktu normal',
        inputs: ['teknisi', true, false],
        expectedOutput: true,
        explanation: 'Teknisi boleh masuk saat operasional normal.',
      },
      {
        id: 4,
        inputDescription: 'Tamu kartu aktif',
        inputs: ['tamu', true, false],
        expectedOutput: false,
        explanation: 'Tamu tidak diizinkan masuk ke server room.',
      },
    ],
    theory: {
      title: 'Operator Logika Boolean (AND, OR, NOT)',
      explanation: 'Operator logika menggabungkan beberapa kondisi: `&&` (DAN) bernilai true jika kedua kondisi benar; `||` (ATAU) bernilai true jika salah satu benar; `!` (TIDAK/NEGASI) membalikkan nilai kebenaran.',
      exampleCode: `let punyaKunci = true;
let alarmAktif = false;
let bolehBuka = punyaKunci && !alarmAktif; // true`,
    },
  },
  {
    id: 3,
    title: 'Filter Sensor Suhu Mesin IoT',
    subtitle: 'Struktur Data Array & Perulangan (For / Filter)',
    concept: 'Array & Iterasi',
    difficulty: 'Menengah',
    industryContext: 'Sistem Telemetri Monitoring Pabrik Otomasi',
    description: 'Sensor IoT pada lini perakitan pabrik mengirimkan deretan rekaman suhu mesin dalam format array angka. Jika suhu melebihi 80°C, mesin terancam overheating! Filter semua suhu kritis tersebut.',
    taskGoal: 'Buat fungsi `filterSuhuKritis(daftarSuhu)` yang menerima array angka dan mengembalikan array baru HANYA berisi nilai suhu yang > 80.',
    hints: [
      'Kamu bisa menggunakan loop `for (let i = 0; i < daftarSuhu.length; i++)` dan `.push()` ke array baru.',
      'Atau gunakan metode array modern JavaScript: `return daftarSuhu.filter(suhu => suhu > 80);`.',
    ],
    initialCode: `// Misi 3: Filter Data Telemetri Pabrik
function filterSuhuKritis(daftarSuhu) {
  let hasil = [];
  
  // Tulis loop atau method filter di sini:
  for (let i = 0; i < daftarSuhu.length; i++) {
    let suhu = daftarSuhu[i];
    // Jika suhu di atas 80, masukkan ke hasil:
  }
  
  return hasil;
}`,
    solutionTemplate: `function filterSuhuKritis(daftarSuhu) {
  return daftarSuhu.filter(s => s > 80);
}`,
    functionName: 'filterSuhuKritis',
    testCases: [
      {
        id: 1,
        inputDescription: 'Suhu campuran: [65, 82, 70, 95, 78, 88]',
        inputs: [[65, 82, 70, 95, 78, 88]],
        expectedOutput: [82, 95, 88],
        explanation: 'Hanya nilai di atas 80 yang dipertahankan.',
      },
      {
        id: 2,
        inputDescription: 'Semua mesin aman: [60, 72, 75, 80]',
        inputs: [[60, 72, 75, 80]],
        expectedOutput: [],
        explanation: '80 pas belum masuk kategori kritis (> 80), hasil array kosong [].',
      },
      {
        id: 3,
        inputDescription: 'Kondisi gawat darurat: [89, 94, 98]',
        inputs: [[89, 94, 98]],
        expectedOutput: [89, 94, 98],
        explanation: 'Semua sensor mendeteksi panas berlebih.',
      },
    ],
    theory: {
      title: 'Array & Pengolahan Kumpulan Data',
      explanation: 'Array adalah wadah terstruktur untuk menyimpan banyak nilai sekaligus dalam satu variabel. Setiap elemen memiliki nomor urut (indeks) dimulai dari 0.',
      exampleCode: `let angka = [10, 25, 30, 45];
console.log(angka[0]); // 10
// Menggunakan filter:
let genap = angka.filter(n => n % 2 === 0); // [10, 30]`,
    },
  },
  {
    id: 4,
    title: 'Pencarian Barcode Produk Gudang',
    subtitle: 'Algoritma Pencarian Linear (Linear Search)',
    concept: 'Algoritma Pencarian & Indeks',
    difficulty: 'Menengah',
    industryContext: 'Sistem Manajemen Gudang & Logistik E-Commerce',
    description: 'Gudang menyimpan barang di rak-rak bernomor indeks 0 sampai n-1. Scanner membaca kode barcode barang dan harus mencari nomor rak barang tersebut. Jika ditemukan, kembalikan nomor raknya. Jika barang tidak ada di gudang, kembalikan nilai -1.',
    taskGoal: 'Implementasikan fungsi `cariRakBarang(daftarBarcode, barcodeDicari)` yang mengembalikan indeks posisi (0-based) atau -1 jika tidak ditemukan.',
    hints: [
      'Gunakan loop `for (let i = 0; i < daftarBarcode.length; i++)`.',
      'Di setiap putaran, bandingkan `daftarBarcode[i] === barcodeDicari`. Jika cocok, langsung `return i;`.',
      'Jika loop selesai tanpa menemukan kecocokan, return -1 di luar loop.',
    ],
    initialCode: `// Misi 4: Algoritma Linear Search Gudang
function cariRakBarang(daftarBarcode, barcodeDicari) {
  // Lakukan pencarian berurutan dari indeks 0:
  for (let i = 0; i < daftarBarcode.length; i++) {
    // Lengkapi pengecekan di sini:
  }

  // Jika tidak ditemukan setelah seluruh rak dicek:
  return -1;
}`,
    solutionTemplate: `function cariRakBarang(daftarBarcode, barcodeDicari) {
  for (let i = 0; i < daftarBarcode.length; i++) {
    if (daftarBarcode[i] === barcodeDicari) {
      return i;
    }
  }
  return -1;
}`,
    functionName: 'cariRakBarang',
    testCases: [
      {
        id: 1,
        inputDescription: 'Cari "BRG-003" pada rak ["BRG-001", "BRG-002", "BRG-003", "BRG-004"]',
        inputs: [['BRG-001', 'BRG-002', 'BRG-003', 'BRG-004'], 'BRG-003'],
        expectedOutput: 2,
        explanation: 'Barang ditemukan pada rak indeks ke-2.',
      },
      {
        id: 2,
        inputDescription: 'Cari barang yang ada di rak pertama "LAPTOP"',
        inputs: [['LAPTOP', 'MOUSE', 'KEYBOARD'], 'LAPTOP'],
        expectedOutput: 0,
        explanation: 'Laptop berada di rak paling awal (indeks 0).',
      },
      {
        id: 3,
        inputDescription: 'Cari "MONITOR" yang tidak ada di rak',
        inputs: [['KABEL', 'CHARGER', 'HEADSET'], 'MONITOR'],
        expectedOutput: -1,
        explanation: 'Barang tidak terdaftar di rak mana pun, return -1.',
      },
    ],
    theory: {
      title: 'Algoritma Pencarian Linear (Linear Search)',
      explanation: 'Linear search adalah algoritma dasar yang memeriksa setiap elemen secara berurutan dari awal sampai akhir daftar. Kompleksitas waktunya adalah O(n) di mana n adalah jumlah item.',
      exampleCode: `let list = ["apel", "jeruk", "mangga"];
function cari(item, query) {
  for (let i = 0; i < item.length; i++) {
    if (item[i] === query) return i;
  }
  return -1;
}`,
    },
  },
  {
    id: 5,
    title: 'Emergency Debugging: Perbaiki Kode Rusak',
    subtitle: 'Membaca Error Log & Memperbaiki Bug Kode',
    concept: 'Code Debugging & Quality Assurance',
    difficulty: 'Debugging',
    industryContext: 'Pemeliharaan Software & Penanganan Crash Sistem',
    description: 'Sistem penghitung bonus gaji karyawan meledak karena programmer magang meninggalkan 3 bug: salah nama variabel (typo), operator perbandingan yang salah (`=` bukan `===`), dan kesalahan tanda kurung. Perbaiki kodenya agar kembali normal!',
    taskGoal: 'Analisis dan betulkan kesalahan sintaks serta logika pada fungsi `hitungBonus(jamKerja, performaScore)` agar lulus semua pengujian unit test.',
    hints: [
      'Perhatikan variabel `bonusPokok`: jangan sampai tertukar penulisan huruf besar/kecil (JavaScript case-sensitive!).',
      'Pada baris pengecekan `performaScore`, gunakan `===` bukan operator penugasan `=`.',
      'Pastikan bonus dihitung berdasarkan rumus: jika performaScore === "A", bonus dikali 1.5, jika "B" dikali 1.2, jika "C" bonus tetap.',
    ],
    initialCode: `// Misi 5: BUGGY CODE! Perbaiki kode di bawah ini:
function hitungBonus(jamKerja, performaScore) {
  let bonuspokok = jamKerja * 10000; // AWAS TYPO nama variabel!

  let pengali = 1.0;
  
  // BUG 1 & 2: Operator perbandingan salah dan salah huruf variabel
  if (performaScore = "A") {
    pengali = 1.5;
  } else if (performaScore = "B") {
    pengali = 1.2;
  }

  // BUG 3: Pengembalian nilai menggunakan variabel yang tidak terdefinisi
  return bonusPokok * pengali;
}`,
    solutionTemplate: `function hitungBonus(jamKerja, performaScore) {
  let bonusPokok = jamKerja * 10000;
  let pengali = 1.0;
  
  if (performaScore === "A") {
    pengali = 1.5;
  } else if (performaScore === "B") {
    pengali = 1.2;
  }

  return bonusPokok * pengali;
}`,
    functionName: 'hitungBonus',
    testCases: [
      {
        id: 1,
        inputDescription: '40 jam kerja, Performa "A"',
        inputs: [40, 'A'],
        expectedOutput: 600000,
        explanation: 'Bonus pokok 40 * 10.000 = 400.000. Pengali 1.5 -> 600.000.',
      },
      {
        id: 2,
        inputDescription: '30 jam kerja, Performa "B"',
        inputs: [30, 'B'],
        expectedOutput: 360000,
        explanation: 'Bonus pokok 300.000 * 1.2 = 360.000.',
      },
      {
        id: 3,
        inputDescription: '20 jam kerja, Performa "C"',
        inputs: [20, 'C'],
        expectedOutput: 200000,
        explanation: 'Bonus pokok 200.000 * 1.0 = 200.000.',
      },
    ],
    theory: {
      title: 'Seni Debugging & Kesalahan Umum Programmer',
      explanation: 'Tiga kategori bug utama: 1) Syntax Error (salah ketik/tanda baca), 2) Runtime Error (mengakses variabel tak dikenal/null), 3) Logic Error (rumus atau operator perbandingan salah seperti menggunakan = untuk membandingkan alih-alih ===).',
      exampleCode: `// ❌ SALAH: if (role = "admin") -> menimpa nilai!
// ✅ BENAR: if (role === "admin") -> membandingkan nilai!`,
    },
  },
  {
    id: 6,
    title: 'Rekapitulasi Mutu & Statistik Data',
    subtitle: 'Algoritma Agregasi Data & Pembuatan Laporan Objek',
    concept: 'Agregasi Data & Struktur Objek',
    difficulty: 'Lanjut',
    industryContext: 'Platform Dashboard Evaluasi Mutu & Analytics',
    description: 'Diberikan array kumpulan nilai ujian siswa SMK `[70, 85, 90, 65, 80]`. Buat algoritma untuk menganalisis data tersebut dan menghasilkan object ringkasan: `{ tertinggi, terendah, rataRata, lulus: boolean }`. Syarat lulus: nilai rataRata >= 75.',
    taskGoal: 'Implementasikan fungsi `rekapNilai(daftarNilai)` dengan pembulatan 1 angka desimal untuk rataRata jika diperlukan.',
    hints: [
      'Gunakan `Math.max(...daftarNilai)` dan `Math.min(...daftarNilai)` untuk nilai tertinggi dan terendah.',
      'Hitung jumlah total nilai dengan loop atau `.reduce()`, lalu bagi dengan `daftarNilai.length` untuk mendapatkan rata-rata.',
      'Gunakan `parseFloat(rataRata.toFixed(1))` untuk membatasi 1 desimal.',
      'Tentukan status `lulus: rataRata >= 75`.',
    ],
    initialCode: `// Misi 6: Agregasi Nilai Ujian Siswa
function rekapNilai(daftarNilai) {
  // Hitung tertinggi dan terendah:
  let tertinggi = Math.max(...daftarNilai);
  let terendah = Math.min(...daftarNilai);
  
  // Hitung rata-rata:
  let total = 0;
  for (let i = 0; i < daftarNilai.length; i++) {
    total += daftarNilai[i];
  }
  let rataRata = parseFloat((total / daftarNilai.length).toFixed(1));
  
  // Tentukan kelulusan (rataRata >= 75):
  let lulus = rataRata >= 75;

  return {
    tertinggi: tertinggi,
    terendah: terendah,
    rataRata: rataRata,
    lulus: lulus
  };
}`,
    solutionTemplate: `function rekapNilai(daftarNilai) {
  let tertinggi = Math.max(...daftarNilai);
  let terendah = Math.min(...daftarNilai);
  let total = daftarNilai.reduce((a, b) => a + b, 0);
  let rataRata = parseFloat((total / daftarNilai.length).toFixed(1));
  return {
    tertinggi,
    terendah,
    rataRata,
    lulus: rataRata >= 75
  };
}`,
    functionName: 'rekapNilai',
    testCases: [
      {
        id: 1,
        inputDescription: 'Nilai: [70, 80, 90, 100]',
        inputs: [[70, 80, 90, 100]],
        expectedOutput: { tertinggi: 100, terendah: 70, rataRata: 85, lulus: true },
        explanation: 'Rata-rata 85 (>= 75), status Lulus.',
      },
      {
        id: 2,
        inputDescription: 'Nilai: [60, 65, 70, 72]',
        inputs: [[60, 65, 70, 72]],
        expectedOutput: { tertinggi: 72, terendah: 60, rataRata: 66.8, lulus: false },
        explanation: 'Rata-rata 66.8 (< 75), status Belum Lulus.',
      },
      {
        id: 3,
        inputDescription: 'Nilai seragam: [75, 75, 75]',
        inputs: [[75, 75, 75]],
        expectedOutput: { tertinggi: 75, terendah: 75, rataRata: 75, lulus: true },
        explanation: 'Rata-rata pas 75, status Lulus.',
      },
    ],
    theory: {
      title: 'Pengolahan Agregat & Objek Hasil Analisis',
      explanation: 'Dalam dunia industri software engineering, pengolahan data mentah (raw arrays) menjadi laporan ringkas berbentuk key-value Object adalah tugas harian yang sangat penting untuk reporting dan dashboard.',
      exampleCode: `let data = [10, 20, 30];
let ringkasan = {
  total: data.reduce((a, b) => a + b, 0),
  jumlahData: data.length
};`,
    },
  },
];
