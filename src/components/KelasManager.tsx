import React, { useState } from 'react';
import { SchoolClass } from '../types/supervisi';
import { storageService } from '../services/storageService';
import { GraduationCap, PlusCircle, Edit, Trash2, X } from 'lucide-react';

interface KelasManagerProps {
  classes: SchoolClass[];
  onClassesUpdated: () => void;
}

export const KelasManager: React.FC<KelasManagerProps> = ({ classes, onClassesUpdated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);

  const [tingkat, setTingkat] = useState<'X' | 'XI' | 'XII'>('X');
  const [rombel, setRombel] = useState('');
  const [waliKelas, setWaliKelas] = useState('');

  const handleOpenAdd = () => {
    setEditingClass(null);
    setTingkat('X');
    setRombel('');
    setWaliKelas('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: SchoolClass) => {
    setEditingClass(c);
    setTingkat(c.tingkat);
    setRombel(c.rombel);
    setWaliKelas(c.waliKelas || '');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, rombelName: string) => {
    if (window.confirm(`Hapus rombel: ${rombelName}?`)) {
      storageService.deleteClass(id);
      onClassesUpdated();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rombel.trim()) {
      alert('Nama rombel / kelas wajib diisi.');
      return;
    }

    const classToSave: SchoolClass = {
      id: editingClass ? editingClass.id : `cls-${Date.now()}`,
      tingkat,
      rombel,
      waliKelas,
    };

    storageService.saveClass(classToSave);
    setIsModalOpen(false);
    onClassesUpdated();
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-700" />
            Data Master Kelas & Rombel
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen rombongan belajar tingkat X, XI, dan XII MA Darul Mahfudz
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          + Tambah Kelas / Rombel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['X', 'XI', 'XII'] as const).map((ting) => {
          const items = classes.filter((c) => c.tingkat === ting);

          return (
            <div key={ting} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Kelas Tingkat {ting}
                </h3>
                <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {items.length} Rombel
                </span>
              </div>

              <div className="mt-4 space-y-2.5">
                {items.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4 text-center">
                    Belum ada rombel untuk tingkat ini.
                  </p>
                ) : (
                  items.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-bold text-slate-800 text-xs">{c.rombel}</div>
                        {c.waliKelas && (
                          <div className="text-2xs text-slate-500 mt-0.5">Wali: {c.waliKelas}</div>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.rombel)}
                          className="p-1 text-red-400 hover:text-red-600 rounded-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingClass ? 'Edit Rombel' : 'Tambah Rombel Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tingkat Kelas</label>
                <select
                  value={tingkat}
                  onChange={(e) => setTingkat(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                >
                  <option value="X">Kelas X</option>
                  <option value="XI">Kelas XI</option>
                  <option value="XII">Kelas XII</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Rombel</label>
                <input
                  type="text"
                  required
                  value={rombel}
                  onChange={(e) => setRombel(e.target.value)}
                  placeholder="Contoh: X-A (Putra) / XI-IPA-1"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Wali Kelas (Opsional)</label>
                <input
                  type="text"
                  value={waliKelas}
                  onChange={(e) => setWaliKelas(e.target.value)}
                  placeholder="Nama Guru Wali Kelas"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
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
                  Simpan Rombel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
