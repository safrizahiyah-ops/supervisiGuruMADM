import React, { useState } from 'react';
import { Supervision } from '../types/supervisi';
import { storageService } from '../services/storageService';
import {
  Sparkles,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Save,
  X,
  Calendar,
  User,
  ArrowRight,
} from 'lucide-react';

interface TindakLanjutViewProps {
  supervisions: Supervision[];
  onSupervisionUpdated: () => void;
  onOpenSupervision: (id: string) => void;
}

export const TindakLanjutView: React.FC<TindakLanjutViewProps> = ({
  supervisions,
  onSupervisionUpdated,
  onOpenSupervision,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Belum Dilaksanakan' | 'Dalam Proses' | 'Selesai'>('ALL');
  const [editingSupervision, setEditingSupervision] = useState<Supervision | null>(null);

  // Form edit fields
  const [targetDate, setTargetDate] = useState('');
  const [pic, setPic] = useState('');
  const [status, setStatus] = useState<'Belum Dilaksanakan' | 'Dalam Proses' | 'Selesai'>('Belum Dilaksanakan');
  const [notes, setNotes] = useState('');

  const filtered = supervisions.filter((s) => {
    const matchSearch =
      s.namaGuru.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.mataPelajaran.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || s.tindakLanjut?.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStartEdit = (s: Supervision) => {
    setEditingSupervision(s);
    setTargetDate(s.tindakLanjut?.targetDate || '');
    setPic(s.tindakLanjut?.pic || '');
    setStatus(s.tindakLanjut?.status || 'Belum Dilaksanakan');
    setNotes(s.tindakLanjut?.notes || '');
  };

  const handleSaveEdit = () => {
    if (!editingSupervision) return;

    const updated: Supervision = {
      ...editingSupervision,
      tindakLanjut: {
        ...editingSupervision.tindakLanjut,
        options: editingSupervision.tindakLanjut?.options || ['Pembinaan Individual'],
        targetDate,
        pic,
        status,
        notes,
      },
    };

    storageService.saveSupervision(updated);
    setEditingSupervision(null);
    onSupervisionUpdated();
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            Tindak Lanjut Hasil Supervisi Pembelajaran
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring pelaksanaan rekomendasi, workshop, pendampingan, dan tindak lanjut perbaikan guru
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter tabs */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 text-2xs font-semibold text-slate-600">
            {(['ALL', 'Belum Dilaksanakan', 'Dalam Proses', 'Selesai'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg ${
                  statusFilter === st ? 'bg-white shadow-2xs font-bold text-emerald-800' : ''
                }`}
              >
                {st === 'ALL' ? 'Semua' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-2xs border-b border-slate-200">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Guru & Mapel</th>
                <th className="py-3 px-4">Nilai & Kategori</th>
                <th className="py-3 px-4">Aspek Perlu Ditingkatkan</th>
                <th className="py-3 px-4">Bentuk Rekomendasi</th>
                <th className="py-3 px-4">Target & PIC</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-center font-bold text-slate-400">{idx + 1}</td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{s.namaGuru}</div>
                    <div className="text-2xs text-slate-400">{s.mataPelajaran} • {s.kelas}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-black text-emerald-800">{s.nilaiAkhir}%</span>
                    <span className="text-2xs text-slate-500 ml-1.5">({s.kategori})</span>
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    {s.analisis?.aspekPerluDitingkatkan && s.analisis.aspekPerluDitingkatkan.length > 0 ? (
                      <ul className="list-disc list-inside text-2xs text-slate-600 space-y-0.5 line-clamp-2">
                        {s.analisis.aspekPerluDitingkatkan.slice(0, 2).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-2xs italic text-emerald-700">Tidak ada kendala berarti</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 text-2xs">
                      {s.tindakLanjut?.options?.join(', ') || 'Pembinaan Individual'}
                    </div>
                    {s.tindakLanjut?.notes && (
                      <div className="text-3xs text-slate-400 italic line-clamp-1 mt-0.5">
                        {s.tindakLanjut.notes}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 text-2xs text-slate-600">
                    <div>Target: {s.tindakLanjut?.targetDate || '-'}</div>
                    <div className="text-slate-400">PIC: {s.tindakLanjut?.pic || '-'}</div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-2xs px-2 py-0.5 rounded-full font-bold ${
                        s.tindakLanjut?.status === 'Selesai'
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.tindakLanjut?.status === 'Dalam Proses'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {s.tindakLanjut?.status || 'Belum Dilaksanakan'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleStartEdit(s)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                        title="Update Status Tindak Lanjut"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onOpenSupervision(s.id)}
                        className="p-1.5 rounded-lg border border-slate-200 text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                        title="Buka Dokumen Supervisi"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Tindak Lanjut Modal */}
      {editingSupervision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Update Tindak Lanjut</h3>
                <p className="text-2xs text-slate-500 mt-0.5">
                  Guru: {editingSupervision.namaGuru} ({editingSupervision.mataPelajaran})
                </p>
              </div>
              <button
                onClick={() => setEditingSupervision(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Status Tindak Lanjut</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Belum Dilaksanakan">Belum Dilaksanakan</option>
                  <option value="Dalam Proses">Dalam Proses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Tanggal Penyelesaian</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                >
                </input>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Penanggung Jawab (PIC)</label>
                <input
                  type="text"
                  value={pic}
                  onChange={(e) => setPic(e.target.value)}
                  placeholder="Contoh: Tim Kurikulum / Kepala Madrasah"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Hasil & Evaluasi Tindak Lanjut</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tuliskan kemajuan guru setelah pembinaan/workshop..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingSupervision(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
