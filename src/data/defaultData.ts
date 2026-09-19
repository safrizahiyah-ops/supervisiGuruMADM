import { Indicator, MadrasahIdentity, Teacher, Subject, SchoolClass, UserAccount, AppSettings, Supervision } from '../types/supervisi';

export const DEFAULT_LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="46" fill="%23064e3b" stroke="%23f59e0b" stroke-width="4"/><circle cx="50" cy="50" r="38" fill="none" stroke="%23ffffff" stroke-width="1.5" stroke-dasharray="3,2"/><path d="M50 20 L58 35 L75 38 L62 50 L66 67 L50 58 L34 67 L38 50 L25 38 L42 35 Z" fill="%23f59e0b" opacity="0.3"/><path d="M30 65 Q50 55 70 65 L70 48 Q50 38 30 48 Z" fill="%23ffffff"/><path d="M50 40 L50 63" stroke="%23064e3b" stroke-width="2"/><path d="M42 32 C42 27 58 27 58 32 C58 36 50 38 50 38 C50 38 42 36 42 32 Z" fill="%23f59e0b"/><circle cx="50" cy="27" r="3" fill="%23ffffff"/><text x="50" y="80" font-family="serif" font-size="8" font-weight="bold" fill="%23ffffff" text-anchor="middle" letter-spacing="1">MA DARUL MAHFUDZ</text><text x="50" y="88" font-family="sans-serif" font-size="5" fill="%23fbbf24" text-anchor="middle">LEKOPADIS - SULBAR</text></svg>`;

export const DEFAULT_MADRASAH: MadrasahIdentity = {
  namaMadrasah: "MA DARUL MAHFUDZ",
  namaYayasan: "PONDOK PESANTREN DARUL MAHFUDZ",
  alamat: "Jl. Poros Majene - Mamuju KM 42, Lekopadis",
  desaKelurahan: "Lekopadis",
  kecamatan: "Tinambung",
  kabupaten: "Polewali Mandar",
  provinsi: "Sulawesi Barat",
  nsm: "131276040012",
  npsn: "69985671",
  telepon: "0812-4244-8901",
  email: "madarulmahfudz.leko@gmail.com",
  website: "www.darulmahfudz.sch.id",
  namaKepalaMadrasah: "Muhammad Safri Abdullah, S.Pd.I., M.Pd.",
  nipKepalaMadrasah: "197804122005011004",
  logoUrl: DEFAULT_LOGO_SVG,
};

export const DEFAULT_SETTINGS: AppSettings = {
  evaluationModeDefault: "DOKUMEN_ASLI",
  documentNumberPrefix: "SUP/AMD",
  currentTahunPelajaran: "2026/2027",
  currentSemester: "Ganjil",
  useWatermarkInDocx: false,
};

export const DEFAULT_USERS: UserAccount[] = [
  {
    id: "usr-admin",
    username: "admin",
    password: "admin123",
    name: "Administrator Madrasah",
    role: "ADMIN",
    roleLabel: "Administrator Sistem",
    email: "admin@darulmahfudz.sch.id",
    jabatan: "Pengelola Sistem Informasi Madrasah",
    description: "Memiliki hak akses penuh ke seluruh modul, master guru (impor/ekspor Excel), ganti logo madrasah, dan pengaturan sistem.",
  },
  {
    id: "usr-kurikulum",
    username: "kurikulum",
    password: "kurikulum123",
    name: "Ust. H. Syamsuddin, S.Ag., M.Pd.I.",
    role: "WAKA_KURIKULUM",
    roleLabel: "Waka Kurikulum Madrasah",
    email: "kurikulum@darulmahfudz.sch.id",
    nip: "197508152003121002",
    jabatan: "Wakil Kepala Madrasah Bidang Kurikulum",
    description: "Khusus memantau evaluasi KBM, tindak lanjut supervisi, analisis 38 indikator, rekapitulasi nilai, dan laporan semester.",
  },
  {
    id: "usr-supervisi",
    username: "supervisi",
    password: "supervisi123",
    name: "Ust. Ahmad Fauzi, S.Pd.I.",
    role: "TIM_SUPERVISI",
    roleLabel: "Tim Supervisi Pembelajaran",
    email: "supervisi@darulmahfudz.sch.id",
    nip: "198306152009021003",
    jabatan: "Koordinator Tim Supervisi Akademik",
    description: "Khusus melaksanakan supervisi pembelajaran: formulir penilaian 38 indikator, tanda tangan digital, cetak A4, dan ekspor Word.",
  },
];

export const DEFAULT_TEACHERS: Teacher[] = [
  {
    id: "tch-001",
    nama: "Hj. Nurhaedah, S.Pd., M.Pd.",
    nip: "198205102008012015",
    nuptk: "3442760662210032",
    nik: "7604025005820001",
    jenisKelamin: "P",
    tempatLahir: "Polewali",
    tanggalLahir: "1982-05-10",
    pendidikanTerakhir: "S2 Pendidikan Bahasa Indonesia",
    jabatan: "Guru Madya",
    mataPelajaranUtama: "Bahasa Indonesia",
    nomorHp: "0813-4211-9870",
    email: "nurhaedah@gmail.com",
    statusKepegawaian: "PNS",
  },
  {
    id: "tch-002",
    nama: "Ust. Ahmad Fauzi, S.Pd.I.",
    nip: "198306152009021003",
    nuptk: "5639761663200023",
    nik: "7604021506830002",
    jenisKelamin: "L",
    tempatLahir: "Tinambung",
    tanggalLahir: "1983-06-15",
    pendidikanTerakhir: "S1 Pendidikan Bahasa Arab",
    jabatan: "Guru Muda / Koord. Keagamaan",
    mataPelajaranUtama: "Bahasa Arab",
    nomorHp: "0821-9988-1234",
    email: "ahmadfauzi.arab@gmail.com",
    statusKepegawaian: "PNS",
  },
  {
    id: "tch-003",
    nama: "Wahyu Pratama, S.Si.",
    nip: "199408222022211005",
    nuptk: "8745772673130092",
    nik: "7604022208940003",
    jenisKelamin: "L",
    tempatLahir: "Lekopadis",
    tanggalLahir: "1994-08-22",
    pendidikanTerakhir: "S1 Matematika Murni",
    jabatan: "Guru Pertama",
    mataPelajaranUtama: "Matematika",
    nomorHp: "0852-5544-3321",
    email: "wahyu.math@darulmahfudz.sch.id",
    statusKepegawaian: "PPPK",
  },
  {
    id: "tch-004",
    nama: "Siti Rahmawati, S.Pd.",
    nip: "-",
    nuptk: "1234768669230041",
    nik: "7604024403960004",
    jenisKelamin: "P",
    tempatLahir: "Mandar",
    tanggalLahir: "1996-03-04",
    pendidikanTerakhir: "S1 Pendidikan Agama Islam",
    jabatan: "Guru Mata Pelajaran",
    mataPelajaranUtama: "Fikih",
    nomorHp: "0853-9912-7788",
    email: "siti.rahmawati@darulmahfudz.sch.id",
    statusKepegawaian: "GTT / Non-PNS",
  },
  {
    id: "tch-005",
    nama: "Muhammad Ilham, S.Kom.",
    nip: "-",
    nuptk: "9876771672130111",
    nik: "7604021211950005",
    jenisKelamin: "L",
    tempatLahir: "Majene",
    tanggalLahir: "1995-11-12",
    pendidikanTerakhir: "S1 Teknik Informatika",
    jabatan: "Kepala Lab Komputer / Guru",
    mataPelajaranUtama: "Informatika",
    nomorHp: "0812-4455-6677",
    email: "ilham.tik@darulmahfudz.sch.id",
    statusKepegawaian: "Yayasan",
  },
];

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: "sub-01", kode: "QH", nama: "Al-Qur'an Hadis", kelompok: "Agama" },
  { id: "sub-02", kode: "AA", nama: "Akidah Akhlak", kelompok: "Agama" },
  { id: "sub-03", kode: "FIQ", nama: "Fikih", kelompok: "Agama" },
  { id: "sub-04", kode: "SKI", nama: "Sejarah Kebudayaan Islam", kelompok: "Agama" },
  { id: "sub-05", kode: "ARB", nama: "Bahasa Arab", kelompok: "Agama" },
  { id: "sub-06", kode: "IND", nama: "Bahasa Indonesia", kelompok: "Umum" },
  { id: "sub-07", kode: "ENG", nama: "Bahasa Inggris", kelompok: "Umum" },
  { id: "sub-08", kode: "MAT", nama: "Matematika", kelompok: "Umum" },
  { id: "sub-09", kode: "PPN", nama: "Pendidikan Pancasila", kelompok: "Umum" },
  { id: "sub-10", kode: "INF", nama: "Informatika", kelompok: "Umum" },
  { id: "sub-11", kode: "IPA", nama: "IPA (Fisika / Kimia / Biologi)", kelompok: "Peminatan" },
  { id: "sub-12", kode: "IPS", nama: "IPS (Ekonomi / Geografi / Sosiologi)", kelompok: "Peminatan" },
  { id: "sub-13", kode: "PJK", nama: "PJOK", kelompok: "Umum" },
  { id: "sub-14", kode: "SBD", nama: "Seni Budaya", kelompok: "Umum" },
  { id: "sub-15", kode: "MLK", nama: "Muatan Lokal / Keasramaan", kelompok: "Muatan Lokal" },
];

export const DEFAULT_CLASSES: SchoolClass[] = [
  { id: "cls-10a", tingkat: "X", rombel: "X-A (Putra)", waliKelas: "Wahyu Pratama, S.Si." },
  { id: "cls-10b", tingkat: "X", rombel: "X-B (Putri)", waliKelas: "Hj. Nurhaedah, S.Pd., M.Pd." },
  { id: "cls-11a", tingkat: "XI", rombel: "XI-A (Fase F - MIPA)", waliKelas: "Muhammad Ilham, S.Kom." },
  { id: "cls-11b", tingkat: "XI", rombel: "XI-B (Fase F - IPS/Agama)", waliKelas: "Ust. Ahmad Fauzi, S.Pd.I." },
  { id: "cls-12a", tingkat: "XII", rombel: "XII-A", waliKelas: "Siti Rahmawati, S.Pd." },
  { id: "cls-12b", tingkat: "XII", rombel: "XII-B", waliKelas: "Ust. Ahmad Fauzi, S.Pd.I." },
];

export const DEFAULT_INDICATORS: Indicator[] = [
  // A. KEGIATAN PENDAHULUAN (Indikator 1 - 7)
  {
    id: 1,
    section: "A",
    sectionTitle: "A. KEGIATAN PENDAHULUAN",
    number: 1,
    aspekYangDiamati: "Guru menyiapkan peserta didik secara psikis dan fisik untuk mengikuti proses pembelajaran (menyapa santun, berdoa bersama, memeriksa kehadiran, dan kesiapan ruang kelas).",
  },
  {
    id: 2,
    section: "A",
    sectionTitle: "A. KEGIATAN PENDAHULUAN",
    number: 2,
    aspekYangDiamati: "Guru memberi motivasi belajar peserta didik secara kontekstual sesuai dengan manfaat dan aplikasi materi ajar dalam kehidupan nyata sehari-hari.",
  },
  {
    id: 3,
    section: "A",
    sectionTitle: "A. KEGIATAN PENDAHULUAN",
    number: 3,
    aspekYangDiamati: "Guru mengajukan pertanyaan pemantik (apersepsi) yang mengaitkan pengetahuan atau pengalaman sebelumnya dengan materi yang akan dipelajari.",
  },
  {
    id: 4,
    section: "A",
    sectionTitle: "A. KEGIATAN PENDAHULUAN",
    number: 4,
    aspekYangDiamati: "Guru menyampaikan tujuan pembelajaran atau Capaian Pembelajaran (CP) dan Alur Tujuan Pembelajaran (ATP) serta kriteria ketercapaian yang akan dicapai.",
  },
  {
    id: 5,
    section: "A",
    sectionTitle: "A. KEGIATAN PENDAHULUAN",
    number: 5,
    aspekYangDiamati: "Guru menyampaikan garis besar cakupan materi dan skenario langkah-langkah kegiatan pembelajaran yang akan dilaksanakan.",
  },
  {
    id: 6,
    section: "A",
    sectionTitle: "A. KEGIATAN PENDAHULUAN",
    number: 6,
    aspekYangDiamati: "Guru menginformasikan lingkup, teknik, dan instrumen asesmen/penilaian yang akan digunakan selama proses pembelajaran.",
  },
  {
    id: 7,
    section: "A",
    sectionTitle: "A. KEGIATAN PENDAHULUAN",
    number: 7,
    aspekYangDiamati: "Guru mengintegrasikan pembiasaan karakter luhur Profil Pelajar Pancasila dan Profil Pelajar Rahmatan Lil Alamin (P5-PPRA) sejak pembukaan pembelajaran.",
  },

  // B. KEGIATAN INTI (Indikator 8 - 32)
  {
    id: 8,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 8,
    aspekYangDiamati: "Guru memfasilitasi pembelajaran yang berpusat pada peserta didik (Student-Centered Learning) sehingga siswa aktif berpartisipasi.",
  },
  {
    id: 9,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 9,
    aspekYangDiamati: "Guru menerapkan prinsip pembelajaran berdiferensiasi (diferensiasi konten, proses, dan/atau produk) sesuai kesiapan belajar, minat, dan profil peserta didik.",
  },
  {
    id: 10,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 10,
    aspekYangDiamati: "Guru menguasai konsep keilmuan materi pelajaran dan mampu mengaitkannya dengan fenomena nyata dan kearifan lokal secara mendalam.",
  },
  {
    id: 11,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 11,
    aspekYangDiamati: "Guru menyajikan materi pembelajaran secara sistematis, terstruktur, runtut, dan bergradasi dari konsep konkret ke abstrak.",
  },
  {
    id: 12,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 12,
    aspekYangDiamati: "Guru menerapkan model/metode pembelajaran yang bervariasi dan menantang (seperti Problem-Based Learning, Project-Based Learning, Inquiry, Discovery Learning).",
  },
  {
    id: 13,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 13,
    aspekYangDiamati: "Guru memanfaatkan media/alat peraga pembelajaran yang kontekstual, menarik, interaktif, dan relevan dengan tujuan pembelajaran.",
  },
  {
    id: 14,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 14,
    aspekYangDiamati: "Guru memanfaatkan teknologi informasi dan komunikasi (TIK/perangkat digital) secara efektif untuk mendukung eksplorasi belajar siswa.",
  },
  {
    id: 15,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 15,
    aspekYangDiamati: "Guru memfasilitasi kegiatan yang memperkuat kemampuan literasi membaca, memahami teks, dan mengekspresikan gagasan tertulis.",
  },
  {
    id: 16,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 16,
    aspekYangDiamati: "Guru memfasilitasi aktivitas yang memperkuat kecakapan numerasi, penalaran matematis, data, dan berpikir kuantitatif logis.",
  },
  {
    id: 17,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 17,
    aspekYangDiamati: "Guru menumbuhkan interaksi aktif, dialogis, dan kolaboratif antar peserta didik maupun antara peserta didik dengan guru.",
  },
  {
    id: 18,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 18,
    aspekYangDiamati: "Guru memicu keterampilan berpikir kritis (Critical Thinking) dan pemecahan masalah melalui penyelidikan data dan argumentasi bukti.",
  },
  {
    id: 19,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 19,
    aspekYangDiamati: "Guru menumbuhkan daya kreasi, imajinasi positif, dan inovasi peserta didik dalam menghasilkan ide atau karya mandiri.",
  },
  {
    id: 20,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 20,
    aspekYangDiamati: "Guru melatih keterampilan berkomunikasi (Communication) santun, artikulatif, dan percaya diri baik lisan maupun paparan visual.",
  },
  {
    id: 21,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 21,
    aspekYangDiamati: "Guru memandu kerja kelompok kooperatif secara efektif, adil, serta memastikan setiap anggota mengambil peran bermakna.",
  },
  {
    id: 22,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 22,
    aspekYangDiamati: "Guru memberikan pertanyaan pelacak/penuntun tingkat tinggi (Higher Order Thinking Skills - HOTS) untuk mendalami substansi pemahaman.",
  },
  {
    id: 23,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 23,
    aspekYangDiamati: "Guru memberikan perhatian adaptif, pendampingan proporsional, dan perancah (scaffolding) bagi murid yang mengalami kesulitan belajar.",
  },
  {
    id: 24,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 24,
    aspekYangDiamati: "Guru merespons pertanyaan, hipotesis, dan respon peserta didik secara positif, menghargai usaha, dan mencerahkan kebingungan.",
  },
  {
    id: 25,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 25,
    aspekYangDiamati: "Guru mengelola alokasi waktu pada setiap tahapan kegiatan inti secara disiplin, proporsional, dan tepat sasaran.",
  },
  {
    id: 26,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 26,
    aspekYangDiamati: "Guru menciptakan lingkungan belajar yang aman, tertib, nyaman, inklusif, menghargai keberagaman, dan bebas dari intimidasi/perundungan.",
  },
  {
    id: 27,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 27,
    aspekYangDiamati: "Guru menunjukkan antusiasme, keteladanan akhlak, wibawa pendidik, dan bahasa tubuh yang ramah serta menyemangati belajar murid.",
  },
  {
    id: 28,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 28,
    aspekYangDiamati: "Guru melaksanakan asesmen formatif berkelanjutan selama kegiatan inti untuk mendiagnosis pemahaman dan progres belajar siswa.",
  },
  {
    id: 29,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 29,
    aspekYangDiamati: "Guru memberikan umpan balik (constructive feedback) secara langsung, spesifik, dan membimbing penyempurnaan karya siswa.",
  },
  {
    id: 30,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 30,
    aspekYangDiamati: "Guru memanfaatkan Lembar Kerja Peserta Didik (LKPD) atau lembar panduan tugas yang kontekstual, jelas petunjuknya, dan memicu nalar.",
  },
  {
    id: 31,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 31,
    aspekYangDiamati: "Guru menginternalisasi nilai-nilai keislaman, adab thalabul ilmi, tasamuh (toleransi), dan moderasi beragama selama dinamika kelas.",
  },
  {
    id: 32,
    section: "B",
    sectionTitle: "B. KEGIATAN INTI",
    number: 32,
    aspekYangDiamati: "Guru memfasilitasi presentasi karya/unjuk kerja peserta didik dan membimbing apresiasi objektif sesama teman (peer assessment).",
  },

  // C. KEGIATAN PENUTUP (Indikator 33 - 38)
  {
    id: 33,
    section: "C",
    sectionTitle: "C. KEGIATAN PENUTUP",
    number: 33,
    aspekYangDiamati: "Guru bersama-sama peserta didik merumuskan simpulan atau rangkuman butir-butir esensial dari materi yang baru dipelajari.",
  },
  {
    id: 34,
    section: "C",
    sectionTitle: "C. KEGIATAN PENUTUP",
    number: 34,
    aspekYangDiamati: "Guru memfasilitasi refleksi menyeluruh terhadap pengalaman belajar, tantangan yang dihadapi, serta manfaat yang dirasakan murid.",
  },
  {
    id: 35,
    section: "C",
    sectionTitle: "C. KEGIATAN PENUTUP",
    number: 35,
    aspekYangDiamati: "Guru melaksanakan asesmen penutup (exit ticket/post-test/kuis singkat) untuk mengukur ketercapaian tujuan pembelajaran pertemuan ini.",
  },
  {
    id: 36,
    section: "C",
    sectionTitle: "C. KEGIATAN PENUTUP",
    number: 36,
    aspekYangDiamati: "Guru memberikan apresiasi dan penghargaan tulus kepada individu maupun kelompok atas partisipasi, keaktifan, dan pencapaiannya.",
  },
  {
    id: 37,
    section: "C",
    sectionTitle: "C. KEGIATAN PENUTUP",
    number: 37,
    aspekYangDiamati: "Guru menyampaikan rencana tindak lanjut kegiatan pembelajaran (program pengayaan untuk yang tuntas, remedial, atau penugasan terstruktur).",
  },
  {
    id: 38,
    section: "C",
    sectionTitle: "C. KEGIATAN PENUTUP",
    number: 38,
    aspekYangDiamati: "Guru menginformasikan rencana topik/kegiatan belajar untuk pertemuan berikutnya dan menutup proses KBM dengan doa bersama dan salam.",
  },
];

// Helper to generate realistic sample evaluation
export function generateSamplePenilaian(scoreProfile: 'high' | 'medium' | 'good'): Record<number, { indicatorId: number; score: 0 | 1 | 2; catatan: string }> {
  const map: Record<number, { indicatorId: number; score: 0 | 1 | 2; catatan: string }> = {};
  
  DEFAULT_INDICATORS.forEach((ind) => {
    let sc: 0 | 1 | 2 = 0;
    let note = "Sudah terlaksana dengan baik dan sesuai indikator.";
    
    if (scoreProfile === 'high') {
      // 36 score 0, 2 score 1
      if (ind.id === 9 || ind.id === 16) {
        sc = 1;
        note = ind.id === 9 ? "Diferensiasi proses masih perlu diperkaya untuk kelompok siswa lambat belajar." : "Integrasi numerasi masih bisa dieksplorasi lebih mendalam.";
      }
    } else if (scoreProfile === 'good') {
      // mostly 0, few 1, one 2
      if (ind.id === 9 || ind.id === 14 || ind.id === 22 || ind.id === 28 || ind.id === 35) {
        sc = 1;
        note = "Perlu penguatan langkah teknis dan konsistensi waktu.";
      } else if (ind.id === 16) {
        sc = 2;
        note = "Aspek numerasi belum tampak diterapkan pada sesi materi ini.";
      }
    } else {
      // medium
      if ([9, 13, 14, 16, 22, 28, 30, 35].includes(ind.id)) {
        sc = 1;
        note = "Instrumen dan perancah belajar perlu disiapkan lebih matang.";
      } else if ([19, 29].includes(ind.id)) {
        sc = 2;
        note = "Belum terlihat optimal dalam pembagian waktu kegiatan.";
      }
    }
    
    map[ind.id] = {
      indicatorId: ind.id,
      score: sc,
      catatan: note,
    };
  });
  
  return map;
}

export function computeSupervisionMetrics(penilaian: Record<number, { indicatorId: number; score: 0 | 1 | 2; catatan: string }>, mode: 'DOKUMEN_ASLI' | 'SKOR_KUALITAS' = 'DOKUMEN_ASLI') {
  let count0 = 0;
  let count1 = 0;
  let count2 = 0;
  let totalPerolehan = 0;
  const skorMaksimal = 76; // 38 * 2

  DEFAULT_INDICATORS.forEach((ind) => {
    const item = penilaian[ind.id];
    const sc = item ? item.score : 0;
    if (sc === 0) {
      count0++;
      totalPerolehan += 2;
    } else if (sc === 1) {
      count1++;
      totalPerolehan += 1;
    } else {
      count2++;
      totalPerolehan += 0;
    }
  });

  let nilaiAkhir = 0;
  if (mode === 'DOKUMEN_ASLI') {
    nilaiAkhir = Number(((totalPerolehan / skorMaksimal) * 100).toFixed(2));
  } else {
    // Mode 2: 0 -> 100, 1 -> 50, 2 -> 0 average
    const totalPoints = (count0 * 100) + (count1 * 50) + (count2 * 0);
    nilaiAkhir = Number((totalPoints / 38).toFixed(2));
  }

  let kategori: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang' = 'Kurang';
  if (nilaiAkhir >= 91) kategori = 'Sangat Baik';
  else if (nilaiAkhir >= 81) kategori = 'Baik';
  else if (nilaiAkhir >= 71) kategori = 'Cukup';
  else kategori = 'Kurang';

  // Build automatic analysis
  const aspekBaik: string[] = [];
  const aspekPerluDitingkatkan: string[] = [];
  const rekomendasi: string[] = [];

  DEFAULT_INDICATORS.forEach((ind) => {
    const item = penilaian[ind.id];
    if (item && item.score === 0) {
      if (aspekBaik.length < 5) {
        aspekBaik.push(`Indikator ${ind.number} (${ind.sectionTitle}): ${ind.aspekYangDiamati.substring(0, 80)}...`);
      }
    } else if (item && (item.score === 1 || item.score === 2)) {
      aspekPerluDitingkatkan.push(`Indikator ${ind.number} (${item.score === 1 ? 'Kurang Lengkap' : 'Belum Nampak'}): ${ind.aspekYangDiamati}`);
      if (ind.id === 9) {
        rekomendasi.push("Mengoptimalkan variasi diferensiasi proses dan lembar scaffolding belajar murid.");
      } else if (ind.id === 14) {
        rekomendasi.push("Memanfaatkan aplikasi pembelajaran interaktif berbasis TIK/digital (seperti Quizizz/Canva/PPT Interaktif).");
      } else if (ind.id === 22) {
        rekomendasi.push("Memperbanyak pertanyaan pemantik pelacak (HOTS) tingkat analisis dan evaluasi.");
      } else if (ind.id === 28 || ind.id === 35) {
        rekomendasi.push("Menyiapkan instrumen asesmen formatif singkat (misal exit ticket) di akhir setiap bab/pertemuan.");
      }
    }
  });

  if (rekomendasi.length === 0) {
    rekomendasi.push("Pertahankan dan imbaskan praktik baik pembelajaran berpusat pada murid kepada rekan guru serumpun.");
  }

  return {
    countScore0: count0,
    countScore1: count1,
    countScore2: count2,
    totalSkorPerolehan: totalPerolehan,
    skorMaksimal,
    nilaiAkhir,
    kategori,
    analisis: {
      aspekSudahBaik: aspekBaik,
      aspekPerluDitingkatkan: aspekPerluDitingkatkan,
      rekomendasi: rekomendasi,
    }
  };
}

// Sample supervisions to populate the app initially
const p1 = generateSamplePenilaian('high');
const m1 = computeSupervisionMetrics(p1, 'DOKUMEN_ASLI');

const p2 = generateSamplePenilaian('good');
const m2 = computeSupervisionMetrics(p2, 'DOKUMEN_ASLI');

const p3 = generateSamplePenilaian('medium');
const m3 = computeSupervisionMetrics(p3, 'DOKUMEN_ASLI');

export const DEFAULT_SUPERVISIONS: Supervision[] = [
  {
    id: "sup-001",
    nomorDokumen: "SUP/AMD/001/VIII/2026",
    tanggalSupervisi: "2026-08-14",
    semester: "Ganjil",
    tahunPelajaran: "2026/2027",
    guruId: "tch-001",
    namaGuru: "Hj. Nurhaedah, S.Pd., M.Pd.",
    nipGuru: "198205102008012015",
    mataPelajaran: "Bahasa Indonesia",
    kelas: "X-B (Putri)",
    jamPelajaran: "1-3 (07.30 - 09.30 WITA)",
    materiTopik: "Teks Laporan Hasil Observasi (LHO) Berbasis Kearifan Lokal Mandar",
    namaSupervisor: "Muhammad Safri Abdullah, S.Pd.I., M.Pd.",
    nipSupervisor: "197804122005011004",
    jenisSupervisi: "Supervisi Akademik",
    penilaian: p1,
    evaluationMode: "DOKUMEN_ASLI",
    countScore0: m1.countScore0,
    countScore1: m1.countScore1,
    countScore2: m1.countScore2,
    totalSkorPerolehan: m1.totalSkorPerolehan,
    skorMaksimal: m1.skorMaksimal,
    nilaiAkhir: m1.nilaiAkhir,
    kategori: m1.kategori,
    catatanHasilSupervisi: "Pelaksanaan pembelajaran berlangsung sangat interaktif dan menyenangkan. Penguasaan kelas dan retorika guru sangat menginspirasi santriwati.",
    kelebihanGuru: "Kemampuan apersepsi kontekstual budaya lokal Mandar sangat kuat, instruksi tugas jelas, dan manajemen waktu pembelajaran tertata rapi.",
    halPerluDitingkatkan: "Perlu menambahkan penguatan diferensiasi proses belajar pada kelompok murid yang membutuhkan bimbingan bertahap.",
    rekomendasi: "Disarankan berbagi praktik baik pembelajaran kontekstual berbasis kearifan lokal pada kegiatan MGMP madrasah.",
    analisis: m1.analisis,
    tindakLanjut: {
      options: ["Berbagi praktik baik", "Pendampingan pembelajaran"],
      targetDate: "2026-09-05",
      pic: "Muhammad Safri Abdullah (Kepala Madrasah)",
      status: "Selesai",
      notes: "Telah diagendakan berbagi modul ajar berdiferensiasi pada rapat kerja kurikulum.",
      completionDate: "2026-09-04",
      resolutionNotes: "Guru telah menyajikan best practice penyusunan LKPD berdiferensiasi di hadapan dewan guru.",
    },
    signature: {
      useDigitalSignature: true,
      supervisorName: "Muhammad Safri Abdullah, S.Pd.I., M.Pd.",
      supervisorNip: "197804122005011004",
      teacherName: "Hj. Nurhaedah, S.Pd., M.Pd.",
      teacherNip: "198205102008012015",
      supervisorSignDate: "2026-08-14",
      teacherSignDate: "2026-08-14",
    },
    status: "FINAL",
    approvedByKamad: true,
    approvalDate: "2026-08-14",
    createdAt: "2026-08-14T09:40:00Z",
    updatedAt: "2026-08-14T11:00:00Z",
  },
  {
    id: "sup-002",
    nomorDokumen: "SUP/AMD/002/VIII/2026",
    tanggalSupervisi: "2026-08-22",
    semester: "Ganjil",
    tahunPelajaran: "2026/2027",
    guruId: "tch-002",
    namaGuru: "Ust. Ahmad Fauzi, S.Pd.I.",
    nipGuru: "198306152009021003",
    mataPelajaran: "Bahasa Arab",
    kelas: "XI-B (Fase F - IPS/Agama)",
    jamPelajaran: "3-4 (09.00 - 10.30 WITA)",
    materiTopik: "Tarkib & Muhadatsah: As-Siha wal Ri'ayah al-Tibbiyyah",
    namaSupervisor: "Muhammad Safri Abdullah, S.Pd.I., M.Pd.",
    nipSupervisor: "197804122005011004",
    jenisSupervisi: "Supervisi Pembelajaran",
    penilaian: p2,
    evaluationMode: "DOKUMEN_ASLI",
    countScore0: m2.countScore0,
    countScore1: m2.countScore1,
    countScore2: m2.countScore2,
    totalSkorPerolehan: m2.totalSkorPerolehan,
    skorMaksimal: m2.skorMaksimal,
    nilaiAkhir: m2.nilaiAkhir,
    kategori: m2.kategori,
    catatanHasilSupervisi: "Penyampaian mufradat dan qawa'id jelas, santri dilatih aktif bercakap bahasa Arab berpasangan dengan penuh antusias.",
    kelebihanGuru: "Penguasaan nahwu-sharaf dan fashahah makharijul huruf guru sangat prima, suasana kelas bernuansa pesantren bilingual.",
    halPerluDitingkatkan: "Pemanfaatan media audio visual (listening/istima') digital masih perlu dioptimalkan agar santri terbiasa mendengar penutur asli.",
    rekomendasi: "Manfaatkan smart board/proyektor lab bahasa untuk memutar dialog pendek bahasa Arab autentik.",
    analisis: m2.analisis,
    tindakLanjut: {
      options: ["Pelatihan", "Pendampingan pembelajaran"],
      targetDate: "2026-09-20",
      pic: "Ust. Ahmad Fauzi / Tim Kurikulum",
      status: "Dalam Proses",
      notes: "Akan dilakukan workshop singkat pembuatan media kuis interaktif bahasa Arab.",
    },
    signature: {
      useDigitalSignature: true,
      supervisorName: "Muhammad Safri Abdullah, S.Pd.I., M.Pd.",
      supervisorNip: "197804122005011004",
      teacherName: "Ust. Ahmad Fauzi, S.Pd.I.",
      teacherNip: "198306152009021003",
      supervisorSignDate: "2026-08-22",
      teacherSignDate: "2026-08-22",
    },
    status: "FINAL",
    approvedByKamad: true,
    approvalDate: "2026-08-22",
    createdAt: "2026-08-22T10:15:00Z",
    updatedAt: "2026-08-22T11:20:00Z",
  },
  {
    id: "sup-003",
    nomorDokumen: "SUP/AMD/003/IX/2026",
    tanggalSupervisi: "2026-09-08",
    semester: "Ganjil",
    tahunPelajaran: "2026/2027",
    guruId: "tch-003",
    namaGuru: "Wahyu Pratama, S.Si.",
    nipGuru: "199408222022211005",
    mataPelajaran: "Matematika",
    kelas: "XII-A",
    jamPelajaran: "1-2 (07.30 - 09.00 WITA)",
    materiTopik: "Kaidah Pencacahan, Permutasi, dan Kombinasi pada Pemecahan Masalah",
    namaSupervisor: "Ust. Ahmad Fauzi, S.Pd.I.",
    nipSupervisor: "198306152009021003",
    jenisSupervisi: "Supervisi Akademik",
    penilaian: p3,
    evaluationMode: "DOKUMEN_ASLI",
    countScore0: m3.countScore0,
    countScore1: m3.countScore1,
    countScore2: m3.countScore2,
    totalSkorPerolehan: m3.totalSkorPerolehan,
    skorMaksimal: m3.skorMaksimal,
    nilaiAkhir: m3.nilaiAkhir,
    kategori: m3.kategori,
    catatanHasilSupervisi: "Langkah penyelesaian soal sistematis, penguatan konsep logika kombinatorika cukup runut.",
    kelebihanGuru: "Guru energik, akrab dengan siswa, dan telaten membimbing diskusi kelompok kecil.",
    halPerluDitingkatkan: "Perlu menyiapkan asesmen formatif penutup berbasis lembar kerja mandiri untuk memverifikasi ketuntasan setiap santri sebelum kelas berakhir.",
    rekomendasi: "Menyelenggarakan observasi lanjutan setelah penyusunan instrumen asesmen formatif mandiri disempurnakan.",
    analisis: m3.analisis,
    tindakLanjut: {
      options: ["Pembinaan individu", "Observasi ulang"],
      targetDate: "2026-09-25",
      pic: "Ust. Ahmad Fauzi",
      status: "Belum Dilaksanakan",
      notes: "Diskusi pemantapan instrumen asesmen formatif HOTS bersama pengawas madrasah.",
    },
    signature: {
      useDigitalSignature: true,
      supervisorName: "Ust. Ahmad Fauzi, S.Pd.I.",
      supervisorNip: "198306152009021003",
      teacherName: "Wahyu Pratama, S.Si.",
      teacherNip: "199408222022211005",
      supervisorSignDate: "2026-09-08",
      teacherSignDate: "2026-09-08",
    },
    status: "FINAL",
    approvedByKamad: true,
    approvalDate: "2026-09-09",
    createdAt: "2026-09-08T09:10:00Z",
    updatedAt: "2026-09-08T10:30:00Z",
  }
];
