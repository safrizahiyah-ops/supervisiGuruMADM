import React, { useState, useEffect, useMemo } from 'react';
import {
  Supervision,
  Teacher,
  Subject,
  SchoolClass,
  IndicatorScore,
  EvaluationMode,
  SupervisionType,
  FollowUpStatus,
} from '../types/supervisi';
import { DEFAULT_INDICATORS, computeSupervisionMetrics } from '../data/defaultData';
import { storageService } from '../services/storageService';
import { SignaturePadModal } from './SignaturePadModal';
import {
  Save,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  PenTool,
  Printer,
  FileDown,
  Info,
  Calendar,
  User,
  BookOpen,
  GraduationCap,
  Clock,
  Sparkles,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface SupervisiFormProps {
  initialSupervision?: Supervision | null;
  teachers: Teacher[];
  subjects: Subject[];
  classes: SchoolClass[];
  currentSupervisorName: string;
  currentSupervisorNip: string;
  onSaveSuccess: (saved: Supervision) => void;
  onCancel: () => void;
  onPreviewRequested: (supervision: Supervision) => void;
}

export const SupervisiForm: React.FC<SupervisiFormProps> = ({
  initialSupervision,
  teachers,
  subjects,
  classes,
  currentSupervisorName,
  currentSupervisorNip,
  onSaveSuccess,
  onCancel,
  onPreviewRequested,
}) => {
  const settings = storageService.getSettings();

  // Wizard steps: 1: Identitas, 2: Instrumen (38), 3: Catatan, 4: Nilai & Analisis, 5: Tindak Lanjut, 6: Tanda Tangan
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [nomorDokumen, setNomorDokumen] = useState<string>('');
  const [tanggalSupervisi, setTanggalSupervisi] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>(settings.currentSemester || 'Ganjil');
  const [tahunPelajaran, setTahunPelajaran] = useState<string>(
    settings.currentTahunPelajaran || '2026/2027'
  );
  const [guruId, setGuruId] = useState<string>('');
  const [namaGuru, setNamaGuru] = useState<string>('');
  const [nipGuru, setNipGuru] = useState<string>('');
  const [nuptkGuru, setNuptkGuru] = useState<string>('');
  const [pendidikanGuru, setPendidikanGuru] = useState<string>('');
  const [jabatanGuru, setJabatanGuru] = useState<string>('');
  const [statusKepegawaianGuru, setStatusKepegawaianGuru] = useState<string>('');
  const [kontakGuru, setKontakGuru] = useState<string>('');
  const [mataPelajaran, setMataPelajaran] = useState<string>('');
  const [kelas, setKelas] = useState<string>('');
  const [jamPelajaran, setJamPelajaran] = useState<string>('1-2 (07.30 - 09.00 WITA)');
  const [materiTopik, setMateriTopik] = useState<string>('');
  const [namaSupervisor, setNamaSupervisor] = useState<string>(currentSupervisorName);
  const [nipSupervisor, setNipSupervisor] = useState<string>(currentSupervisorNip);
  const [jenisSupervisi, setJenisSupervisi] = useState<SupervisionType>('Supervisi Pembelajaran');

  // Penilaian 38 indicators
  const [penilaian, setPenilaian] = useState<Record<number, IndicatorScore>>({});

  // Catatan Supervisor
  const [catatanHasilSupervisi, setCatatanHasilSupervisi] = useState<string>('');
  const [kelebihanGuru, setKelebihanGuru] = useState<string>('');
  const [halPerluDitingkatkan, setHalPerluDitingkatkan] = useState<string>('');
  const [rekomendasi, setRekomendasi] = useState<string>('');

  // Mode penilaian
  const [evaluationMode, setEvaluationMode] = useState<EvaluationMode>(
    settings.evaluationModeDefault || 'DOKUMEN_ASLI'
  );

  // Tindak Lanjut
  const [tindakLanjutOptions, setTindakLanjutOptions] = useState<string[]>([
    'Pembinaan individu',
  ]);
  const [tindakLanjutDate, setTindakLanjutDate] = useState<string>('');
  const [tindakLanjutPic, setTindakLanjutPic] = useState<string>(currentSupervisorName);
  const [tindakLanjutStatus, setTindakLanjutStatus] = useState<FollowUpStatus>(
    'Belum Dilaksanakan'
  );
  const [tindakLanjutNotes, setTindakLanjutNotes] = useState<string>('');

  // Tanda Tangan
  const [useDigitalSignature, setUseDigitalSignature] = useState<boolean>(true);
  const [supervisorSignature, setSupervisorSignature] = useState<string | undefined>(undefined);
  const [teacherSignature, setTeacherSignature] = useState<string | undefined>(undefined);

  // Modal Signature Pad state
  const [sigPadTarget, setSigPadTarget] = useState<'supervisor' | 'teacher' | null>(null);

  // Validation state
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationModal, setShowValidationModal] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Filter indicator section in step 2
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<'ALL' | 'A' | 'B' | 'C'>('ALL');

  // Initialize or populate from initialSupervision
  useEffect(() => {
    if (initialSupervision) {
      setNomorDokumen(initialSupervision.nomorDokumen);
      setTanggalSupervisi(initialSupervision.tanggalSupervisi);
      setSemester(initialSupervision.semester);
      setTahunPelajaran(initialSupervision.tahunPelajaran);
      setGuruId(initialSupervision.guruId);
      setNamaGuru(initialSupervision.namaGuru);
      setNipGuru(initialSupervision.nipGuru);
      setNuptkGuru(initialSupervision.nuptkGuru || '');
      setPendidikanGuru(initialSupervision.pendidikanGuru || '');
      setJabatanGuru(initialSupervision.jabatanGuru || '');
      setStatusKepegawaianGuru(initialSupervision.statusKepegawaianGuru || '');
      setKontakGuru(initialSupervision.kontakGuru || '');
      setMataPelajaran(initialSupervision.mataPelajaran);
      setKelas(initialSupervision.kelas);
      setJamPelajaran(initialSupervision.jamPelajaran);
      setMateriTopik(initialSupervision.materiTopik);
      setNamaSupervisor(initialSupervision.namaSupervisor);
      setNipSupervisor(initialSupervision.nipSupervisor);
      setJenisSupervisi(initialSupervision.jenisSupervisi);
      setPenilaian(initialSupervision.penilaian || {});
      setEvaluationMode(initialSupervision.evaluationMode || 'DOKUMEN_ASLI');
      setCatatanHasilSupervisi(initialSupervision.catatanHasilSupervisi || '');
      setKelebihanGuru(initialSupervision.kelebihanGuru || '');
      setHalPerluDitingkatkan(initialSupervision.halPerluDitingkatkan || '');
      setRekomendasi(initialSupervision.rekomendasi || '');

      if (initialSupervision.tindakLanjut) {
        setTindakLanjutOptions(initialSupervision.tindakLanjut.options || []);
        setTindakLanjutDate(initialSupervision.tindakLanjut.targetDate || '');
        setTindakLanjutPic(initialSupervision.tindakLanjut.pic || '');
        setTindakLanjutStatus(initialSupervision.tindakLanjut.status || 'Belum Dilaksanakan');
        setTindakLanjutNotes(initialSupervision.tindakLanjut.notes || '');
      }

      if (initialSupervision.signature) {
        setUseDigitalSignature(initialSupervision.signature.useDigitalSignature);
        setSupervisorSignature(initialSupervision.signature.supervisorSignature);
        setTeacherSignature(initialSupervision.signature.teacherSignature);
      }
    } else {
      // Auto-generate document number
      setNomorDokumen(storageService.generateNextDocumentNumber());
      // Set first teacher if available
      if (teachers.length > 0) {
        handleSelectTeacher(teachers[0].id);
      }
      if (classes.length > 0) {
        setKelas(classes[0].rombel);
      }
    }
  }, [initialSupervision]);

  const handleSelectTeacher = (tId: string) => {
    const t = teachers.find((x) => x.id === tId);
    if (t) {
      setGuruId(t.id);
      setNamaGuru(t.nama);
      setNipGuru(t.nip && t.nip !== '-' ? t.nip : t.nuptk || '-');
      setNuptkGuru(t.nuptk || '-');
      setPendidikanGuru(t.pendidikanTerakhir || '-');
      setJabatanGuru(t.jabatan || 'Guru Mata Pelajaran');
      setStatusKepegawaianGuru(t.statusKepegawaian || 'GTT / Non-PNS');
      setKontakGuru(t.nomorHp || t.email || '-');
      setMataPelajaran(t.mataPelajaranUtama || (subjects[0]?.nama ?? ''));
    }
  };

  // Handle score change for an indicator
  const handleScoreChange = (indicatorId: number, score: 0 | 1 | 2) => {
    setPenilaian((prev) => ({
      ...prev,
      [indicatorId]: {
        indicatorId,
        score,
        catatan: prev[indicatorId]?.catatan || '',
      },
    }));
  };

  const handleNoteChange = (indicatorId: number, catatan: string) => {
    setPenilaian((prev) => ({
      ...prev,
      [indicatorId]: {
        indicatorId,
        score: prev[indicatorId]?.score ?? 0,
        catatan,
      },
    }));
  };

  // Compute live metrics
  const liveMetrics = useMemo(() => {
    return computeSupervisionMetrics(penilaian, evaluationMode);
  }, [penilaian, evaluationMode]);

  // Total rated indicators count
  const ratedCount = useMemo(() => {
    return Object.keys(penilaian).length;
  }, [penilaian]);

  const completionPct = Math.round((ratedCount / 38) * 100);

  // Missing indicators list
  const missingIndicators = useMemo(() => {
    return DEFAULT_INDICATORS.filter((ind) => penilaian[ind.id] === undefined);
  }, [penilaian]);

  // Construct current supervision object
  const buildSupervisionObject = (status: 'DRAFT' | 'FINAL'): Supervision => {
    return {
      id: initialSupervision?.id || `sup-${Date.now()}`,
      nomorDokumen: nomorDokumen || storageService.generateNextDocumentNumber(),
      tanggalSupervisi,
      semester,
      tahunPelajaran,
      guruId,
      namaGuru: namaGuru || 'Nama Guru',
      nipGuru: nipGuru || '-',
      nuptkGuru,
      pendidikanGuru,
      jabatanGuru,
      statusKepegawaianGuru,
      kontakGuru,
      mataPelajaran: mataPelajaran || 'Mata Pelajaran',
      kelas: kelas || 'Kelas',
      jamPelajaran,
      materiTopik: materiTopik || 'Materi Pokok Pembelajaran',
      namaSupervisor: namaSupervisor || currentSupervisorName,
      nipSupervisor: nipSupervisor || currentSupervisorNip,
      jenisSupervisi,
      penilaian,
      evaluationMode,
      countScore0: liveMetrics.countScore0,
      countScore1: liveMetrics.countScore1,
      countScore2: liveMetrics.countScore2,
      totalSkorPerolehan: liveMetrics.totalSkorPerolehan,
      skorMaksimal: liveMetrics.skorMaksimal,
      nilaiAkhir: liveMetrics.nilaiAkhir,
      kategori: liveMetrics.kategori,
      catatanHasilSupervisi,
      kelebihanGuru,
      halPerluDitingkatkan,
      rekomendasi,
      analisis: liveMetrics.analisis,
      tindakLanjut: {
        options: tindakLanjutOptions,
        targetDate: tindakLanjutDate,
        pic: tindakLanjutPic,
        status: tindakLanjutStatus,
        notes: tindakLanjutNotes,
      },
      signature: {
        useDigitalSignature,
        supervisorSignature,
        teacherSignature,
        supervisorName: namaSupervisor,
        supervisorNip: nipSupervisor,
        teacherName: namaGuru,
        teacherNip: nipGuru,
        supervisorSignDate: tanggalSupervisi,
        teacherSignDate: tanggalSupervisi,
      },
      status,
      approvedByKamad: initialSupervision?.approvedByKamad ?? false,
      approvalDate: initialSupervision?.approvalDate,
      createdAt: initialSupervision?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  // Save as Draft
  const handleSaveDraft = () => {
    const draft = buildSupervisionObject('DRAFT');
    storageService.saveSupervision(draft);
    setSaveToast('Draft supervisi berhasil disimpan!');
    setTimeout(() => {
      setSaveToast(null);
      onSaveSuccess(draft);
    }, 1200);
  };

  // Finalize Supervision
  const handleFinalize = () => {
    // Validate all 38 indicators
    if (missingIndicators.length > 0) {
      setValidationErrors(
        missingIndicators.map((m) => `Indikator #${m.number}: ${m.aspekYangDiamati}`)
      );
      setShowValidationModal(true);
      return;
    }

    if (!materiTopik.trim()) {
      alert('Mohon isi Materi/Topik/Tema pembelajaran terlebih dahulu.');
      setCurrentStep(1);
      return;
    }

    const finalRecord = buildSupervisionObject('FINAL');
    storageService.saveSupervision(finalRecord);
    setSaveToast('Supervisi berhasil difinalisasi!');
    setTimeout(() => {
      setSaveToast(null);
      onSaveSuccess(finalRecord);
    }, 1200);
  };

  // Quick fill demo/sample rating for all 38 indicators (useful when supervisor wants a quick baseline)
  const handleQuickFillBaseline = (defaultScore: 0 | 1 = 0) => {
    const updated: Record<number, IndicatorScore> = {};
    DEFAULT_INDICATORS.forEach((ind) => {
      updated[ind.id] = {
        indicatorId: ind.id,
        score: defaultScore,
        catatan: defaultScore === 0 ? 'Terlaksana sesuai indikator.' : 'Perlu penyempurnaan media/tahapan.',
      };
    });
    setPenilaian(updated);
  };

  const followUpCheckboxOptions = [
    'Pembinaan individu',
    'Diskusi dengan Kepala Madrasah',
    'Pendampingan pembelajaran',
    'Observasi ulang',
    'Pelatihan',
    'Lesson Study',
    'Berbagi praktik baik',
    'Supervisi lanjutan',
    'Lainnya',
  ];

  const stepsList = [
    { num: 1, label: 'Identitas Supervisi' },
    { num: 2, label: '38 Indikator KBM' },
    { num: 3, label: 'Catatan Supervisor' },
    { num: 4, label: 'Nilai & Analisis' },
    { num: 5, label: 'Rencana Tindak Lanjut' },
    { num: 6, label: 'Tanda Tangan & Selesai' },
  ];

  const filteredIndicators = DEFAULT_INDICATORS.filter((ind) => {
    if (selectedSectionFilter === 'ALL') return true;
    return ind.section === selectedSectionFilter;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-emerald-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{saveToast}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              {initialSupervision ? 'Edit Dokumen Supervisi' : 'Instrumen Supervisi Akademik Baru'}
            </h2>
            <span
              className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                ratedCount === 38
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {ratedCount}/38 Indikator Dinilai ({completionPct}%)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Supervisi Pelaksanaan Pembelajaran Kurikulum Merdeka • MA Darul Mahfudz
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4 text-slate-500" />
            Simpan Draft
          </button>

          <button
            type="button"
            onClick={() => onPreviewRequested(buildSupervisionObject('DRAFT'))}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            Preview Cetak
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-medium cursor-pointer"
          >
            Kembali
          </button>
        </div>
      </div>

      {/* Step Wizard Nav */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between overflow-x-auto gap-2 py-1">
          {stepsList.map((step) => {
            const isActive = currentStep === step.num;
            const isCompleted = currentStep > step.num;

            return (
              <button
                key={step.num}
                onClick={() => setCurrentStep(step.num)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                    : 'text-slate-400 hover:bg-slate-100'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-2xs font-extrabold ${
                    isActive
                      ? 'bg-white text-emerald-900'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? '✓' : step.num}
                </span>
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-emerald-600 h-1.5 transition-all duration-300 rounded-full"
            style={{ width: `${((currentStep - 1) / (stepsList.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* ==================== STEP 1: IDENTITAS SUPERVISI ==================== */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-800">Langkah 1: Identitas Dokumen & Pembelajaran</h3>
            <p className="text-xs text-slate-400">
              Lengkapi data administrasi supervisi pelaksanaan KBM
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Nomor Dokumen */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Dokumen (Otomatis)</label>
              <input
                type="text"
                value={nomorDokumen}
                onChange={(e) => setNomorDokumen(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500"
                placeholder="SUP/AMD/001/IX/2026"
              />
            </div>

            {/* Tanggal Supervisi */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Supervisi</label>
              <input
                type="date"
                value={tanggalSupervisi}
                onChange={(e) => setTanggalSupervisi(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Semester & Tapel */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value as 'Ganjil' | 'Genap')}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tahun Pelajaran</label>
                <input
                  type="text"
                  value={tahunPelajaran}
                  onChange={(e) => setTahunPelajaran(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Guru Picker */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Guru yang Disupervisi</label>
              <select
                value={guruId}
                onChange={(e) => handleSelectTeacher(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nama} ({t.mataPelajaranUtama})
                  </option>
                ))}
              </select>
            </div>

            {/* Live Connected Teacher Metadata Details */}
            <div className="sm:col-span-2 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 text-2xs">
              <div className="font-bold text-emerald-900 mb-2 flex items-center justify-between">
                <span>Data Guru Terhubung Otomatis dari Master Pendidik:</span>
                <span className="text-3xs bg-emerald-200/80 px-2 py-0.5 rounded-full text-emerald-800">Tersinkronisasi</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-3xs">NUPTK</span>
                  <span className="font-bold text-slate-800 font-mono">{nuptkGuru || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-3xs">Pendidikan</span>
                  <span className="font-bold text-slate-800">{pendidikanGuru || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-3xs">Jabatan</span>
                  <span className="font-bold text-slate-800">{jabatanGuru || 'Guru Mapel'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-3xs">Status Kepegawaian</span>
                  <span className="font-bold text-emerald-900">{statusKepegawaianGuru || '-'}</span>
                </div>
              </div>
              {kontakGuru && kontakGuru !== '-' && (
                <div className="mt-2 pt-2 border-t border-emerald-100 text-3xs text-slate-500">
                  Kontak: <span className="font-mono font-semibold text-slate-700">{kontakGuru}</span>
                </div>
              )}
            </div>

            {/* NIP Guru */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">NIP Guru</label>
              <input
                type="text"
                value={nipGuru}
                onChange={(e) => setNipGuru(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            {/* Mata Pelajaran */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran</label>
              <select
                value={mataPelajaran}
                onChange={(e) => setMataPelajaran(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.nama}>
                    {sub.nama} ({sub.kelompok})
                  </option>
                ))}
              </select>
            </div>

            {/* Kelas */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kelas / Rombel</label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.rombel}>
                    {c.rombel}
                  </option>
                ))}
              </select>
            </div>

            {/* Jam Pelajaran */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Jam Pelajaran Ke / Waktu</label>
              <input
                type="text"
                value={jamPelajaran}
                onChange={(e) => setJamPelajaran(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                placeholder="1-2 (07.30 - 09.00 WITA)"
              />
            </div>

            {/* Jenis Supervisi */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Jenis Supervisi</label>
              <select
                value={jenisSupervisi}
                onChange={(e) => setJenisSupervisi(e.target.value as SupervisionType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Supervisi Pembelajaran">Supervisi Pembelajaran</option>
                <option value="Supervisi Akademik">Supervisi Akademik</option>
                <option value="Supervisi Tindak Lanjut">Supervisi Tindak Lanjut</option>
              </select>
            </div>

            {/* Supervisor Info */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Supervisor</label>
              <input
                type="text"
                value={namaSupervisor}
                onChange={(e) => setNamaSupervisor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">NIP Supervisor</label>
              <input
                type="text"
                value={nipSupervisor}
                onChange={(e) => setNipSupervisor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Metode Penilaian */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Metode Penilaian</label>
              <select
                value={evaluationMode}
                onChange={(e) => setEvaluationMode(e.target.value as EvaluationMode)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              >
                <option value="DOKUMEN_ASLI">Mode 1: Dokumen Asli (Skor/76 × 100)</option>
                <option value="SKOR_KUALITAS">Mode 2: Skor Kualitas (0→100, 1→50, 2→0)</option>
              </select>
            </div>
          </div>

          {/* Materi/Topik/Tema */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Materi Pokok / Topik / Tema Pembelajaran <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={materiTopik}
              onChange={(e) => setMateriTopik(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              placeholder="Contoh: Menelaah Struktur dan Kebahasaan Teks Eksplanasi Berbasis Masalah Nyata"
              required
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer"
            >
              Lanjut ke Instrumen (38 Indikator) <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== STEP 2: 38 INSTRUMEN INDIKATOR ==================== */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Langkah 2: Penilaian 38 Indikator Pelaksanaan Pembelajaran
              </h3>
              <p className="text-xs text-slate-400">
                Pilih: 0 = Sudah Lengkap/Sesuai (2 Poin) | 1 = Kurang Lengkap/Sesuai (1 Poin) | 2 = Tidak (0 Poin)
              </p>
            </div>

            {/* Quick Filter & Quick Fill */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-xl bg-slate-100 p-1 text-2xs font-semibold text-slate-600">
                <button
                  type="button"
                  onClick={() => setSelectedSectionFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg ${selectedSectionFilter === 'ALL' ? 'bg-white shadow-2xs text-emerald-800 font-bold' : ''}`}
                >
                  Semua (38)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSectionFilter('A')}
                  className={`px-2.5 py-1 rounded-lg ${selectedSectionFilter === 'A' ? 'bg-white shadow-2xs text-emerald-800 font-bold' : ''}`}
                >
                  A. Pendahuluan (7)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSectionFilter('B')}
                  className={`px-2.5 py-1 rounded-lg ${selectedSectionFilter === 'B' ? 'bg-white shadow-2xs text-emerald-800 font-bold' : ''}`}
                >
                  B. Inti (25)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSectionFilter('C')}
                  className={`px-2.5 py-1 rounded-lg ${selectedSectionFilter === 'C' ? 'bg-white shadow-2xs text-emerald-800 font-bold' : ''}`}
                >
                  C. Penutup (6)
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleQuickFillBaseline(0)}
                className="text-2xs px-2.5 py-1.5 rounded-lg border border-emerald-200 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-bold cursor-pointer"
                title="Isi seluruh indikator dengan nilai 0 (Sudah Lengkap)"
              >
                Setel Semua Sesuai (0)
              </button>
            </div>
          </div>

          {/* Live Score Bar on Top */}
          <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-500 font-medium">Terisi: </span>
                <span className="font-bold text-slate-800">{ratedCount} / 38</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Skor Total: </span>
                <span className="font-bold text-emerald-800">{liveMetrics.totalSkorPerolehan} / 76</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Nilai Akhir: </span>
                <span className="font-bold text-emerald-900">{liveMetrics.nilaiAkhir}%</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Kategori: </span>
                <span className="font-bold px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 text-2xs">
                  {liveMetrics.kategori}
                </span>
              </div>
            </div>

            <div className="text-2xs text-slate-500">
              0: {liveMetrics.countScore0} • 1: {liveMetrics.countScore1} • 2: {liveMetrics.countScore2}
            </div>
          </div>

          {/* Indicators List / Table */}
          <div className="space-y-4">
            {filteredIndicators.map((ind) => {
              const currentRating = penilaian[ind.id];
              const score = currentRating?.score;
              const isRated = currentRating !== undefined;

              return (
                <div
                  key={ind.id}
                  className={`p-4 rounded-xl border transition-all ${
                    !isRated
                      ? 'border-amber-300 bg-amber-50/30'
                      : score === 0
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : score === 1
                      ? 'border-blue-200 bg-blue-50/20'
                      : 'border-rose-200 bg-rose-50/20'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    {/* Indicator Description */}
                    <div className="flex items-start gap-3 flex-1">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {ind.number}
                      </span>
                      <div>
                        <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          {ind.sectionTitle}
                        </span>
                        <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                          {ind.aspekYangDiamati}
                        </p>
                      </div>
                    </div>

                    {/* Radio Options: 0, 1, 2 */}
                    <div className="flex items-center gap-2 shrink-0 pt-1">
                      {/* Option 0 */}
                      <label
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                          score === 0
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`ind-${ind.id}`}
                          checked={score === 0}
                          onChange={() => handleScoreChange(ind.id, 0)}
                          className="sr-only"
                        />
                        <span>0: Sesuai/Lengkap</span>
                      </label>

                      {/* Option 1 */}
                      <label
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                          score === 1
                            ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`ind-${ind.id}`}
                          checked={score === 1}
                          onChange={() => handleScoreChange(ind.id, 1)}
                          className="sr-only"
                        />
                        <span>1: Kurang</span>
                      </label>

                      {/* Option 2 */}
                      <label
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                          score === 2
                            ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`ind-${ind.id}`}
                          checked={score === 2}
                          onChange={() => handleScoreChange(ind.id, 2)}
                          className="sr-only"
                        />
                        <span>2: Tidak</span>
                      </label>
                    </div>
                  </div>

                  {/* Note textarea per indicator */}
                  <div className="mt-2.5 pl-10">
                    <input
                      type="text"
                      value={currentRating?.catatan || ''}
                      onChange={(e) => handleNoteChange(ind.id, e.target.value)}
                      placeholder="Tambahkan catatan khusus untuk indikator ini (opsional)..."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-2xs focus:ring-1 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Kembali
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer"
            >
              Lanjut ke Catatan Supervisor <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== STEP 3: CATATAN SUPERVISOR ==================== */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-800">Langkah 3: Catatan dan Rekomendasi Supervisor</h3>
            <p className="text-xs text-slate-400">
              Tuliskan catatan kualitatif, apresiasi, dan umpan balik pembinaan bagi guru
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Catatan Umum Hasil Supervisi Pelaksanaan Pembelajaran
              </label>
              <textarea
                rows={3}
                value={catatanHasilSupervisi}
                onChange={(e) => setCatatanHasilSupervisi(e.target.value)}
                placeholder="Deskripsikan iklim belajar kelas, respon siswa, dan keterlaksanaan modul ajar secara umum..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kelebihan dan Kekuatan Guru</label>
              <textarea
                rows={3}
                value={kelebihanGuru}
                onChange={(e) => setKelebihanGuru(e.target.value)}
                placeholder="Apresiasi aspek yang sudah sangat baik (misal: penguasaan materi, keramahan, pemanfaatan TIK, apersepsi kearifan lokal)..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Hal-Hal yang Perlu Ditingkatkan</label>
              <textarea
                rows={3}
                value={halPerluDitingkatkan}
                onChange={(e) => setHalPerluDitingkatkan(e.target.value)}
                placeholder="Tuliskan aspek pembelajaran yang memerlukan perhatian atau penyempurnaan..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Saran dan Rekomendasi</label>
              <textarea
                rows={3}
                value={rekomendasi}
                onChange={(e) => setRekomendasi(e.target.value)}
                placeholder="Rekomendasi taktis dan solutif yang dapat langsung dipraktikkan oleh guru..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Kembali
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer"
            >
              Lihat Perhitungan & Analisis Otomatis <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== STEP 4: HASIL, NILAI & ANALISIS OTOMATIS ==================== */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-800">Langkah 4: Rekapitulasi Skor & Analisis Otomatis</h3>
            <p className="text-xs text-slate-400">
              Sistem menghitung total perolehan skor dan menghasilkan rekomendasi berdasarkan 38 indikator
            </p>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-2xs font-bold text-slate-400 uppercase">Skor Perolehan</span>
              <div className="text-2xl font-black text-slate-800 mt-1">
                {liveMetrics.totalSkorPerolehan} / 76
              </div>
              <span className="text-2xs text-slate-500">Skor Maksimal: 76</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-2xs font-bold text-emerald-700 uppercase">Nilai Akhir</span>
              <div className="text-2xl font-black text-emerald-900 mt-1">
                {liveMetrics.nilaiAkhir}%
              </div>
              <span className="text-2xs text-emerald-700 font-semibold">{liveMetrics.kategori}</span>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-2xs font-bold text-blue-700 uppercase">Indikator 0 (Lengkap)</span>
              <div className="text-2xl font-black text-blue-900 mt-1">{liveMetrics.countScore0}</div>
              <span className="text-2xs text-blue-600">Poin: {liveMetrics.countScore0 * 2}</span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-2xs font-bold text-amber-700 uppercase">Indikator 1 & 2</span>
              <div className="text-2xl font-black text-amber-900 mt-1">
                {liveMetrics.countScore1 + liveMetrics.countScore2}
              </div>
              <span className="text-2xs text-amber-600">Kurang / Tidak</span>
            </div>
          </div>

          {/* Automatic Analysis Display */}
          <div className="space-y-4">
            {/* Aspek Sudah Baik */}
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
              <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                A. Aspek yang Sudah Baik
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {liveMetrics.analisis.aspekSudahBaik.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Aspek Perlu Ditingkatkan */}
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                B. Aspek yang Perlu Ditingkatkan
              </h4>
              {liveMetrics.analisis.aspekPerluDitingkatkan.length === 0 ? (
                <p className="text-xs text-emerald-800 italic">
                  Seluruh indikator telah terpenuhi secara optimal (Nilai 0).
                </p>
              ) : (
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {liveMetrics.analisis.aspekPerluDitingkatkan.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Rekomendasi Otomatis */}
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
              <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                C. Rekomendasi Tindak Lanjut Otomatis
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {liveMetrics.analisis.rekomendasi.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Kembali
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer"
            >
              Lanjut ke Rencana Tindak Lanjut <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== STEP 5: RENCANA TINDAK LANJUT ==================== */}
      {currentStep === 5 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-800">Langkah 5: Rencana Tindak Lanjut Supervisi</h3>
            <p className="text-xs text-slate-400">
              Tetapkan bentuk tindak lanjut pembinaan, tanggal target, penanggung jawab, dan status
            </p>
          </div>

          {/* Checklist Options */}
          <div>
            <label className="block font-bold text-slate-700 text-xs mb-2">
              Pilih Bentuk Tindak Lanjut:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
              {followUpCheckboxOptions.map((opt) => {
                const isChecked = tindakLanjutOptions.includes(opt);
                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'border-emerald-500 bg-emerald-50/60 font-semibold text-emerald-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTindakLanjutOptions((prev) => [...prev, opt]);
                        } else {
                          setTindakLanjutOptions((prev) => prev.filter((x) => x !== opt));
                        }
                      }}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Tanggal Tindak Lanjut</label>
              <input
                type="date"
                value={tindakLanjutDate}
                onChange={(e) => setTindakLanjutDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Penanggung Jawab (PIC)</label>
              <input
                type="text"
                value={tindakLanjutPic}
                onChange={(e) => setTindakLanjutPic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Status Pelaksanaan Tindak Lanjut</label>
              <select
                value={tindakLanjutStatus}
                onChange={(e) => setTindakLanjutStatus(e.target.value as FollowUpStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value="Belum Dilaksanakan">Belum Dilaksanakan</option>
                <option value="Dalam Proses">Dalam Proses</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 text-xs mb-1">
              Catatan Khusus Tindak Lanjut
            </label>
            <textarea
              rows={2}
              value={tindakLanjutNotes}
              onChange={(e) => setTindakLanjutNotes(e.target.value)}
              placeholder="Tuliskan catatan teknis pelaksanaan tindak lanjut, materi pelatihan, atau topik diskusi..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Kembali
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(6)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer"
            >
              Lanjut ke Tanda Tangan & Selesai <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== STEP 6: TANDA TANGAN & SELESAI ==================== */}
      {currentStep === 6 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-800">Langkah 6: Tanda Tangan Digital & Finalisasi</h3>
            <p className="text-xs text-slate-400">
              Lengkapi tanda tangan digital untuk dimasukkan ke dalam dokumen Word dan PDF
            </p>
          </div>

          {/* Toggle Digital Signature */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-800">Gunakan Tanda Tangan Digital</span>
              <p className="text-2xs text-slate-400">
                Jika dinonaktifkan, kolom tanda tangan dibiarkan kosong untuk ditandatangani manual setelah dicetak.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useDigitalSignature}
                onChange={(e) => setUseDigitalSignature(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
            </label>
          </div>

          {useDigitalSignature && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Supervisor Signature */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                    <div>
                      <span className="text-xs font-bold text-slate-800">Tanda Tangan Supervisor</span>
                      <p className="text-2xs text-slate-400">{namaSupervisor}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSigPadTarget('supervisor')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold cursor-pointer"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      {supervisorSignature ? 'Ubah' : 'Tanda Tangani'}
                    </button>
                  </div>

                  <div className="h-32 bg-white rounded-lg border border-dashed border-slate-300 flex items-center justify-center p-2">
                    {supervisorSignature ? (
                      <img
                        src={supervisorSignature}
                        alt="Tanda Tangan Supervisor"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-2xs text-slate-400 italic">Belum ada tanda tangan digital</span>
                    )}
                  </div>
                </div>

                <div className="mt-2 text-2xs text-slate-400 text-center">
                  Tanggal: {tanggalSupervisi}
                </div>
              </div>

              {/* Teacher Signature */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                    <div>
                      <span className="text-xs font-bold text-slate-800">Tanda Tangan Guru</span>
                      <p className="text-2xs text-slate-400">{namaGuru}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSigPadTarget('teacher')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold cursor-pointer"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      {teacherSignature ? 'Ubah' : 'Tanda Tangani'}
                    </button>
                  </div>

                  <div className="h-32 bg-white rounded-lg border border-dashed border-slate-300 flex items-center justify-center p-2">
                    {teacherSignature ? (
                      <img
                        src={teacherSignature}
                        alt="Tanda Tangan Guru"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-2xs text-slate-400 italic">Belum ada tanda tangan digital</span>
                    )}
                  </div>
                </div>

                <div className="mt-2 text-2xs text-slate-400 text-center">
                  Tanggal: {tanggalSupervisi}
                </div>
              </div>
            </div>
          )}

          {/* Final Actions */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-800">Status Validasi Dokumen:</span>
              <p className="text-2xs text-slate-500">
                {missingIndicators.length === 0
                  ? '✓ Seluruh 38 indikator telah dinilai lengkap. Siap difinalisasi.'
                  : `⚠️ Terdapat ${missingIndicators.length} indikator yang belum dinilai.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-bold cursor-pointer"
              >
                <Save className="w-4 h-4 text-slate-500" />
                Simpan Sebagai Draft
              </button>

              <button
                type="button"
                onClick={() => onPreviewRequested(buildSupervisionObject('FINAL'))}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Preview Dokumen Cetak
              </button>

              <button
                type="button"
                onClick={handleFinalize}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                Finalisasi Dokumen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signature Pad Modal */}
      <SignaturePadModal
        isOpen={sigPadTarget !== null}
        title={
          sigPadTarget === 'supervisor'
            ? `Tanda Tangan Supervisor (${namaSupervisor})`
            : `Tanda Tangan Guru (${namaGuru})`
        }
        existingSignature={
          sigPadTarget === 'supervisor' ? supervisorSignature : teacherSignature
        }
        onClose={() => setSigPadTarget(null)}
        onSave={(dataUrl) => {
          if (sigPadTarget === 'supervisor') {
            setSupervisorSignature(dataUrl);
          } else {
            setTeacherSignature(dataUrl);
          }
        }}
      />

      {/* Validation Warning Modal */}
      {showValidationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2.5 text-amber-800 mb-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Masih Terdapat Indikator yang Belum Dinilai
              </h3>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Dokumen belum dapat difinalisasi karena masih ada <strong>{missingIndicators.length}</strong> indikator yang belum diberi nilai (0, 1, atau 2):
            </p>

            <div className="max-h-48 overflow-y-auto space-y-1.5 rounded-xl bg-slate-50 p-3 border border-slate-200 text-2xs text-slate-700">
              {missingIndicators.map((ind) => (
                <div key={ind.id} className="flex items-start gap-1.5">
                  <span className="font-bold text-amber-700 shrink-0">#{ind.number}</span>
                  <span className="leading-snug">{ind.aspekYangDiamati}</span>
                </div>
              ))}
            </div>

            <p className="text-2xs text-slate-400 mt-3">
              Tip: Anda dapat menyimpan dokumen ini sebagai <strong>Draft</strong> untuk dilanjutkan nanti, atau lengkapi penilaian sekarang.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowValidationModal(false);
                  handleSaveDraft();
                }}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Simpan Sebagai Draft Saja
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowValidationModal(false);
                  setCurrentStep(2); // Jump to instruments
                }}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold"
              >
                Lengkapi Penilaian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
