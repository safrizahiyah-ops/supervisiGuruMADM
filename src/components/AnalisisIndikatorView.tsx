import React, { useState, useMemo } from 'react';
import { Supervision } from '../types/supervisi';
import { DEFAULT_INDICATORS } from '../data/defaultData';
import { CheckSquare, AlertTriangle, Filter, ArrowUpDown } from 'lucide-react';

interface AnalisisIndikatorViewProps {
  supervisions: Supervision[];
}

export const AnalisisIndikatorView: React.FC<AnalisisIndikatorViewProps> = ({ supervisions }) => {
  const [sectionFilter, setSectionFilter] = useState<'ALL' | 'A' | 'B' | 'C'>('ALL');
  const [sortBy, setSortBy] = useState<'NUMBER' | 'WEAKEST'>('WEAKEST');

  const totalSupervisi = supervisions.length;

  const indicatorStats = useMemo(() => {
    return DEFAULT_INDICATORS.map((ind) => {
      let count0 = 0;
      let count1 = 0;
      let count2 = 0;
      let evaluatedCount = 0;

      supervisions.forEach((sup) => {
        const rating = sup.penilaian[ind.id];
        if (rating) {
          evaluatedCount++;
          if (rating.score === 0) count0++;
          else if (rating.score === 1) count1++;
          else if (rating.score === 2) count2++;
        }
      });

      // Improvement index: weighted score of non-zero ratings
      const improvementScore = count1 * 1 + count2 * 2;
      const pctSuccess = evaluatedCount > 0 ? Math.round((count0 / evaluatedCount) * 100) : 0;

      return {
        ind,
        count0,
        count1,
        count2,
        evaluatedCount,
        improvementScore,
        pctSuccess,
      };
    });
  }, [supervisions]);

  const filteredAndSorted = useMemo(() => {
    let list = indicatorStats.filter((item) => {
      if (sectionFilter === 'ALL') return true;
      return item.ind.section === sectionFilter;
    });

    if (sortBy === 'WEAKEST') {
      list.sort((a, b) => b.improvementScore - a.improvementScore);
    } else {
      list.sort((a, b) => a.ind.id - b.ind.id);
    }

    return list;
  }, [indicatorStats, sectionFilter, sortBy]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-700" />
            Analisis 38 Indikator Supervisi Pembelajaran
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sebaran capaian indikator pembelajaran (Nilai 0, 1, 2) dari seluruh supervisi terlaksana ({totalSupervisi} supervisi)
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Section Filter */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 text-2xs font-semibold text-slate-600">
            <button
              onClick={() => setSectionFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg ${sectionFilter === 'ALL' ? 'bg-white shadow-2xs font-bold text-emerald-800' : ''}`}
            >
              Semua (38)
            </button>
            <button
              onClick={() => setSectionFilter('A')}
              className={`px-2.5 py-1 rounded-lg ${sectionFilter === 'A' ? 'bg-white shadow-2xs font-bold text-emerald-800' : ''}`}
            >
              A. Pendahuluan
            </button>
            <button
              onClick={() => setSectionFilter('B')}
              className={`px-2.5 py-1 rounded-lg ${sectionFilter === 'B' ? 'bg-white shadow-2xs font-bold text-emerald-800' : ''}`}
            >
              B. Inti
            </button>
            <button
              onClick={() => setSectionFilter('C')}
              className={`px-2.5 py-1 rounded-lg ${sectionFilter === 'C' ? 'bg-white shadow-2xs font-bold text-emerald-800' : ''}`}
            >
              C. Penutup
            </button>
          </div>

          {/* Sort button */}
          <button
            onClick={() => setSortBy(sortBy === 'WEAKEST' ? 'NUMBER' : 'WEAKEST')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortBy === 'WEAKEST' ? 'Urut: Paling Butuh Perhatian' : 'Urut: Nomor Indikator'}
          </button>
        </div>
      </div>

      {/* Overview summary */}
      <div className="bg-emerald-950 text-white rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-emerald-200">Panduan Pembacaan Analisis</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Indikator dengan nilai 1 (Kurang) dan 2 (Tidak) tertinggi diprioritaskan oleh Kepala Madrasah dan Tim Supervisi untuk program pelatihan kurikulum merdeka, pendampingan MGMP, atau lesson study.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>0: Sudah Sesuai (Lengkap)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>1: Kurang Lengkap</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span>2: Tidak Muncul</span>
            </div>
          </div>
        </div>
      </div>

      {/* Indicator Cards Grid */}
      <div className="space-y-3">
        {filteredAndSorted.map(({ ind, count0, count1, count2, evaluatedCount, pctSuccess, improvementScore }) => {
          const isHighPriority = improvementScore >= 3;

          return (
            <div
              key={ind.id}
              className={`p-4 rounded-2xl bg-white border transition-all ${
                isHighPriority ? 'border-amber-300 shadow-2xs' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Indicator text */}
                <div className="flex items-start gap-3 flex-1">
                  <span
                    className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 mt-0.5 ${
                      isHighPriority
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {ind.number}
                  </span>
                  <div>
                    <div className="text-2xs font-bold text-slate-400 uppercase tracking-wider">
                      {ind.sectionTitle}
                    </div>
                    <div className="text-xs font-semibold text-slate-800 leading-snug mt-0.5">
                      {ind.aspekYangDiamati}
                    </div>
                  </div>
                </div>

                {/* Score breakdown bar & counts */}
                <div className="flex items-center gap-4 shrink-0 pl-10 md:pl-0">
                  {/* Counts */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-100">
                      0: {count0} Guru
                    </span>
                    <span className="px-2 py-1 rounded-md bg-amber-50 text-amber-800 font-bold border border-amber-100">
                      1: {count1} Guru
                    </span>
                    <span className="px-2 py-1 rounded-md bg-rose-50 text-rose-800 font-bold border border-rose-100">
                      2: {count2} Guru
                    </span>
                  </div>

                  {/* Progress bar visual */}
                  <div className="w-24 sm:w-32 h-3 rounded-full bg-slate-100 overflow-hidden flex">
                    <div
                      style={{ width: evaluatedCount ? `${(count0 / evaluatedCount) * 100}%` : '0%' }}
                      className="bg-emerald-600 h-full"
                      title={`0 (Lengkap): ${count0}`}
                    />
                    <div
                      style={{ width: evaluatedCount ? `${(count1 / evaluatedCount) * 100}%` : '0%' }}
                      className="bg-amber-500 h-full"
                      title={`1 (Kurang): ${count1}`}
                    />
                    <div
                      style={{ width: evaluatedCount ? `${(count2 / evaluatedCount) * 100}%` : '0%' }}
                      className="bg-rose-500 h-full"
                      title={`2 (Tidak): ${count2}`}
                    />
                  </div>

                  {/* Percentage label */}
                  <div className="text-right w-12">
                    <span className="text-xs font-black text-slate-800">{pctSuccess}%</span>
                    <span className="text-3xs text-slate-400 block">Kesesuaian</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
