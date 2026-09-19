import * as XLSX from 'xlsx';
import { Supervision, MadrasahIdentity } from '../types/supervisi';

export function exportRekapitulasiExcel(
  supervisions: Supervision[],
  madrasah: MadrasahIdentity,
  filterDesc: string = 'Seluruh Data'
): void {
  const rows = supervisions.map((sup, index) => ({
    'No': index + 1,
    'Nomor Dokumen': sup.nomorDokumen,
    'Tanggal Supervisi': sup.tanggalSupervisi,
    'Semester': sup.semester,
    'Tahun Pelajaran': sup.tahunPelajaran,
    'Nama Guru': sup.namaGuru,
    'NIP Guru': sup.nipGuru || '-',
    'Mata Pelajaran': sup.mataPelajaran,
    'Kelas': sup.kelas,
    'Materi / Topik': sup.materiTopik,
    'Skor (0: Lengkap)': sup.countScore0,
    'Skor (1: Kurang)': sup.countScore1,
    'Skor (2: Tidak)': sup.countScore2,
    'Total Skor': sup.totalSkorPerolehan,
    'Nilai Akhir (%)': sup.nilaiAkhir,
    'Kategori': sup.kategori,
    'Status Dokumen': sup.status,
    'Tindak Lanjut': sup.tindakLanjut?.options?.join(', ') || '-',
    'Status Tindak Lanjut': sup.tindakLanjut?.status || '-',
    'Supervisor': sup.namaSupervisor,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  const wscols = [
    { wch: 5 },  // No
    { wch: 22 }, // Nomor Dokumen
    { wch: 14 }, // Tanggal
    { wch: 10 }, // Semester
    { wch: 14 }, // Tapel
    { wch: 28 }, // Nama Guru
    { wch: 20 }, // NIP
    { wch: 22 }, // Mapel
    { wch: 14 }, // Kelas
    { wch: 30 }, // Materi
    { wch: 8 },  // 0
    { wch: 8 },  // 1
    { wch: 8 },  // 2
    { wch: 10 }, // Total
    { wch: 14 }, // Nilai Akhir
    { wch: 14 }, // Kategori
    { wch: 14 }, // Status
    { wch: 25 }, // Tindak Lanjut
    { wch: 20 }, // Status TL
    { wch: 25 }, // Supervisor
  ];
  worksheet['!cols'] = wscols;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekapitulasi Supervisi');

  const today = new Date().toISOString().split('T')[0];
  const filename = `Rekap_Supervisi_${madrasah.namaMadrasah.replace(/\s+/g, '_')}_${today}.xlsx`;
  XLSX.writeFile(workbook, filename);
}
