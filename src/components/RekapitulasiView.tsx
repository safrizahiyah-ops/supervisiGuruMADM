import React, { useState, useMemo } from 'react';
import { Supervision, MadrasahIdentity } from '../types/supervisi';
import { exportRekapitulasiExcel } from '../services/exportExcel';
import {
  BarChart3,
  Search,
  FileSpreadsheet,
  Printer,
  FileDown,
  Filter,
  Eye,
  Calendar,
  CheckCircle,
  Clock,
  Award,
  ChevronDown,
} from 'lucide-react';

interface RekapitulasiViewProps {
  supervisions: Supervision[];
  madrasah: MadrasahIdentity;
  onSelectSupervision: (id: string) => void;
}

export const RekapitulasiView: React.FC<RekapitulasiViewProps> = ({
  supervisions,
  madrasah,
  onSelectSupervision,
}) => {
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTapel, setFilterTapel] = useState('ALL');
  const [filterSemester, setFilterSemester] = useState('ALL');
  const [filterMapel, setFilterMapel] = useState('ALL');
  const [filterKategori, setFilterKategori] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Extract unique options
  const uniqueTapel = useMemo(
    () => Array.from(new Set(supervisions.map((s) => s.tahunPelajaran))),
    [supervisions]
  );
  const uniqueMapel = useMemo(
    () => Array.from(new Set(supervisions.map((s) => s.mataPelajaran))),
    [supervisions]
  );

  const filteredSupervisions = useMemo(() => {
    return supervisions.filter((s) => {
      const matchSearch =
        s.namaGuru.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.mataPelajaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nomorDokumen.toLowerCase().includes(searchTerm.toLowerCase());

      const matchTapel = filterTapel === 'ALL' || s.tahunPelajaran === filterTapel;
      const matchSem = filterSemester === 'ALL' || s.semester === filterSemester;
      const matchMapel = filterMapel === 'ALL' || s.mataPelajaran === filterMapel;
      const matchKat = filterKategori === 'ALL' || s.kategori === filterKategori;
      const matchStat = filterStatus === 'ALL' || s.status === filterStatus;

      return matchSearch && matchTapel && matchSem && matchMapel && matchKat && matchStat;
    });
  }, [supervisions, searchTerm, filterTapel, filterSemester, filterMapel, filterKategori, filterStatus]);

  // Summary statistics for current filter
  const totalCount = filteredSupervisions.length;
  const uniqueTeachersCount = new Set(filteredSupervisions.map((s) => s.guruId)).size;
  const avgNilai =
    totalCount > 0
      ? Number(
          (
            filteredSupervisions.reduce((acc, curr) => acc + curr.nilaiAkhir, 0) / totalCount
          ).toFixed(1)
        )
      : 0;

  const countSangatBaik = filteredSupervisions.filter((s) => s.kategori === 'Sangat Baik').length;
  const countBaik = filteredSupervisions.filter((s) => s.kategori === 'Baik').length;
  const countCukup = filteredSupervisions.filter((s) => s.kategori === 'Cukup').length;
  const countKurang = filteredSupervisions.filter((s) => s.kategori === 'Kurang').length;

  const handleExportExcel = () => {
    exportRekapitulasiExcel(filteredSupervisions, madrasah);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-700" />
            Rekapitulasi Supervisi Akademik
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Laporan agregat nilai dan tindak lanjut supervisi MA Darul Mahfudz
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Excel (.xlsx)
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
          >
            <Printer className="w-4 h-4" />
            Cetak / PDF
          </button>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200">
          <span className="text-2xs font-bold uppercase text-slate-400">Guru Terdata</span>
          <div className="text-xl font-black text-slate-800 mt-0.5">{uniqueTeachersCount}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200">
          <span className="text-2xs font-bold uppercase text-slate-400">Total Supervisi</span>
          <div className="text-xl font-black text-slate-800 mt-0.5">{totalCount}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
          <span className="text-2xs font-bold uppercase text-emerald-700">Rata-rata Nilai</span>
          <div className="text-xl font-black text-emerald-900 mt-0.5">{avgNilai}%</div>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200">
          <span className="text-2xs font-bold uppercase text-emerald-600">Sangat Baik</span>
          <div className="text-xl font-black text-slate-800 mt-0.5">{countSangatBaik}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200">
          <span className="text-2xs font-bold uppercase text-blue-600">Baik</span>
          <div className="text-xl font-black text-slate-800 mt-0.5">{countBaik}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200">
          <span className="text-2xs font-bold uppercase text-amber-600">Cukup</span>
          <div className="text-xl font-black text-slate-800 mt-0.5">{countCukup}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200">
          <span className="text-2xs font-bold uppercase text-rose-600">Kurang</span>
          <div className="text-xl font-black text-slate-800 mt-0.5">{countKurang}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <Filter className="w-3.5 h-3.5 text-emerald-700" />
          <span>Filter & Pencarian:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari guru / mapel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Tapel Filter */}
          <select
            value={filterTapel}
            onChange={(e) => setFilterTapel(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
          >
            <option value="ALL">Semua Tahun Pelajaran</option>
            {uniqueTapel.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Semester Filter */}
          <select
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
          >
            <option value="ALL">Semua Semester</option>
            <option value="Ganjil">Semester Ganjil</option>
            <option value="Genap">Semester Genap</option>
          </select>

          {/* Mapel Filter */}
          <select
            value={filterMapel}
            onChange={(e) => setFilterMapel(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
          >
            <option value="ALL">Semua Mata Pelajaran</option>
            {uniqueMapel.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Kategori Filter */}
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="Sangat Baik">Sangat Baik (91–100)</option>
            <option value="Baik">Baik (81–90)</option>
            <option value="Cukup">Cukup (71–80)</option>
            <option value="Kurang">Kurang (&lt; 71)</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
          >
            <option value="ALL">Semua Status Dokumen</option>
            <option value="FINAL">FINAL Saja</option>
            <option value="DRAFT">DRAFT Saja</option>
          </select>
        </div>
      </div>

      {/* Rekapitulasi Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-2xs border-b border-slate-200">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Guru</th>
                <th className="py-3 px-4">Mata Pelajaran & Kelas</th>
                <th className="py-3 px-4">Tanggal Supervisi</th>
                <th className="py-3 px-4 text-center">Nilai Akhir</th>
                <th className="py-3 px-4 text-center">Kategori</th>
                <th className="py-3 px-4">Tindak Lanjut</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSupervisions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-400 text-xs">
                    Tidak ada data supervisi yang cocok dengan filter yang dipilih.
                  </td>
                </tr>
              ) : (
                filteredSupervisions.map((sup, idx) => (
                  <tr key={sup.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{sup.namaGuru}</div>
                      <div className="text-2xs text-slate-400 font-mono">{sup.nomorDokumen}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-emerald-900">{sup.mataPelajaran}</div>
                      <div className="text-2xs text-slate-500">{sup.kelas}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{sup.tanggalSupervisi}</div>
                      <div className="text-2xs text-slate-400">
                        {sup.semester} • {sup.tahunPelajaran}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-black text-emerald-800 text-sm">
                      {sup.nilaiAkhir}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-2xs px-2 py-0.5 rounded-full font-bold ${
                          sup.kategori === 'Sangat Baik'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sup.kategori === 'Baik'
                            ? 'bg-blue-100 text-blue-800'
                            : sup.kategori === 'Cukup'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {sup.kategori}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-2xs font-medium text-slate-800 line-clamp-1">
                        {sup.tindakLanjut?.options?.join(', ') || '-'}
                      </div>
                      <span
                        className={`text-3xs font-semibold px-1.5 py-0.2 rounded ${
                          sup.tindakLanjut?.status === 'Selesai'
                            ? 'bg-emerald-50 text-emerald-700'
                            : sup.tindakLanjut?.status === 'Dalam Proses'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {sup.tindakLanjut?.status || 'Belum'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-2xs px-2 py-0.5 rounded-md font-bold ${
                          sup.status === 'FINAL'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {sup.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onSelectSupervision(sup.id)}
                        className="p-1.5 rounded-lg border border-slate-200 text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                        title="Buka Dokumen Supervisi"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
