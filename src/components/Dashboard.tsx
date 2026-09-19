import React from 'react';
import { Supervision, Teacher } from '../types/supervisi';
import { DEFAULT_INDICATORS } from '../data/defaultData';
import {
  Users,
  FileCheck2,
  CalendarDays,
  Award,
  AlertTriangle,
  Clock,
  PlusCircle,
  BarChart3,
  TrendingUp,
  FileText,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface DashboardProps {
  supervisions: Supervision[];
  teachers: Teacher[];
  onNavigate: (tab: NavTab) => void;
  onSelectSupervision: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  supervisions,
  teachers,
  onNavigate,
  onSelectSupervision,
}) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Metrics calculation
  const totalGuru = teachers.length;
  const totalSupervisi = supervisions.length;

  const supervisiBulanIni = supervisions.filter((s) => {
    const d = new Date(s.tanggalSupervisi);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  const currentTapel = '2026/2027';
  const currentSemester = 'Ganjil';
  const supervisiSemesterIni = supervisions.filter(
    (s) => s.semester === currentSemester && s.tahunPelajaran === currentTapel
  ).length;

  const rataNilai =
    totalSupervisi > 0
      ? Number(
          (
            supervisions.reduce((acc, curr) => acc + curr.nilaiAkhir, 0) /
            totalSupervisi
          ).toFixed(1)
        )
      : 0;

  // Teacher supervised set
  const supervisedTeacherIds = new Set(supervisions.map((s) => s.guruId));
  const guruBelumDisupervisi = teachers.filter((t) => !supervisedTeacherIds.has(t.id)).length;

  // Follow-up pending
  const tindakLanjutBelumSelesai = supervisions.filter(
    (s) => s.tindakLanjut && s.tindakLanjut.status !== 'Selesai'
  ).length;

  // Category counts
  const categoryCounts = {
    'Sangat Baik': supervisions.filter((s) => s.kategori === 'Sangat Baik').length,
    Baik: supervisions.filter((s) => s.kategori === 'Baik').length,
    Cukup: supervisions.filter((s) => s.kategori === 'Cukup').length,
    Kurang: supervisions.filter((s) => s.kategori === 'Kurang').length,
  };

  // Monthly breakdown for current year
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthlyData = months.map((m, idx) => {
    const count = supervisions.filter((s) => {
      const d = new Date(s.tanggalSupervisi);
      return d.getMonth() === idx;
    }).length;
    return { month: m, count };
  });
  const maxMonthly = Math.max(...monthlyData.map((d) => d.count), 1);

  // Indicators needing most improvement (score 1 or 2)
  const indicatorWeaknessMap: Record<number, { countLess: number; ind: typeof DEFAULT_INDICATORS[0] }> = {};
  DEFAULT_INDICATORS.forEach((ind) => {
    let lessCount = 0;
    supervisions.forEach((sup) => {
      const rating = sup.penilaian[ind.id];
      if (rating && (rating.score === 1 || rating.score === 2)) {
        lessCount += rating.score === 2 ? 2 : 1; // weighted
      }
    });
    indicatorWeaknessMap[ind.id] = { countLess: lessCount, ind };
  });

  const topWeaknesses = Object.values(indicatorWeaknessMap)
    .sort((a, b) => b.countLess - a.countLess)
    .filter((item) => item.countLess > 0)
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-linear-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-2xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 mb-2">
              Tahun Ajaran {currentTapel} • Semester {currentSemester}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Dashboard Supervisi Akademik
            </h2>
            <p className="text-emerald-100 text-sm mt-1 max-w-2xl leading-relaxed">
              Monitoring pelaksanaan pembelajaran Kurikulum Merdeka MA Darul Mahfudz Lekopadis. Penjaminan mutu akademik guru secara berkala, objektif, dan konstruktif.
            </p>
          </div>

          {/* Quick Actions Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('supervisi-baru')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              + Supervisi Baru
            </button>
            <button
              onClick={() => onNavigate('rekapitulasi')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-xs border border-white/20 transition-all cursor-pointer"
            >
              <BarChart3 className="w-4 h-4" />
              Rekapitulasi
            </button>
            <button
              onClick={() => onNavigate('laporan-semester')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-xs border border-white/20 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Cetak Laporan
            </button>
          </div>
        </div>
      </div>

      {/* 7 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
        {/* Card 1: Guru */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-2xs font-bold uppercase tracking-wider">Jumlah Guru</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalGuru}</div>
          <p className="text-2xs text-slate-400 mt-0.5">Pendidik aktif</p>
        </div>

        {/* Card 2: Supervisi */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-2xs font-bold uppercase tracking-wider">Total Supervisi</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalSupervisi}</div>
          <p className="text-2xs text-slate-400 mt-0.5">Semua dokumen</p>
        </div>

        {/* Card 3: Bulan Ini */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-2xs font-bold uppercase tracking-wider">Bulan Ini</span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{supervisiBulanIni}</div>
          <p className="text-2xs text-slate-400 mt-0.5">{months[currentMonth]} {currentYear}</p>
        </div>

        {/* Card 4: Semester Ini */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-2xs font-bold uppercase tracking-wider">Semester Ini</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{supervisiSemesterIni}</div>
          <p className="text-2xs text-slate-400 mt-0.5">{currentSemester} {currentTapel}</p>
        </div>

        {/* Card 5: Rata-rata Nilai */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-2xs font-bold uppercase tracking-wider">Rata-rata Nilai</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-800">{rataNilai}%</div>
          <p className="text-2xs text-emerald-600 font-semibold mt-0.5">
            {rataNilai >= 91 ? 'Sangat Baik' : rataNilai >= 81 ? 'Baik' : rataNilai >= 71 ? 'Cukup' : 'Kurang'}
          </p>
        </div>

        {/* Card 6: Belum Disupervisi */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-2xs font-bold uppercase tracking-wider">Belum Supervisi</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">{guruBelumDisupervisi}</div>
          <p className="text-2xs text-slate-400 mt-0.5">Target semester</p>
        </div>

        {/* Card 7: Tindak Lanjut */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-2xs font-bold uppercase tracking-wider">Tindak Lanjut</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-700">{tindakLanjutBelumSelesai}</div>
          <p className="text-2xs text-slate-400 mt-0.5">Perlu tindak lanjut</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Monthly Trend Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">Grafik Supervisi Per Bulan</h3>
              <p className="text-xs text-slate-400">Distribusi pelaksanaan supervisi sepanjang tahun {currentYear}</p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-slate-100 text-slate-600">
              Total: {totalSupervisi} Kegiatan
            </span>
          </div>

          <div className="mt-6 flex items-end justify-between gap-1.5 sm:gap-3 h-48 pt-4 px-2">
            {monthlyData.map((d, i) => {
              const heightPct = d.count > 0 ? Math.max((d.count / maxMonthly) * 100, 15) : 6;
              const isCurr = i === currentMonth;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-2xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.count}
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[28px] rounded-t-lg transition-all ${
                      isCurr
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : d.count > 0
                        ? 'bg-emerald-800/70 hover:bg-emerald-800'
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  />
                  <span className={`text-2xs ${isCurr ? 'font-bold text-emerald-800' : 'text-slate-400'}`}>
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Category Distribution */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">Kategori Hasil Supervisi</h3>
              <p className="text-xs text-slate-400">Predikat pencapaian mutu guru</p>
            </div>

            <div className="mt-4 space-y-3">
              {/* Sangat Baik */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    Sangat Baik (91–100)
                  </span>
                  <span className="text-slate-700">{categoryCounts['Sangat Baik']} Guru</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{
                      width: totalSupervisi ? `${(categoryCounts['Sangat Baik'] / totalSupervisi) * 100}%` : '0%',
                    }}
                  />
                </div>
              </div>

              {/* Baik */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-blue-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    Baik (81–90)
                  </span>
                  <span className="text-slate-700">{categoryCounts.Baik} Guru</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: totalSupervisi ? `${(categoryCounts.Baik / totalSupervisi) * 100}%` : '0%',
                    }}
                  />
                </div>
              </div>

              {/* Cukup */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Cukup (71–80)
                  </span>
                  <span className="text-slate-700">{categoryCounts.Cukup} Guru</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width: totalSupervisi ? `${(categoryCounts.Cukup / totalSupervisi) * 100}%` : '0%',
                    }}
                  />
                </div>
              </div>

              {/* Kurang */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-rose-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    Kurang (&lt; 71)
                  </span>
                  <span className="text-slate-700">{categoryCounts.Kurang} Guru</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{
                      width: totalSupervisi ? `${(categoryCounts.Kurang / totalSupervisi) * 100}%` : '0%',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => onNavigate('rekapitulasi')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
            >
              Lihat Rekapitulasi Rinci <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Top Improvement Areas & Recent Supervisions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Improvement Need from 38 Indicators */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                Prioritas Pembinaan Guru (Aspek Butuh Perhatian)
              </h3>
              <p className="text-xs text-slate-400">
                Indikator yang paling sering mendapatkan nilai Kurang / Perlu Peningkatan
              </p>
            </div>
            <button
              onClick={() => onNavigate('analisis-indikator')}
              className="text-xs font-semibold text-emerald-800 hover:underline"
            >
              Analisis Lengkap
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {topWeaknesses.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Belum ada data indikator yang perlu perhatian.
              </div>
            ) : (
              topWeaknesses.map((item, idx) => (
                <div
                  key={item.ind.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-2xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-2xs font-bold text-slate-400">
                          {item.ind.sectionTitle} • Indikator #{item.ind.number}
                        </div>
                        <div className="text-xs font-semibold text-slate-800 mt-0.5 leading-snug">
                          {item.ind.aspekYangDiamati}
                        </div>
                      </div>
                    </div>
                    <span className="shrink-0 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-2xs font-bold">
                      {item.countLess} catatan
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Supervisions List */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">Aktivitas Supervisi Terkini</h3>
              <p className="text-xs text-slate-400">Dokumen supervisi yang baru diselesaikan atau sedang draft</p>
            </div>
            <button
              onClick={() => onNavigate('arsip-supervisi')}
              className="text-xs font-semibold text-emerald-800 hover:underline"
            >
              Lihat Semua ({totalSupervisi})
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {supervisions.slice(0, 4).map((s) => (
              <div
                key={s.id}
                onClick={() => onSelectSupervision(s.id)}
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{s.namaGuru}</span>
                    <span
                      className={`text-2xs px-1.5 py-0.2 rounded font-semibold ${
                        s.status === 'FINAL'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                  <div className="text-2xs text-slate-500 mt-0.5">
                    {s.mataPelajaran} • {s.kelas} • {s.tanggalSupervisi}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-emerald-800">{s.nilaiAkhir}%</div>
                  <div className="text-2xs font-medium text-slate-400">{s.kategori}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
