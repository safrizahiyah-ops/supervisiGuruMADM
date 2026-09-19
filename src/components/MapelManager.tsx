import React, { useState } from 'react';
import { Subject } from '../types/supervisi';
import { storageService } from '../services/storageService';
import { BookOpen, PlusCircle, Edit, Trash2, X, Search } from 'lucide-react';

interface MapelManagerProps {
  subjects: Subject[];
  onSubjectsUpdated: () => void;
}

export const MapelManager: React.FC<MapelManagerProps> = ({ subjects, onSubjectsUpdated }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [kelompok, setKelompok] = useState<'Umum' | 'Agama' | 'Peminatan' | 'Muatan Lokal'>('Agama');

  const filtered = subjects.filter(
    (s) =>
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.kelompok.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setKode('');
    setNama('');
    setKelompok('Agama');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Subject) => {
    setEditingSubject(s);
    setKode(s.kode);
    setNama(s.nama);
    setKelompok(s.kelompok);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, namaSub: string) => {
    if (window.confirm(`Hapus mata pelajaran: ${namaSub}?`)) {
      storageService.deleteSubject(id);
      onSubjectsUpdated();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      alert('Nama mata pelajaran wajib diisi.');
      return;
    }

    const subToSave: Subject = {
      id: editingSubject ? editingSubject.id : `sub-${Date.now()}`,
      kode: kode || nama.substring(0, 3).toUpperCase(),
      nama,
      kelompok,
    };

    storageService.saveSubject(subToSave);
    setIsModalOpen(false);
    onSubjectsUpdated();
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            Data Master Mata Pelajaran
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar mata pelajaran kurikulum merdeka MA Darul Mahfudz
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari mata pelajaran..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs w-52 sm:w-64 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            + Tambah Mapel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-2xs border-b border-slate-200">
              <th className="py-3 px-4 w-12 text-center">No</th>
              <th className="py-3 px-4 w-24">Kode</th>
              <th className="py-3 px-4">Nama Mata Pelajaran</th>
              <th className="py-3 px-4">Kelompok</th>
              <th className="py-3 px-4 text-center w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((sub, idx) => (
              <tr key={sub.id} className="hover:bg-slate-50/80">
                <td className="py-3 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-600">{sub.kode}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{sub.nama}</td>
                <td className="py-3 px-4">
                  <span
                    className={`text-2xs px-2 py-0.5 rounded-full font-bold ${
                      sub.kelompok === 'Agama'
                        ? 'bg-emerald-100 text-emerald-800'
                        : sub.kelompok === 'Umum'
                        ? 'bg-blue-100 text-blue-800'
                        : sub.kelompok === 'Peminatan'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {sub.kelompok}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(sub)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id, sub.nama)}
                      className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingSubject ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kode Mapel</label>
                <input
                  type="text"
                  value={kode}
                  onChange={(e) => setKode(e.target.value)}
                  placeholder="Contoh: ARB / FIQ"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Mata Pelajaran</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Bahasa Arab"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kelompok Mata Pelajaran</label>
                <select
                  value={kelompok}
                  onChange={(e) => setKelompok(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                >
                  <option value="Agama">Agama (Khas Madrasah / Kemenag)</option>
                  <option value="Umum">Umum (Nasional)</option>
                  <option value="Peminatan">Peminatan / Pilihan</option>
                  <option value="Muatan Lokal">Muatan Lokal / Keasramaan</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold"
                >
                  Simpan Mapel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
