import { GlossaryItem } from '../types/game';

export const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    id: 'algoritma',
    term: 'Algoritma',
    englishTerm: 'Algorithm',
    category: 'Dasar',
    targetAudience: 'both',
    definition: 'Urutan langkah-langkah logis, teratur, dan sistematis untuk menyelesaikan suatu masalah atau mencapai tujuan tertentu.',
    analogy: 'Seperti resep membuat mi instan: 1) Rebus air, 2) Masukkan mi, 3) Siapkan bumbu di mangkuk, 4) Tiriskan dan campur.',
    codeExample: `// Algoritma membuat kopi:
function buatKopi() {
  masakAir();
  tuangKopi();
  aduk();
}`,
  },
  {
    id: 'variabel',
    term: 'Variabel',
    englishTerm: 'Variable',
    category: 'Dasar',
    targetAudience: 'both',
    definition: 'Wadah atau tempat di memori komputer untuk menyimpan data/informasi yang nilainya dapat berubah-ubah saat program berjalan.',
    analogy: 'Seperti kotak kardus berlabel nama: kita bisa menulis "skor" di luarnya, lalu memasukkan kartu angka ke dalamnya.',
    codeExample: `let skorPemain = 100;
skorPemain = skorPemain + 50; // sekarang 150`,
  },
  {
    id: 'perulangan',
    term: 'Perulangan (Loop)',
    englishTerm: 'Loop (For / While)',
    category: 'Struktur Kontrol',
    targetAudience: 'both',
    definition: 'Perintah untuk menjalankan sekumpulan instruksi secara berulang-ulang sampai kondisi tertentu berhenti atau terpenuhi.',
    analogy: 'Seperti menyikat gigi: gosok maju-mundur sebanyak 10 kali tanpa perlu disuruh satu per satu.',
    codeExample: `for (let i = 1; i <= 5; i++) {
  console.log("Langkah ke-" + i);
}`,
  },
  {
    id: 'percabangan',
    term: 'Percabangan (Kondisi)',
    englishTerm: 'Conditional (If / Else)',
    category: 'Struktur Kontrol',
    targetAudience: 'both',
    definition: 'Instruksi untuk membuat keputusan dalam program, menentukan baris kode mana yang akan dijalankan berdasarkan kondisi benar (True) atau salah (False).',
    analogy: 'Jika hujan turun -> bawa payung, jika tidak hujan -> pakai kacamata hitam.',
    codeExample: `if (baterai < 20) {
  aktifkanHematDaya();
} else {
  modeNormal();
}`,
  },
  {
    id: 'fungsi',
    term: 'Fungsi (Function)',
    englishTerm: 'Function / Method',
    category: 'Dasar',
    targetAudience: 'both',
    definition: 'Blok kode mandiri yang dirancang untuk melakukan tugas spesifik, dapat dipanggil berkali-kali dengan memberi input (parameter) dan menerima output (return).',
    analogy: 'Seperti mesin blender: kita masukkan buah dan es (parameter), blender memproses, lalu keluar jus segar (return).',
    codeExample: `function luasPersegi(sisi) {
  return sisi * sisi;
}`,
  },
  {
    id: 'array',
    term: 'Array (Larik)',
    englishTerm: 'Array / List',
    category: 'Struktur Data',
    targetAudience: 'both',
    definition: 'Tipe data terstruktur yang mampu menyimpan sekumpulan nilai sekaligus dalam satu variabel dengan nomor urut indeks mulai dari 0.',
    analogy: 'Seperti loker bernomor di sekolah: loker 0 untuk sepatu, loker 1 untuk tas, loker 2 untuk jaket.',
    codeExample: `let nilaiSiswa = [80, 95, 75, 88];
console.log(nilaiSiswa[0]); // 80 (elemen pertama)`,
  },
  {
    id: 'tipe-data',
    term: 'Tipe Data',
    englishTerm: 'Data Types',
    category: 'Dasar',
    targetAudience: 'both',
    definition: 'Klasifikasi jenis nilai yang dapat disimpan variabel, seperti Angka (Number), Teks (String), Nilai Kebenaran (Boolean), atau Objek (Object).',
    analogy: 'Seperti jenis wadah di dapur: toples cair untuk minyak, botol untuk sirup, wadah kedap untuk biskuit.',
    codeExample: `let nama = "Budi";    // String (Teks)
let umur = 16;         // Number (Angka)
let aktif = true;      // Boolean (Benar/Salah)`,
  },
  {
    id: 'debugging',
    term: 'Debugging',
    englishTerm: 'Bug & Debugging',
    category: 'Paradigma & Tool',
    targetAudience: 'both',
    definition: 'Proses mendeteksi, melacak, dan memperbaiki kesalahan (bug) pada baris kode agar aplikasi berjalan dengan benar tanpa error.',
    analogy: 'Seperti montir yang memeriksa bagian mesin motor yang macet, menemukan kabel longgar, lalu mengencangkannya kembali.',
    codeExample: `// Console log sering digunakan untuk debugging:
console.log("Nilai variabel saat ini:", nilai);`,
  },
  {
    id: 'operator-logika',
    term: 'Operator Logika',
    englishTerm: 'Logical Operators (AND, OR, NOT)',
    category: 'Struktur Kontrol',
    targetAudience: 'smk',
    definition: 'Simbol logika (&& untuk DAN, || untuk ATAU, ! untuk BUKAN) untuk mengevaluasi beberapa kondisi sekaligus.',
    analogy: 'Syarat ikut turnamen: sudah terdaftar (DAN) membawa kartu pelajar.',
    codeExample: `let bolehIkut = terdaftar && punyaKartu;`,
  },
  {
    id: 'object',
    term: 'Object (Objek)',
    englishTerm: 'Object / Dictionary',
    category: 'Struktur Data',
    targetAudience: 'smk',
    definition: 'Kumpulan pasangan kunci dan nilai (key-value pairs) yang merepresentasikan data entitas kompleks dalam satu kesatuan.',
    analogy: 'Seperti KTP: ada nama: "Ahmad", nik: "3201...", pekerjaan: "Pelajar".',
    codeExample: `let siswa = {
  nama: "Siti Rahma",
  jurusan: "RPL",
  angkatan: 2026
};`,
  },
];
