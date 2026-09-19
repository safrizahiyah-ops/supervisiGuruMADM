/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Teacher, Supervision, UserRole } from '../types/supervisi';
import { storageService } from '../services/storageService';
import { excelService } from '../services/excelService';
import {
  Users,
  UserPlus,
  Search,
  Edit,
  Trash2,
  Eye,
  PlusCircle,
  History,
  X,
  Check,
  Phone,
  Mail,
  GraduationCap,
  Briefcase,
  Download,
  Upload,
  FileSpreadsheet,
  AlertTriangle,
  FileText,
  Filter,
  CheckCircle2,
} from 'lucide-react';

interface GuruManagerProps {
  teachers: Teacher[];
  supervisions: Supervision[];
  onTeachersUpdated: () => void;
  onStartSupervisionForTeacher: (teacher: Teacher) => void;
  onViewHistoryForTeacher: (teacher: Teacher) => void;
  userRole?: UserRole;
  madrasahName?: string;
}

export const GuruManager: React.FC<GuruManagerProps> = ({
  teachers,
  supervisions,
  onTeachersUpdated,
  onStartSupervisionForTeacher,
  onViewHistoryForTeacher,
  userRole = 'ADMIN',
  madrasahName = 'MA DARUL MAHFUDZ LEKOPADIS',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedTeacherForDetail, setSelectedTeacherForDetail] = useState<Teacher | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Delete Confirmation Modal State
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);

  // Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [parsedImportTeachers, setParsedImportTeachers] = useState<Teacher[]>([]);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [isParsingExcel, setIsParsingExcel] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Form State
  const [formData, setFormData] = useState<Partial<Teacher>>({
    nama: '',
    nip: '',
    nuptk: '',
    nik: '',
    jenisKelamin: 'L',
    tempatLahir: '',
    tanggalLahir: '',
    pendidikanTerakhir: 'S1 Pendidikan',
    jabatan: 'Guru Mata Pelajaran',
    mataPelajaranUtama: '',
    nomorHp: '',
    email: '',
    statusKepegawaian: 'GTT / Non-PNS',
  });

  const canManage = userRole === 'ADMIN';

  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.mataPelajaranUtama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.nip && t.nip.includes(searchTerm)) ||
      (t.nuptk && t.nuptk.includes(searchTerm));

    const matchesStatus = filterStatus === 'ALL' || t.statusKepegawaian === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormData({
      id: `tch-${Date.now()}`,
      nama: '',
      nip: '',
      nuptk: '',
      nik: '',
      jenisKelamin: 'L',
      tempatLahir: '',
      tanggalLahir: '',
      pendidikanTerakhir: 'S1 Pendidikan',
      jabatan: 'Guru Mata Pelajaran',
      mataPelajaranUtama: '',
      nomorHp: '',
      email: '',
      statusKepegawaian: 'GTT / Non-PNS',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setFormData({ ...t });
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingTeacher) return;
    const name = deletingTeacher.nama;
    storageService.deleteTeacher(deletingTeacher.id);
    setDeletingTeacher(null);
    onTeachersUpdated();
    showToast(`Data guru "${name}" berhasil dihapus secara permanen.`, 'info');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama?.trim()) {
      alert('Nama guru wajib diisi.');
      return;
    }

    const teacherToSave: Teacher = {
      id: editingTeacher ? editingTeacher.id : formData.id || `tch-${Date.now()}`,
      nama: formData.nama.trim(),
      nip: formData.nip?.trim() || '-',
      nuptk: formData.nuptk?.trim() || '-',
      nik: formData.nik?.trim() || '-',
      jenisKelamin: (formData.jenisKelamin as 'L' | 'P') || 'L',
      tempatLahir: formData.tempatLahir?.trim() || '',
      tanggalLahir: formData.tanggalLahir?.trim() || '',
      pendidikanTerakhir: formData.pendidikanTerakhir?.trim() || 'S1 Pendidikan',
      jabatan: formData.jabatan?.trim() || 'Guru Mata Pelajaran',
      mataPelajaranUtama: formData.mataPelajaranUtama?.trim() || 'Mata Pelajaran',
      nomorHp: formData.nomorHp?.trim() || '',
      email: formData.email?.trim() || '',
      statusKepegawaian: (formData.statusKepegawaian as any) || 'GTT / Non-PNS',
    };

    storageService.saveTeacher(teacherToSave);
    setIsModalOpen(false);
    onTeachersUpdated();
    showToast(
      editingTeacher
        ? `Perubahan data "${teacherToSave.nama}" berhasil disimpan!`
        : `Guru baru "${teacherToSave.nama}" berhasil ditambahkan!`
    );
  };

  // EXCEL EXPORT
  const handleExportExcel = () => {
    if (teachers.length === 0) {
      alert('Belum ada data guru untuk diunduh.');
      return;
    }
    excelService.exportTeachers(teachers, madrasahName);
    showToast(`Berhasil mengunduh data ${teachers.length} guru ke dalam file Excel.`);
  };

  // EXCEL TEMPLATE DOWNLOAD
  const handleDownloadTemplate = () => {
    excelService.downloadTemplate();
    showToast('Template Excel guru berhasil diunduh.');
  };

  // EXCEL FILE SELECTED FOR IMPORT
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setIsParsingExcel(true);
    setImportError(null);

    try {
      const parsed = await excelService.parseExcelTeachers(file);
      if (parsed.length === 0) {
        setImportError('Tidak ada baris data guru yang valid ditemukan dalam sheet pertama.');
      } else {
        setParsedImportTeachers(parsed);
      }
    } catch (err: any) {
      setImportError('Gagal membaca file Excel. Pastikan file berformat .xlsx atau .xls standar.');
    } finally {
      setIsParsingExcel(false);
    }
  };

  // EXECUTE IMPORT
  const handleProcessImport = () => {
    if (parsedImportTeachers.length === 0) return;

    const imported = storageService.bulkImportTeachers(parsedImportTeachers, importMode);
    onTeachersUpdated();
    setIsImportModalOpen(false);
    setImportFile(null);
    setParsedImportTeachers([]);
    showToast(
      `Sukses! ${parsedImportTeachers.length} data guru berhasil diimpor ke sistem (Total sekarang: ${imported.length} guru).`
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold transition-all border ${
            toast.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : toast.type === 'error'
              ? 'bg-rose-900 text-white border-rose-700'
              : 'bg-slate-900 text-white border-slate-700'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                Data Master Guru & Tenaga Pendidik
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
                  {teachers.length} Guru
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Basis data tenaga pendidik MA Darul Mahfudz untuk penilaian & administrasi supervisi
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Excel Export, Excel Import, Add Teacher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Export Excel */}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold cursor-pointer transition-all shadow-2xs"
            title="Unduh seluruh data guru ke file Excel (.xlsx)"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Unduh Excel</span>
          </button>

          {/* Template Excel */}
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold cursor-pointer transition-all shadow-2xs"
            title="Unduh format template Excel untuk impor data guru baru"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Template Impor</span>
          </button>

          {/* Import Excel Button (Admin Only) */}
          {canManage && (
            <button
              onClick={() => {
                setImportFile(null);
                setParsedImportTeachers([]);
                setImportError(null);
                setIsImportModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 text-xs font-bold cursor-pointer transition-all shadow-2xs"
              title="Unggah dan impor data guru dari Excel"
            >
              <Upload className="w-3.5 h-3.5 text-blue-700" />
              <span>Impor Excel</span>
            </button>
          )}

          {/* Add Teacher Button (Admin Only) */}
          {canManage && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Tambah Guru</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, NIP, atau mapel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Status:</span>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="ALL">Semua Status Kepegawaian</option>
            <option value="PNS">PNS</option>
            <option value="PPPK">PPPK</option>
            <option value="GTT / Non-PNS">GTT / Non-PNS</option>
            <option value="Yayasan">Yayasan</option>
          </select>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-black uppercase tracking-wider text-2xs border-b border-slate-200">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Lengkap & NIP</th>
                <th className="py-3 px-4">Mata Pelajaran</th>
                <th className="py-3 px-4">Pendidikan & Jabatan</th>
                <th className="py-3 px-4">Status Kepegawaian</th>
                <th className="py-3 px-4">Kontak (HP & Email)</th>
                <th className="py-3 px-4 text-center">Supervisi</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 text-xs">
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    Tidak ada data guru yang cocok.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((t, index) => {
                  const teacherSupervisions = supervisions.filter((s) => s.guruId === t.id);
                  const lastSupervision = teacherSupervisions[0];

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-center font-bold text-slate-400">
                        {index + 1}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900 text-xs">{t.nama}</div>
                        <div className="text-2xs text-slate-500 font-mono mt-0.5">
                          {t.nip && t.nip !== '-' ? `NIP. ${t.nip}` : t.nuptk && t.nuptk !== '-' ? `NUPTK: ${t.nuptk}` : 'NIP/NUPTK: -'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-block font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg text-2xs">
                          {t.mataPelajaranUtama || '-'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{t.jabatan}</div>
                        <div className="text-2xs text-slate-500">{t.pendidikanTerakhir}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-2xs font-extrabold ${
                            t.statusKepegawaian === 'PNS'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : t.statusKepegawaian === 'PPPK'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : t.statusKepegawaian === 'Yayasan'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {t.statusKepegawaian}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-2xs text-slate-700 font-mono">
                          {t.nomorHp || '-'}
                        </div>
                        <div className="text-2xs text-slate-400 truncate max-w-[140px]">
                          {t.email || '-'}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        {teacherSupervisions.length > 0 ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="text-2xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                              {teacherSupervisions.length}x Supervisi
                            </span>
                            {lastSupervision && (
                              <span className="text-3xs text-slate-400 mt-0.5">
                                Nilai: {lastSupervision.nilaiAkhir}%
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-2xs text-slate-400 italic">Belum disupervisi</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Mulai Supervisi Button */}
                          <button
                            onClick={() => onStartSupervisionForTeacher(t)}
                            title="Mulai Supervisi Guru Ini"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                          </button>

                          {/* Detail Profile */}
                          <button
                            onClick={() => setSelectedTeacherForDetail(t)}
                            title="Lihat Detail Profil"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Teacher (Admin Only) */}
                          {canManage && (
                            <button
                              onClick={() => handleOpenEdit(t)}
                              title="Edit Data Guru"
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Delete Teacher (Admin Only) */}
                          {canManage && (
                            <button
                              onClick={() => setDeletingTeacher(t)}
                              title="Hapus Data Guru"
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ADD / EDIT TEACHER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-emerald-300" />
                <h3 className="font-extrabold text-base">
                  {editingTeacher ? 'Edit Data Guru & Tenaga Pendidik' : 'Tambah Guru & Tenaga Pendidik Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Lengkap beserta Gelar <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama || ''}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Contoh: Drs. Muhammad Yusuf, M.Pd.I."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIP (Nomor Induk Pegawai)</label>
                  <input
                    type="text"
                    value={formData.nip || ''}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    placeholder="18 digit atau tanda -"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">NUPTK</label>
                  <input
                    type="text"
                    value={formData.nuptk || ''}
                    onChange={(e) => setFormData({ ...formData, nuptk: e.target.value })}
                    placeholder="16 digit atau tanda -"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIK (Nomor Induk Kependudukan)</label>
                  <input
                    type="text"
                    value={formData.nik || ''}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    placeholder="16 digit KTP"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.jenisKelamin || 'L'}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={formData.tempatLahir || ''}
                    onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                    placeholder="Contoh: Polewali"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={formData.tanggalLahir || ''}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pendidikan Terakhir</label>
                  <input
                    type="text"
                    value={formData.pendidikanTerakhir || ''}
                    onChange={(e) => setFormData({ ...formData, pendidikanTerakhir: e.target.value })}
                    placeholder="Contoh: S1 Pendidikan Fisika"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jabatan / Tugas</label>
                  <input
                    type="text"
                    value={formData.jabatan || ''}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    placeholder="Contoh: Guru Madya / Wali Kelas"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Mata Pelajaran Utama <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.mataPelajaranUtama || ''}
                    onChange={(e) => setFormData({ ...formData, mataPelajaranUtama: e.target.value })}
                    placeholder="Contoh: Fikih / Matematika"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-emerald-950"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Kepegawaian</label>
                  <select
                    value={formData.statusKepegawaian || 'GTT / Non-PNS'}
                    onChange={(e) => setFormData({ ...formData, statusKepegawaian: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  >
                    <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                    <option value="PPPK">PPPK (P3K Kemenag)</option>
                    <option value="GTT / Non-PNS">GTT / Non-PNS</option>
                    <option value="Yayasan">Guru Tetap Yayasan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp / HP</label>
                  <input
                    type="text"
                    value={formData.nomorHp || ''}
                    onChange={(e) => setFormData({ ...formData, nomorHp: e.target.value })}
                    placeholder="Contoh: 0812-3456-7890"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alamat Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Contoh: guru@gmail.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
                >
                  {editingTeacher ? 'Simpan Perubahan' : 'Tambahkan Guru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DELETE CONFIRMATION */}
      {deletingTeacher && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-black text-slate-900 text-center mb-1">
              Hapus Data Guru?
            </h3>
            <p className="text-xs text-slate-500 text-center mb-4">
              Apakah Anda yakin ingin menghapus data guru <strong className="text-slate-800">{deletingTeacher.nama}</strong> ({deletingTeacher.mataPelajaranUtama})?
              Data akan dihapus permanen dari sistem dan tidak akan kembali lagi.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingTeacher(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
              >
                Ya, Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EXCEL IMPORT DIALOG */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-emerald-300" />
                <h3 className="font-extrabold text-base">Impor Data Guru dari File Excel (.xlsx / .xls)</h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* File Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Pilih Berkas Excel Guru:
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-emerald-50/30 transition-all"
                >
                  <FileSpreadsheet className="w-10 h-10 mx-auto text-emerald-700 mb-2" />
                  <div className="text-xs font-bold text-slate-800">
                    {importFile ? importFile.name : 'Klik untuk memilih file Excel dari komputer'}
                  </div>
                  <div className="text-2xs text-slate-400 mt-1">
                    Mendukung format Microsoft Excel (.xlsx, .xls)
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {isParsingExcel && (
                <div className="text-center py-3 text-xs text-slate-500 font-semibold animate-pulse">
                  Sedang membaca dan memvalidasi kolom Excel...
                </div>
              )}

              {importError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {/* Parsed Result Preview */}
              {parsedImportTeachers.length > 0 && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
                    <span className="font-extrabold flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-700" />
                      Terdeteksi {parsedImportTeachers.length} data guru siap diimpor
                    </span>
                    <span className="text-2xs bg-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      Format Valid
                    </span>
                  </div>

                  {/* Mode Impor */}
                  <div className="space-y-2 pt-1">
                    <label className="block text-xs font-bold text-slate-700">Metode Penginputan:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <label
                        className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                          importMode === 'append'
                            ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-bold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="importMode"
                          value="append"
                          checked={importMode === 'append'}
                          onChange={() => setImportMode('append')}
                          className="mt-0.5 text-emerald-700"
                        />
                        <div>
                          <div>Tambahkan ke Data yang Ada</div>
                          <div className="text-2xs font-normal text-slate-500">
                            Menggabungkan tanpa menghapus guru lama
                          </div>
                        </div>
                      </label>

                      <label
                        className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                          importMode === 'replace'
                            ? 'border-rose-600 bg-rose-50/50 text-rose-950 font-bold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="importMode"
                          value="replace"
                          checked={importMode === 'replace'}
                          onChange={() => setImportMode('replace')}
                          className="mt-0.5 text-rose-700"
                        />
                        <div>
                          <div>Gantikan Seluruh Data Lama</div>
                          <div className="text-2xs font-normal text-slate-500">
                            Menimpa database guru dengan file baru ini
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Preview Rows */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-36 overflow-y-auto">
                    <table className="w-full text-2xs text-left">
                      <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-2">Nama Guru</th>
                          <th className="p-2">NIP</th>
                          <th className="p-2">Mata Pelajaran</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedImportTeachers.slice(0, 5).map((t, idx) => (
                          <tr key={idx}>
                            <td className="p-2 font-bold text-slate-900">{t.nama}</td>
                            <td className="p-2 text-slate-500">{t.nip}</td>
                            <td className="p-2 text-emerald-800">{t.mataPelajaranUtama}</td>
                            <td className="p-2 text-slate-600">{t.statusKepegawaian}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {parsedImportTeachers.length > 5 && (
                      <div className="p-2 bg-slate-50 text-center text-3xs text-slate-400">
                        ...dan {parsedImportTeachers.length - 5} guru lainnya
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="text-xs text-blue-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Template Format</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsImportModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={parsedImportTeachers.length === 0}
                    onClick={handleProcessImport}
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
                  >
                    Proses Impor Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DETAIL TEACHER PROFILE */}
      {selectedTeacherForDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl p-6 overflow-hidden animate-in fade-in zoom-in duration-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Profil Lengkap Pendidik
                </h3>
              </div>
              <button
                onClick={() => setSelectedTeacherForDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                <div className="text-base font-black text-emerald-950">
                  {selectedTeacherForDetail.nama}
                </div>
                <div className="text-xs text-emerald-800 font-semibold mt-0.5">
                  Mata Pelajaran: {selectedTeacherForDetail.mataPelajaranUtama}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <div className="text-2xs font-bold text-slate-400 uppercase">NIP</div>
                  <div className="font-bold text-slate-800">{selectedTeacherForDetail.nip || '-'}</div>
                </div>
                <div>
                  <div className="text-2xs font-bold text-slate-400 uppercase">NUPTK</div>
                  <div className="font-bold text-slate-800">{selectedTeacherForDetail.nuptk || '-'}</div>
                </div>
                <div>
                  <div className="text-2xs font-bold text-slate-400 uppercase">NIK</div>
                  <div className="font-bold text-slate-800">{selectedTeacherForDetail.nik || '-'}</div>
                </div>
                <div>
                  <div className="text-2xs font-bold text-slate-400 uppercase">Status Kepegawaian</div>
                  <div className="font-bold text-slate-800">{selectedTeacherForDetail.statusKepegawaian}</div>
                </div>
                <div>
                  <div className="text-2xs font-bold text-slate-400 uppercase">Pendidikan Terakhir</div>
                  <div className="font-bold text-slate-800">{selectedTeacherForDetail.pendidikanTerakhir}</div>
                </div>
                <div>
                  <div className="text-2xs font-bold text-slate-400 uppercase">Jabatan</div>
                  <div className="font-bold text-slate-800">{selectedTeacherForDetail.jabatan}</div>
                </div>
                <div>
                  <div className="text-2xs font-bold text-slate-400 uppercase">No. WhatsApp / HP</div>
                  <div className="font-bold text-slate-800">{selectedTeacherForDetail.nomorHp || '-'}</div>
                </div>
                <div>
                  <div className="text-2xs font-bold text-slate-400 uppercase">Alamat Email</div>
                  <div className="font-bold text-slate-800 truncate">{selectedTeacherForDetail.email || '-'}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedTeacherForDetail(null);
                  onStartSupervisionForTeacher(selectedTeacherForDetail);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer"
              >
                + Mulai Supervisi Guru Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
