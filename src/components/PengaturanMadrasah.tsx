/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { MadrasahIdentity } from '../types/supervisi';
import { storageService } from '../services/storageService';
import { DEFAULT_LOGO_SVG } from '../data/defaultData';
import {
  School,
  Save,
  RotateCcw,
  Download,
  Upload,
  CheckCircle,
  Building,
  MapPin,
  Mail,
  Phone,
  Globe,
  UserCheck,
  Calendar,
  Image as ImageIcon,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface PengaturanMadrasahProps {
  madrasah: MadrasahIdentity;
  onUpdated: () => void;
}

export const PengaturanMadrasah: React.FC<PengaturanMadrasahProps> = ({
  madrasah,
  onUpdated,
}) => {
  const [formData, setFormData] = useState<MadrasahIdentity>({ ...madrasah });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveMadrasah(formData);
    onUpdated();
    setToastMessage('Data identitas dan logo madrasah berhasil diperbarui!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Upload Logo from Device
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih berkas gambar (PNG, JPG, JPEG, SVG, atau WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setFormData((prev) => ({ ...prev, logoUrl: dataUrl }));
        setToastMessage('Logo baru berhasil dipilih! Klik "Simpan Perubahan" untuk menerapkan.');
        setTimeout(() => setToastMessage(null), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogoToDefault = () => {
    setFormData((prev) => ({ ...prev, logoUrl: DEFAULT_LOGO_SVG }));
    setToastMessage('Logo dikembalikan ke lambang resmi standar MA Darul Mahfudz.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logoUrl: '' }));
    setToastMessage('Logo dinonaktifkan.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBackup = () => {
    const data = storageService.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_Supervisi_MA_Darul_Mahfudz_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonStr = event.target?.result as string;
        const success = storageService.importAllData(jsonStr);
        if (success) {
          alert('Data berhasil dipulihkan dari cadangan (restore)! Halaman akan dimuat ulang.');
          window.location.reload();
        } else {
          alert('Format berkas cadangan tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca berkas cadangan.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDefault = () => {
    if (
      window.confirm(
        'PERINGATAN: Seluruh data supervisi dan perubahan master akan dikembalikan ke data awal standar contoh. Lanjutkan?'
      )
    ) {
      storageService.resetToDefault();
      alert('Data telah diatur ulang ke standar awal.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-emerald-700 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <School className="w-5 h-5 text-emerald-700" />
            Pengaturan & Identitas Madrasah
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola logo resmi madrasah, kop surat instrumen, pimpinan madrasah, dan pencadangan database
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBackup}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            Backup Data (JSON)
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-blue-700" />
            Restore Data
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleRestore}
            className="hidden"
          />
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: LOGO MADRASAH (USER REQUIREMENT: pastikan logo madrasah bisa diedit/ diganti) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-700" />
              Logo Resmi Madrasah (Kop Surat & Instrumen)
            </h3>
            <span className="text-2xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Bisa Diedit & Diganti
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Logo Preview Boxes */}
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="text-center">
                <div className="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center p-2 shadow-xs overflow-hidden">
                  {formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt="Logo Madrasah Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <School className="w-10 h-10 text-slate-300" />
                  )}
                </div>
                <span className="text-3xs text-slate-400 mt-1 block">Pratinjau Putih</span>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 rounded-2xl bg-emerald-950 border-2 border-emerald-800 flex items-center justify-center p-2 shadow-xs overflow-hidden">
                  {formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt="Logo Madrasah Dark"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <School className="w-10 h-10 text-white/50" />
                  )}
                </div>
                <span className="text-3xs text-slate-400 mt-1 block">Pratinjau Header</span>
              </div>
            </div>

            {/* Upload & Controls */}
            <div className="md:col-span-2 space-y-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => logoFileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold cursor-pointer transition-all shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pilih & Unggah File Logo Baru</span>
                </button>
                <input
                  ref={logoFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={handleResetLogoToDefault}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Gunakan Logo Standar MA Darul Mahfudz</span>
                </button>

                {formData.logoUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold cursor-pointer transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Logo</span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-500 mb-1">
                  Atau masukkan URL / Base64 gambar logo secara langsung:
                </label>
                <input
                  type="text"
                  value={formData.logoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://... atau data:image/png;base64,..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>
              <p className="text-2xs text-slate-400">
                Logo ini akan otomatis tampil pada Header Aplikasi, Kop Lembar Supervisi A4, Dokumen Word/PDF, dan Rekapitulasi Nilai Resmi.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: Identitas Lembaga & Yayasan */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-4 h-4 text-emerald-700" />
            Identitas Lembaga & Yayasan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Yayasan / Pondok</label>
              <input
                type="text"
                required
                value={formData.namaYayasan}
                onChange={(e) => setFormData({ ...formData, namaYayasan: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Madrasah</label>
              <input
                type="text"
                required
                value={formData.namaMadrasah}
                onChange={(e) => setFormData({ ...formData, namaMadrasah: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-950"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">NSM (Nomor Statistik Madrasah)</label>
              <input
                type="text"
                value={formData.nsm}
                onChange={(e) => setFormData({ ...formData, nsm: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">NPSN</label>
              <input
                type="text"
                value={formData.npsn}
                onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Status Akreditasi</label>
              <input
                type="text"
                value={formData.akreditasi}
                onChange={(e) => setFormData({ ...formData, akreditasi: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Website Resmi</label>
              <input
                type="text"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://madrasah.sch.id"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Alamat & Kontak */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-4 h-4 text-emerald-700" />
            Alamat & Kontak Resmi
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="md:col-span-3">
              <label className="block font-bold text-slate-700 mb-1">Alamat Jalan</label>
              <input
                type="text"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Desa / Kelurahan</label>
              <input
                type="text"
                value={formData.desaKelurahan}
                onChange={(e) => setFormData({ ...formData, desaKelurahan: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kecamatan</label>
              <input
                type="text"
                value={formData.kecamatan}
                onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kabupaten</label>
              <input
                type="text"
                value={formData.kabupaten}
                onChange={(e) => setFormData({ ...formData, kabupaten: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Provinsi</label>
              <input
                type="text"
                value={formData.provinsi}
                onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kode Pos</label>
              <input
                type="text"
                value={formData.kodePos}
                onChange={(e) => setFormData({ ...formData, kodePos: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Telepon</label>
              <input
                type="text"
                value={formData.telepon}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Resmi</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Website</label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Pimpinan & Tahun Pelajaran */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <UserCheck className="w-4 h-4 text-emerald-700" />
            Kepala Madrasah & Periode Akademik
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Kepala Madrasah</label>
              <input
                type="text"
                required
                value={formData.namaKepalaMadrasah}
                onChange={(e) => setFormData({ ...formData, namaKepalaMadrasah: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">NIP Kepala Madrasah</label>
              <input
                type="text"
                value={formData.nipKepalaMadrasah}
                onChange={(e) => setFormData({ ...formData, nipKepalaMadrasah: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tahun Pelajaran Aktif</label>
              <input
                type="text"
                value={formData.tahunPelajaranAktif}
                onChange={(e) => setFormData({ ...formData, tahunPelajaranAktif: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Semester Aktif</label>
              <select
                value={formData.semesterAktif}
                onChange={(e) => setFormData({ ...formData, semesterAktif: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
              >
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset ke Data Awal Standar
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan Pengaturan & Logo
          </button>
        </div>
      </form>
    </div>
  );
};
