export type UserRole = 'ADMIN' | 'WAKA_KURIKULUM' | 'TIM_SUPERVISI';

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  email: string;
  nip?: string;
  jabatan?: string;
  avatar?: string;
  description?: string;
}

export interface MadrasahIdentity {
  namaMadrasah: string;
  namaYayasan: string;
  alamat: string;
  desaKelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  nsm: string;
  npsn: string;
  telepon: string;
  email: string;
  website: string;
  namaKepalaMadrasah: string;
  nipKepalaMadrasah: string;
  logoUrl: string;
  akreditasi?: string;
  kodePos?: string;
  tahunPelajaranAktif?: string;
  semesterAktif?: 'Ganjil' | 'Genap';
}

export interface Teacher {
  id: string;
  nama: string;
  nip: string;
  nuptk: string;
  nik: string;
  jenisKelamin: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string;
  pendidikanTerakhir: string;
  jabatan: string;
  mataPelajaranUtama: string;
  nomorHp: string;
  email: string;
  statusKepegawaian: 'PNS' | 'PPPK' | 'GTT / Non-PNS' | 'Yayasan';
}

export interface Subject {
  id: string;
  kode: string;
  nama: string;
  kelompok: 'Umum' | 'Agama' | 'Peminatan' | 'Muatan Lokal';
}

export interface SchoolClass {
  id: string;
  tingkat: 'X' | 'XI' | 'XII';
  rombel: string; // e.g. "X-A", "X-B", "XI-IPA-1"
  waliKelas?: string;
}

export type SectionType = 'A' | 'B' | 'C';

export interface Indicator {
  id: number;
  section: SectionType;
  sectionTitle: string;
  number: number;
  aspekYangDiamati: string;
}

export interface IndicatorScore {
  indicatorId: number;
  score: 0 | 1 | 2; // 0 = Sudah Lengkap/Sesuai, 1 = Kurang Lengkap/Sesuai, 2 = Tidak
  catatan: string;
}

export type EvaluationMode = 'DOKUMEN_ASLI' | 'SKOR_KUALITAS';

export type SupervisionType = 'Supervisi Akademik' | 'Supervisi Pembelajaran' | 'Supervisi Tindak Lanjut';

export type SupervisionStatus = 'DRAFT' | 'FINAL';

export type FollowUpStatus = 'Belum Dilaksanakan' | 'Dalam Proses' | 'Selesai';

export interface FollowUpPlan {
  options: string[]; // e.g. ['Pembinaan individu', 'Pelatihan']
  targetDate: string;
  pic: string;
  status: FollowUpStatus;
  notes: string;
  completionDate?: string;
  resolutionNotes?: string;
}

export interface DigitalSignatureInfo {
  useDigitalSignature: boolean;
  supervisorSignature?: string; // base64 data url
  teacherSignature?: string; // base64 data url
  supervisorSignDate?: string;
  teacherSignDate?: string;
  supervisorName: string;
  supervisorNip: string;
  teacherName: string;
  teacherNip: string;
}

export interface AutoAnalysis {
  aspekSudahBaik: string[];
  aspekPerluDitingkatkan: string[];
  rekomendasi: string[];
}

export interface Supervision {
  id: string;
  nomorDokumen: string;
  tanggalSupervisi: string;
  semester: 'Ganjil' | 'Genap';
  tahunPelajaran: string;
  
  // Identitas Guru & KBM
  guruId: string;
  namaGuru: string;
  nipGuru: string;
  nuptkGuru?: string;
  pendidikanGuru?: string;
  jabatanGuru?: string;
  statusKepegawaianGuru?: string;
  kontakGuru?: string;
  mataPelajaran: string;
  kelas: string;
  jamPelajaran: string;
  materiTopik: string;
  
  // Supervisor
  namaSupervisor: string;
  nipSupervisor: string;
  jenisSupervisi: SupervisionType;
  
  // Instrumen
  penilaian: Record<number, IndicatorScore>; // key is indicatorId (1..38)
  
  // Perhitungan Nilai
  evaluationMode: EvaluationMode;
  countScore0: number;
  countScore1: number;
  countScore2: number;
  totalSkorPerolehan: number;
  skorMaksimal: number; // 76
  nilaiAkhir: number; // percentage or scaled
  kategori: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang';
  
  // Catatan Supervisor
  catatanHasilSupervisi: string;
  kelebihanGuru: string;
  halPerluDitingkatkan: string;
  rekomendasi: string;
  
  // Analisis Otomatis
  analisis: AutoAnalysis;
  
  // Rencana Tindak Lanjut
  tindakLanjut: FollowUpPlan;
  
  // Tanda Tangan
  signature: DigitalSignatureInfo;
  
  // Status & Metadata
  status: SupervisionStatus;
  approvedByKamad?: boolean;
  approvalDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  evaluationModeDefault: EvaluationMode;
  documentNumberPrefix: string; // e.g. "SUP/AMD"
  currentTahunPelajaran: string; // e.g. "2026/2027"
  currentSemester: 'Ganjil' | 'Genap';
  useWatermarkInDocx: boolean;
}
