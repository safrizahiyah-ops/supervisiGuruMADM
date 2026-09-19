import React, { useState } from 'react';
import { Supervision, MadrasahIdentity } from '../types/supervisi';
import { DEFAULT_INDICATORS } from '../data/defaultData';
import { generateSupervisionDocx, downloadBlob } from '../services/exportDocx';
import {
  ArrowLeft,
  Edit,
  Printer,
  FileDown,
  Copy,
  CheckCircle,
  Share2,
  AlertCircle,
  School,
} from 'lucide-react';

interface SupervisiPreviewProps {
  supervision: Supervision;
  madrasah: MadrasahIdentity;
  onBack: () => void;
  onEdit: (supervision: Supervision) => void;
  onDuplicate: (id: string) => void;
}

export const SupervisiPreview: React.FC<SupervisiPreviewProps> = ({
  supervision,
  madrasah,
  onBack,
  onEdit,
  onDuplicate,
}) => {
  const [isGeneratingWord, setIsGeneratingWord] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadWord = async () => {
    setIsGeneratingWord(true);
    try {
      const blob = await generateSupervisionDocx(supervision, madrasah);
      const cleanName = supervision.namaGuru.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `Instrumen_Supervisi_${cleanName}_${supervision.tanggalSupervisi}.docx`;
      downloadBlob(blob, filename);
      setToastMessage('Dokumen Word (.docx) berhasil diunduh!');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error(err);
      alert('Gagal membuat dokumen Word. Periksa konfigurasi peramban.');
    } finally {
      setIsGeneratingWord(false);
    }
  };

  const handleDownloadPdf = () => {
    // Window print with Save as PDF option
    window.print();
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-emerald-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Control Bar (Hidden when printed) */}
      <div className="no-print bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 sticky top-24 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
          <span className="text-xs text-slate-400 hidden sm:inline">|</span>
          <span className="text-xs font-bold text-slate-800">
            Preview Dokumen Formal Cetak: {supervision.nomorDokumen}
          </span>
          <span
            className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
              supervision.status === 'FINAL'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {supervision.status}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onEdit(supervision)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
          >
            <Edit className="w-3.5 h-3.5" /> Edit
          </button>

          <button
            onClick={() => onDuplicate(supervision.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
            title="Salin data untuk supervisi berikutnya"
          >
            <Copy className="w-3.5 h-3.5" /> Duplikat
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Cetak / Print
          </button>

          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold cursor-pointer shadow-xs transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" /> Download PDF
          </button>

          <button
            onClick={handleDownloadWord}
            disabled={isGeneratingWord}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold cursor-pointer shadow-xs transition-colors disabled:opacity-50"
          >
            <FileDown className="w-3.5 h-3.5" />
            {isGeneratingWord ? 'Memproses Word...' : 'Download Word (.docx)'}
          </button>
        </div>
      </div>

      {/* Actual Paper Printable View (A4 Format) */}
      <div id="print-area" className="paper-a4 text-black bg-white">
        {/* KOP MADRASAH */}
        <div className="kop-madrasah pb-3 border-b-4 border-double border-black text-center relative mb-5">
          {/* Logo MA Darul Mahfudz */}
          <div className="absolute left-1 top-0 w-20 h-20 flex items-center justify-center">
            {madrasah.logoUrl ? (
              <img
                src={madrasah.logoUrl}
                alt={madrasah.namaMadrasah}
                className="max-h-20 max-w-20 object-contain"
              />
            ) : (
              <School className="w-16 h-16 text-emerald-900" />
            )}
          </div>

          <div className="px-24">
            <h3 className="font-bold text-sm tracking-wide leading-tight">
              {madrasah.namaYayasan.toUpperCase()}
            </h3>
            <h1 className="font-extrabold text-xl tracking-wider leading-tight text-black my-0.5">
              {madrasah.namaMadrasah.toUpperCase()}
            </h1>
            <p className="text-2xs text-black leading-tight">
              {madrasah.alamat}, Desa/Kel. {madrasah.desaKelurahan}, Kec. {madrasah.kecamatan}, Kab. {madrasah.kabupaten}, Prov. {madrasah.provinsi}
            </p>
            <p className="text-3xs text-black italic leading-tight mt-0.5">
              NSM: {madrasah.nsm} | NPSN: {madrasah.npsn} | Email: {madrasah.email} | Telp: {madrasah.telepon}
            </p>
          </div>
        </div>

        {/* Document Header Title */}
        <div className="text-center mb-5">
          <h2 className="text-base font-bold underline tracking-wide uppercase">
            INSTRUMEN SUPERVISI AKADEMIK
          </h2>
          <h3 className="text-sm font-bold uppercase mt-0.5">
            SUPERVISI PELAKSANAAN PEMBELAJARAN (KURIKULUM MERDEKA)
          </h3>
          <p className="text-xs font-mono mt-0.5">Nomor: {supervision.nomorDokumen}</p>
        </div>

        {/* Teacher & Supervision Metadata */}
        <div className="mb-5 text-xs">
          <table className="w-full border-none border-collapse">
            <tbody>
              <tr>
                <td className="w-28 font-bold border-none py-1">Nama Guru</td>
                <td className="border-none py-1">: {supervision.namaGuru}</td>
                <td className="w-28 font-bold border-none py-1">Hari, Tanggal</td>
                <td className="border-none py-1">: {supervision.tanggalSupervisi}</td>
              </tr>
              <tr>
                <td className="font-bold border-none py-1">NIP / NUPTK</td>
                <td className="border-none py-1">: {supervision.nipGuru || '-'} {supervision.nuptkGuru && supervision.nuptkGuru !== '-' ? `(NUPTK: ${supervision.nuptkGuru})` : ''}</td>
                <td className="font-bold border-none py-1">Semester / Tapel</td>
                <td className="border-none py-1">: {supervision.semester} / {supervision.tahunPelajaran}</td>
              </tr>
              <tr>
                <td className="font-bold border-none py-1">Pendidikan / Jabatan</td>
                <td className="border-none py-1">: {supervision.pendidikanGuru || '-'} / {supervision.jabatanGuru || 'Guru Mapel'}</td>
                <td className="font-bold border-none py-1">Status Pegawai</td>
                <td className="border-none py-1">: {supervision.statusKepegawaianGuru || 'GTT / Non-PNS'}</td>
              </tr>
              <tr>
                <td className="font-bold border-none py-1">Mata Pelajaran</td>
                <td className="border-none py-1">: {supervision.mataPelajaran}</td>
                <td className="font-bold border-none py-1">Kelas / Jam Ke</td>
                <td className="border-none py-1">: {supervision.kelas} / {supervision.jamPelajaran}</td>
              </tr>
              <tr>
                <td className="font-bold border-none py-1">Materi / Topik</td>
                <td className="border-none py-1">: {supervision.materiTopik}</td>
                <td className="font-bold border-none py-1">Nama Supervisor</td>
                <td className="border-none py-1">: {supervision.namaSupervisor}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Table of 38 Indicators */}
        <div className="mb-6">
          <table className="w-full border-collapse border border-black text-2xs leading-tight">
            <thead>
              <tr className="bg-slate-100 text-center font-bold">
                <th className="border border-black p-1.5 w-8">NO</th>
                <th className="border border-black p-1.5 text-left">ASPEK YANG DIAMATI</th>
                <th className="border border-black p-1 w-12">
                  0<br /><span className="font-normal text-3xs">Lengkap</span>
                </th>
                <th className="border border-black p-1 w-12">
                  1<br /><span className="font-normal text-3xs">Kurang</span>
                </th>
                <th className="border border-black p-1 w-12">
                  2<br /><span className="font-normal text-3xs">Tidak</span>
                </th>
                <th className="border border-black p-1.5 w-36">CATATAN</th>
              </tr>
            </thead>
            <tbody>
              {/* Group Indicators by Section */}
              {['A', 'B', 'C'].map((sec) => {
                const sectionIndicators = DEFAULT_INDICATORS.filter((i) => i.section === sec);
                const sectionTitle = sectionIndicators[0]?.sectionTitle;

                return (
                  <React.Fragment key={sec}>
                    <tr className="bg-slate-50 font-bold">
                      <td colSpan={6} className="border border-black p-1.5 text-slate-900">
                        {sectionTitle}
                      </td>
                    </tr>
                    {sectionIndicators.map((ind) => {
                      const rating = supervision.penilaian[ind.id];
                      const score = rating?.score;

                      return (
                        <tr key={ind.id}>
                          <td className="border border-black p-1.5 text-center font-medium">
                            {ind.number}
                          </td>
                          <td className="border border-black p-1.5 text-justify">
                            {ind.aspekYangDiamati}
                          </td>
                          <td className="border border-black p-1 text-center font-bold text-sm">
                            {score === 0 ? '✓' : ''}
                          </td>
                          <td className="border border-black p-1 text-center font-bold text-sm">
                            {score === 1 ? '✓' : ''}
                          </td>
                          <td className="border border-black p-1 text-center font-bold text-sm">
                            {score === 2 ? '✓' : ''}
                          </td>
                          <td className="border border-black p-1.5 text-3xs italic text-slate-700">
                            {rating?.catatan || '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}

              {/* Total Row */}
              <tr className="bg-slate-100 font-bold">
                <td colSpan={2} className="border border-black p-1.5 text-right">
                  JUMLAH SKOR SESUAI PILIHAN
                </td>
                <td className="border border-black p-1 text-center font-bold text-xs">
                  {supervision.countScore0}
                </td>
                <td className="border border-black p-1 text-center font-bold text-xs">
                  {supervision.countScore1}
                </td>
                <td className="border border-black p-1 text-center font-bold text-xs">
                  {supervision.countScore2}
                </td>
                <td className="border border-black p-1.5 text-center text-3xs">
                  Total Indikator: 38
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Score Recapitulation Box */}
        <div className="mb-5 border border-black p-3 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between py-0.5">
                <span>Skor Perolehan:</span>
                <span className="font-bold">{supervision.totalSkorPerolehan}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span>Skor Maksimal:</span>
                <span>{supervision.skorMaksimal} (38 × 2)</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span>Metode Penilaian:</span>
                <span className="italic">
                  {supervision.evaluationMode === 'DOKUMEN_ASLI'
                    ? 'Dokumen Asli (Perolehan / 76 × 100)'
                    : 'Skor Kualitas (0→100, 1→50, 2→0)'}
                </span>
              </div>
            </div>

            <div className="border-l border-black pl-4 flex flex-col justify-center text-center">
              <div className="text-sm font-extrabold uppercase">
                NILAI AKHIR: {supervision.nilaiAkhir}%
              </div>
              <div className="text-base font-black text-black tracking-wide mt-0.5">
                KATEGORI: {supervision.kategori.toUpperCase()}
              </div>
              <div className="text-3xs text-slate-600 mt-1">
                Kriteria: 91–100 (Sangat Baik) | 81–90 (Baik) | 71–80 (Cukup) | &lt; 71 (Kurang)
              </div>
            </div>
          </div>
        </div>

        {/* Kesimpulan & Analisis Hasil Supervisi */}
        <div className="mb-5 text-xs space-y-3">
          <h4 className="font-bold uppercase text-xs border-b border-black pb-1">
            KESIMPULAN DAN ANALISIS HASIL SUPERVISI
          </h4>

          <div>
            <span className="font-bold block text-2xs mb-0.5">A. Aspek yang Sudah Baik:</span>
            <ul className="list-disc list-inside space-y-0.5 text-2xs text-slate-800 pl-2">
              {supervision.analisis?.aspekSudahBaik?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <span className="font-bold block text-2xs mb-0.5">B. Aspek yang Perlu Ditingkatkan:</span>
            {supervision.analisis?.aspekPerluDitingkatkan?.length === 0 ? (
              <p className="text-2xs italic pl-2">Seluruh indikator telah terpenuhi secara memadai.</p>
            ) : (
              <ul className="list-disc list-inside space-y-0.5 text-2xs text-slate-800 pl-2">
                {supervision.analisis?.aspekPerluDitingkatkan?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <span className="font-bold block text-2xs mb-0.5">C. Catatan & Rekomendasi Supervisor:</span>
            <p className="text-2xs text-slate-800 leading-relaxed pl-2">
              {supervision.catatanHasilSupervisi || supervision.rekomendasi || '-'}
            </p>
          </div>

          <div>
            <span className="font-bold block text-2xs mb-0.5">D. Rencana Tindak Lanjut:</span>
            <p className="text-2xs text-slate-800 pl-2">
              Bentuk: <strong>{supervision.tindakLanjut?.options?.join(', ') || 'Pembinaan Individu'}</strong> | 
              Target: {supervision.tindakLanjut?.targetDate || '-'} | 
              PIC: {supervision.tindakLanjut?.pic || '-'} | 
              Status: <strong>{supervision.tindakLanjut?.status || 'Belum Dilaksanakan'}</strong>
            </p>
            {supervision.tindakLanjut?.notes && (
              <p className="text-3xs italic text-slate-600 pl-2 mt-0.5">
                Catatan: {supervision.tindakLanjut.notes}
              </p>
            )}
          </div>
        </div>

        {/* Signatures Area */}
        <div className="mt-8 text-xs break-inside-avoid">
          <div className="grid grid-cols-2 gap-4 text-center">
            {/* Teacher Signature */}
            <div>
              <p>Mengetahui,</p>
              <p className="font-bold">Guru yang Disupervisi</p>
              <div className="h-20 flex items-center justify-center my-1">
                {supervision.signature?.useDigitalSignature && supervision.signature?.teacherSignature ? (
                  <img
                    src={supervision.signature.teacherSignature}
                    alt="Tanda Tangan Guru"
                    className="max-h-20 max-w-36 object-contain"
                  />
                ) : (
                  <div className="h-16" />
                )}
              </div>
              <p className="font-bold underline">{supervision.namaGuru}</p>
              <p className="text-3xs">NIP. {supervision.nipGuru || '-'}</p>
            </div>

            {/* Supervisor Signature */}
            <div>
              <p>{madrasah.kabupaten}, {supervision.tanggalSupervisi}</p>
              <p className="font-bold">Supervisor Akademik,</p>
              <div className="h-20 flex items-center justify-center my-1">
                {supervision.signature?.useDigitalSignature && supervision.signature?.supervisorSignature ? (
                  <img
                    src={supervision.signature.supervisorSignature}
                    alt="Tanda Tangan Supervisor"
                    className="max-h-20 max-w-36 object-contain"
                  />
                ) : (
                  <div className="h-16" />
                )}
              </div>
              <p className="font-bold underline">{supervision.namaSupervisor}</p>
              <p className="text-3xs">NIP. {supervision.nipSupervisor || '-'}</p>
            </div>
          </div>

          {/* Principal Approval Signature */}
          <div className="text-center mt-6">
            <p>Mengetahui / Mengesahkan,</p>
            <p className="font-bold">Kepala MA Darul Mahfudz</p>
            <div className="h-20 flex items-center justify-center my-1">
              <div className="h-16" />
            </div>
            <p className="font-bold underline">{madrasah.namaKepalaMadrasah}</p>
            <p className="text-3xs">NIP. {madrasah.nipKepalaMadrasah}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
