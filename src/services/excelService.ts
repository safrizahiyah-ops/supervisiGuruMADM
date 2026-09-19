/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as XLSX from 'xlsx';
import { Teacher } from '../types/supervisi';

export const excelService = {
  /**
   * Export all teachers to an formatted Excel (.xlsx) file
   */
  exportTeachers(teachers: Teacher[], madrasahName: string): void {
    const data = teachers.map((t, idx) => ({
      'No': idx + 1,
      'Nama Lengkap': t.nama,
      'NIP': t.nip || '-',
      'NUPTK': t.nuptk || '-',
      'NIK': t.nik || '-',
      'Jenis Kelamin': t.jenisKelamin === 'L' ? 'Laki-laki (L)' : 'Perempuan (P)',
      'Tempat Lahir': t.tempatLahir || '',
      'Tanggal Lahir': t.tanggalLahir || '',
      'Pendidikan Terakhir': t.pendidikanTerakhir || 'S1',
      'Jabatan': t.jabatan || 'Guru Mata Pelajaran',
      'Mata Pelajaran Utama': t.mataPelajaranUtama || '',
      'Status Kepegawaian': t.statusKepegawaian || 'GTT / Non-PNS',
      'Nomor HP / WhatsApp': t.nomorHp || '',
      'Email': t.email || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 5 },  // No
      { wch: 32 }, // Nama Lengkap
      { wch: 22 }, // NIP
      { wch: 20 }, // NUPTK
      { wch: 20 }, // NIK
      { wch: 16 }, // Jenis Kelamin
      { wch: 18 }, // Tempat Lahir
      { wch: 14 }, // Tanggal Lahir
      { wch: 22 }, // Pendidikan
      { wch: 25 }, // Jabatan
      { wch: 26 }, // Mata Pelajaran Utama
      { wch: 20 }, // Status Kepegawaian
      { wch: 18 }, // No HP
      { wch: 26 }, // Email
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DATA GURU & TENDIK');

    // Create petunjuk sheet
    const petunjuk = [
      { 'Petunjuk Pengisian': 'PANDUAN FORMAT EXCEL GURU & TENAGA PENDIDIK' },
      { 'Petunjuk Pengisian': `Lembaga: ${madrasahName}` },
      { 'Petunjuk Pengisian': '1. Kolom "Nama Lengkap" wajib diisi dengan gelar lengkap.' },
      { 'Petunjuk Pengisian': '2. Kolom "NIP" diisi 18 digit jika PNS/PPPK, atau diisi tanda "-" jika belum ber-NIP.' },
      { 'Petunjuk Pengisian': '3. Kolom "Jenis Kelamin" isi dengan "L" atau "P".' },
      { 'Petunjuk Pengisian': '4. Kolom "Status Kepegawaian" isi dengan: "PNS", "PPPK", "GTT / Non-PNS", atau "Yayasan".' },
      { 'Petunjuk Pengisian': '5. Kolom "Mata Pelajaran Utama" diisi mata pelajaran yang diampu oleh guru.' },
      { 'Petunjuk Pengisian': '6. Format file saat disimpan kembali untuk diimpor adalah Excel (.xlsx).' },
    ];
    const petunjukSheet = XLSX.utils.json_to_sheet(petunjuk);
    petunjukSheet['!cols'] = [{ wch: 80 }];
    XLSX.utils.book_append_sheet(workbook, petunjukSheet, 'PANDUAN');

    const cleanName = madrasahName.replace(/[^a-zA-Z0-9]/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `Data_Guru_${cleanName}_${dateStr}.xlsx`);
  },

  /**
   * Generate an empty ready-to-fill Excel template for importing teachers
   */
  downloadTemplate(): void {
    const templateRows = [
      {
        'Nama Lengkap': 'Contoh: Drs. Muhammad Yusuf, M.Pd.I.',
        'NIP': '197905122006041012',
        'NUPTK': '4532757659200032',
        'NIK': '7604021205790001',
        'Jenis Kelamin': 'L',
        'Tempat Lahir': 'Polewali',
        'Tanggal Lahir': '1979-05-12',
        'Pendidikan Terakhir': 'S2 Pendidikan Agama Islam',
        'Jabatan': 'Guru Madya / Koordinator Kurikulum',
        'Mata Pelajaran Utama': 'Fikih',
        'Status Kepegawaian': 'PNS',
        'Nomor HP': '0812-3456-7890',
        'Email': 'yusuf.fikih@darulmahfudz.sch.id',
      },
      {
        'Nama Lengkap': 'Contoh: Fatimah Zahra, S.Pd.',
        'NIP': '-',
        'NUPTK': '8942761663230012',
        'NIK': '7604025408970002',
        'Jenis Kelamin': 'P',
        'Tempat Lahir': 'Tinambung',
        'Tanggal Lahir': '1997-08-14',
        'Pendidikan Terakhir': 'S1 Pendidikan Bahasa Inggris',
        'Jabatan': 'Guru Pertama',
        'Mata Pelajaran Utama': 'Bahasa Inggris',
        'Status Kepegawaian': 'GTT / Non-PNS',
        'Nomor HP': '0852-9876-5432',
        'Email': 'fatimah.english@gmail.com',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateRows);
    worksheet['!cols'] = [
      { wch: 35 }, // Nama Lengkap
      { wch: 22 }, // NIP
      { wch: 20 }, // NUPTK
      { wch: 20 }, // NIK
      { wch: 15 }, // Jenis Kelamin
      { wch: 18 }, // Tempat Lahir
      { wch: 15 }, // Tanggal Lahir
      { wch: 25 }, // Pendidikan Terakhir
      { wch: 30 }, // Jabatan
      { wch: 25 }, // Mata Pelajaran Utama
      { wch: 22 }, // Status Kepegawaian
      { wch: 18 }, // Nomor HP
      { wch: 28 }, // Email
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TEMPLATE GURU');

    XLSX.writeFile(workbook, `Template_Impor_Guru_MA_Darul_Mahfudz.xlsx`);
  },

  /**
   * Parse uploaded Excel file into Teacher objects
   */
  async parseExcelTeachers(file: File): Promise<Teacher[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          const workbook = XLSX.read(buffer, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          // Read rows as json objects with headers
          const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

          if (!rawRows || rawRows.length === 0) {
            resolve([]);
            return;
          }

          const parsedTeachers: Teacher[] = [];

          rawRows.forEach((row, index) => {
            // Helper to get case-insensitive and flexible key matches
            const getValue = (...keys: string[]): string => {
              for (const k of keys) {
                const foundKey = Object.keys(row).find(
                  (rk) => rk.trim().toLowerCase() === k.trim().toLowerCase()
                );
                if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null) {
                  return String(row[foundKey]).trim();
                }
              }
              // Partial search
              for (const k of keys) {
                const foundKey = Object.keys(row).find((rk) =>
                  rk.trim().toLowerCase().includes(k.trim().toLowerCase())
                );
                if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null) {
                  return String(row[foundKey]).trim();
                }
              }
              return '';
            };

            const nama = getValue('Nama Lengkap', 'Nama Guru', 'Nama', 'Nama_Lengkap');
            // Skip empty rows or instruction rows
            if (!nama || nama.toLowerCase().includes('contoh:')) {
              return;
            }

            const nip = getValue('NIP', 'Nomor Induk Pegawai') || '-';
            const nuptk = getValue('NUPTK') || '-';
            const nik = getValue('NIK', 'No KTP') || '-';

            const rawJk = getValue('Jenis Kelamin', 'JK', 'L/P', 'Gender').toUpperCase();
            const jenisKelamin: 'L' | 'P' = rawJk.startsWith('P') ? 'P' : 'L';

            const tempatLahir = getValue('Tempat Lahir', 'Tempat_Lahir', 'Tempat');
            const tanggalLahir = getValue('Tanggal Lahir', 'Tanggal_Lahir', 'Tgl Lahir');
            const pendidikanTerakhir = getValue('Pendidikan Terakhir', 'Pendidikan', 'Pendidikan_Terakhir') || 'S1';
            const jabatan = getValue('Jabatan', 'Jabatan Guru', 'Tugas Tambahan') || 'Guru Mata Pelajaran';
            const mataPelajaranUtama = getValue('Mata Pelajaran Utama', 'Mata Pelajaran', 'Mapel', 'Mapel Utama') || 'Mata Pelajaran';

            let statusKepegawaian: 'PNS' | 'PPPK' | 'GTT / Non-PNS' | 'Yayasan' = 'GTT / Non-PNS';
            const rawStatus = getValue('Status Kepegawaian', 'Status', 'Status_Kepegawaian').toUpperCase();
            if (rawStatus.includes('PNS') && !rawStatus.includes('NON')) {
              statusKepegawaian = 'PNS';
            } else if (rawStatus.includes('PPPK')) {
              statusKepegawaian = 'PPPK';
            } else if (rawStatus.includes('YAYASAN')) {
              statusKepegawaian = 'Yayasan';
            } else {
              statusKepegawaian = 'GTT / Non-PNS';
            }

            const nomorHp = getValue('Nomor HP', 'No HP', 'No. HP', 'WhatsApp', 'No WA', 'HP', 'Telepon');
            const email = getValue('Email', 'Alamat Email', 'E-mail');

            const teacher: Teacher = {
              id: `tch-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
              nama,
              nip: nip === '' ? '-' : nip,
              nuptk: nuptk === '' ? '-' : nuptk,
              nik: nik === '' ? '-' : nik,
              jenisKelamin,
              tempatLahir,
              tanggalLahir,
              pendidikanTerakhir,
              jabatan,
              mataPelajaranUtama,
              nomorHp,
              email,
              statusKepegawaian,
            };

            parsedTeachers.push(teacher);
          });

          resolve(parsedTeachers);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  },
};
