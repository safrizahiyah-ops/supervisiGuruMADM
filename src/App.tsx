/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  UserAccount,
  UserRole,
  Supervision,
  Teacher,
  Subject,
  SchoolClass,
  MadrasahIdentity,
} from './types/supervisi';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SupervisiForm } from './components/SupervisiForm';
import { SupervisiPreview } from './components/SupervisiPreview';
import { RekapitulasiView } from './components/RekapitulasiView';
import { AnalisisIndikatorView } from './components/AnalisisIndikatorView';
import { TindakLanjutView } from './components/TindakLanjutView';
import { GuruManager } from './components/GuruManager';
import { MapelManager } from './components/MapelManager';
import { KelasManager } from './components/KelasManager';
import { PengaturanMadrasah } from './components/PengaturanMadrasah';
import { LoginModal } from './components/LoginModal';
import { ShieldAlert, ArrowLeft, UserCheck, Lock } from 'lucide-react';

export type ExtendedNavTab = NavTab | 'preview-supervisi';

export default function App() {
  // Current logged in user & role
  const [currentUser, setCurrentUser] = useState<UserAccount>(storageService.getCurrentUser());
  const [allUsers, setAllUsers] = useState<UserAccount[]>(storageService.getUsers());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Active view tab
  const [activeTab, setActiveTab] = useState<ExtendedNavTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Persistent storage states
  const [madrasah, setMadrasah] = useState<MadrasahIdentity>(storageService.getMadrasah());
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [supervisions, setSupervisions] = useState<Supervision[]>([]);

  // Selection states
  const [selectedSupervisionId, setSelectedSupervisionId] = useState<string | null>(null);
  const [editingSupervision, setEditingSupervision] = useState<Supervision | null>(null);

  // Load all data from storage
  const loadData = useCallback(() => {
    setMadrasah(storageService.getMadrasah());
    setTeachers(storageService.getTeachers());
    setSubjects(storageService.getSubjects());
    setClasses(storageService.getClasses());
    setSupervisions(storageService.getSupervisions());
    setAllUsers(storageService.getUsers());
    const user = storageService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle user role switcher
  const handleUserChange = (newUser: UserAccount) => {
    setCurrentUser(newUser);
    storageService.setCurrentUser(newUser);

    // If new role cannot access current active tab, switch back to dashboard
    const role = newUser.role;
    if (role === 'TIM_SUPERVISI') {
      const allowed: ExtendedNavTab[] = ['dashboard', 'supervisi-baru', 'arsip-supervisi', 'data-guru', 'preview-supervisi'];
      if (!allowed.includes(activeTab)) {
        setActiveTab('dashboard');
      }
    } else if (role === 'WAKA_KURIKULUM') {
      const forbidden: ExtendedNavTab[] = ['supervisi-baru', 'pengaturan'];
      if (forbidden.includes(activeTab)) {
        setActiveTab('dashboard');
      }
    }
  };

  // Start new supervision (optionally pre-fill teacher)
  const handleStartNewSupervision = (teacher?: Teacher) => {
    if (currentUser.role === 'WAKA_KURIKULUM') {
      alert('Pemberitahuan: Akun Waka Kurikulum bertugas untuk evaluasi, monitoring, dan analisis. Form penginputan instrumen baru diperuntukkan bagi Tim Supervisi atau Admin.');
      return;
    }

    if (teacher) {
      const settings = storageService.getSettings();
      const currentClass = classes[0]?.rombel || 'X.1 (Ula A)';
      const newSup: Supervision = {
        id: `sup-${Date.now()}`,
        nomorDokumen: storageService.generateNextDocumentNumber(),
        tanggalSupervisi: new Date().toISOString().split('T')[0],
        semester: settings.currentSemester || 'Ganjil',
        tahunPelajaran: settings.currentTahunPelajaran || '2026/2027',
        guruId: teacher.id,
        namaGuru: teacher.nama,
        nipGuru: teacher.nip && teacher.nip !== '-' ? teacher.nip : teacher.nuptk || '-',
        nuptkGuru: teacher.nuptk || '-',
        pendidikanGuru: teacher.pendidikanTerakhir || '-',
        jabatanGuru: teacher.jabatan || 'Guru Mata Pelajaran',
        statusKepegawaianGuru: teacher.statusKepegawaian || 'GTT / Non-PNS',
        kontakGuru: teacher.nomorHp || teacher.email || '-',
        mataPelajaran: teacher.mataPelajaranUtama || (subjects[0]?.nama ?? 'Mata Pelajaran'),
        kelas: currentClass,
        jamPelajaran: '1-2 (07.30 - 09.00 WITA)',
        materiTopik: '',
        namaSupervisor: currentUser.name,
        nipSupervisor: currentUser.nip || '-',
        jenisSupervisi: 'Supervisi Pembelajaran',
        penilaian: {},
        evaluationMode: 'DOKUMEN_ASLI',
        countScore0: 0,
        countScore1: 0,
        countScore2: 0,
        totalSkorPerolehan: 0,
        skorMaksimal: 76,
        nilaiAkhir: 0,
        kategori: 'Kurang',
        catatanHasilSupervisi: '',
        kelebihanGuru: '',
        halPerluDitingkatkan: '',
        rekomendasi: '',
        analisis: {
          aspekSudahBaik: [],
          aspekPerluDitingkatkan: [],
          rekomendasi: [],
        },
        tindakLanjut: {
          options: ['Pembinaan individu'],
          targetDate: '',
          pic: currentUser.name,
          status: 'Belum Dilaksanakan',
          notes: '',
        },
        signature: {
          useDigitalSignature: true,
          supervisorName: currentUser.name,
          supervisorNip: currentUser.nip || '-',
          teacherName: teacher.nama,
          teacherNip: teacher.nip || '-',
          supervisorSignDate: new Date().toISOString().split('T')[0],
          teacherSignDate: new Date().toISOString().split('T')[0],
        },
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setEditingSupervision(newSup);
    } else {
      setEditingSupervision(null);
    }
    setSelectedSupervisionId(null);
    setActiveTab('supervisi-baru');
  };

  // View formal printable document
  const handleSelectSupervision = (id: string) => {
    setSelectedSupervisionId(id);
    setActiveTab('preview-supervisi');
  };

  // Edit existing supervision
  const handleEditSupervision = (supervision: Supervision) => {
    setEditingSupervision(supervision);
    setSelectedSupervisionId(supervision.id);
    setActiveTab('supervisi-baru');
  };

  // Duplicate supervision
  const handleDuplicateSupervision = (id: string) => {
    const duplicated = storageService.duplicateSupervision(id);
    if (duplicated) {
      loadData();
      setEditingSupervision(duplicated);
      setSelectedSupervisionId(duplicated.id);
      setActiveTab('supervisi-baru');
    }
  };

  // Selected supervision for preview
  const activeSupervisionForPreview = supervisions.find((s) => s.id === selectedSupervisionId);

  // Role Access Checker
  const checkRoleAccess = (tab: ExtendedNavTab): boolean => {
    if (currentUser.role === 'ADMIN') return true;

    if (currentUser.role === 'WAKA_KURIKULUM') {
      const allowed: ExtendedNavTab[] = [
        'dashboard',
        'arsip-supervisi',
        'monitoring-kamad',
        'analisis-indikator',
        'rekapitulasi',
        'riwayat-guru',
        'laporan-semester',
        'data-guru',
        'data-mapel',
        'data-kelas',
        'preview-supervisi',
      ];
      return allowed.includes(tab);
    }

    if (currentUser.role === 'TIM_SUPERVISI') {
      const allowed: ExtendedNavTab[] = [
        'dashboard',
        'supervisi-baru',
        'arsip-supervisi',
        'data-guru',
        'preview-supervisi',
      ];
      return allowed.includes(tab);
    }

    return false;
  };

  const isAccessAllowed = checkRoleAccess(activeTab);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      {/* Header Bar with Role & Account Switcher */}
      <Header
        madrasah={madrasah}
        currentUser={currentUser}
        allUsers={allUsers}
        onUserChange={handleUserChange}
        onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        onNewSupervision={() => handleStartNewSupervision()}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab as NavTab}
          onSelectTab={(tab) => {
            if (tab === 'supervisi-baru') {
              setEditingSupervision(null);
            }
            setActiveTab(tab);
          }}
          userRole={currentUser.role}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          madrasahName={madrasah.namaMadrasah}
        />

        {/* Dynamic Content Region */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {/* ROLE PERMISSION GUARD BANNER */}
            {!isAccessAllowed ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center max-w-xl mx-auto my-12 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  Batasan Hak Akses Akun
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fitur ini tidak termasuk dalam wewenang akun{' '}
                  <strong className="text-slate-800 font-bold">
                    {currentUser.role === 'WAKA_KURIKULUM'
                      ? 'Waka Kurikulum Madrasah'
                      : currentUser.role === 'TIM_SUPERVISI'
                      ? 'Tim Supervisi'
                      : currentUser.role}
                  </strong>
                  . Hanya akun dengan kewenangan terkait atau <strong>Administrator</strong> yang memiliki izin akses penuh.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
                  </button>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer shadow-xs"
                  >
                    <UserCheck className="w-4 h-4" /> Ganti Akun / Login Admin
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* VIEW 1: DASHBOARD */}
                {activeTab === 'dashboard' && (
                  <Dashboard
                    supervisions={supervisions}
                    teachers={teachers}
                    onNavigate={(tab) => {
                      if (tab === 'supervisi-baru') {
                        handleStartNewSupervision();
                      } else {
                        setActiveTab(tab);
                      }
                    }}
                    onSelectSupervision={handleSelectSupervision}
                  />
                )}

                {/* VIEW 2: FORM SUPERVISI BARU / EDIT (38 Indikator) */}
                {activeTab === 'supervisi-baru' && (
                  <SupervisiForm
                    initialSupervision={editingSupervision}
                    teachers={teachers}
                    subjects={subjects}
                    classes={classes}
                    currentSupervisorName={currentUser.name}
                    currentSupervisorNip={currentUser.nip || '-'}
                    onSaveSuccess={(saved) => {
                      loadData();
                      setSelectedSupervisionId(saved.id);
                      setActiveTab('preview-supervisi');
                    }}
                    onCancel={() => {
                      setEditingSupervision(null);
                      setActiveTab('dashboard');
                    }}
                    onPreviewRequested={(supervision) => {
                      setSelectedSupervisionId(supervision.id);
                      setActiveTab('preview-supervisi');
                    }}
                  />
                )}

                {/* VIEW 3: FORMAL PREVIEW DOKUMEN CETAK A4 & EXPORT WORD/PDF */}
                {activeTab === 'preview-supervisi' && activeSupervisionForPreview && (
                  <SupervisiPreview
                    supervision={activeSupervisionForPreview}
                    madrasah={madrasah}
                    onBack={() => setActiveTab('arsip-supervisi')}
                    onEdit={handleEditSupervision}
                    onDuplicate={handleDuplicateSupervision}
                  />
                )}

                {/* VIEW 4: ARSIP & REKAPITULASI SUPERVISI */}
                {(activeTab === 'arsip-supervisi' ||
                  activeTab === 'rekapitulasi' ||
                  activeTab === 'riwayat-guru' ||
                  activeTab === 'laporan-semester') && (
                  <RekapitulasiView
                    supervisions={supervisions}
                    madrasah={madrasah}
                    onSelectSupervision={handleSelectSupervision}
                  />
                )}

                {/* VIEW 5: MONITORING WAKA KURIKULUM / TINDAK LANJUT */}
                {activeTab === 'monitoring-kamad' && (
                  <TindakLanjutView
                    supervisions={supervisions}
                    onSupervisionUpdated={loadData}
                    onOpenSupervision={handleSelectSupervision}
                  />
                )}

                {/* VIEW 6: ANALISIS 38 INDIKATOR (Sebaran 0, 1, 2) */}
                {activeTab === 'analisis-indikator' && (
                  <AnalisisIndikatorView supervisions={supervisions} />
                )}

                {/* VIEW 7: MASTER DATA GURU (Excel Impor/Ekspor, Edit, Hapus) */}
                {activeTab === 'data-guru' && (
                  <GuruManager
                    teachers={teachers}
                    supervisions={supervisions}
                    onTeachersUpdated={loadData}
                    onStartSupervisionForTeacher={(teacher) => handleStartNewSupervision(teacher)}
                    onViewHistoryForTeacher={() => setActiveTab('rekapitulasi')}
                    userRole={currentUser.role}
                    madrasahName={madrasah.namaMadrasah}
                  />
                )}

                {/* VIEW 8: MASTER MATA PELAJARAN */}
                {activeTab === 'data-mapel' && (
                  <MapelManager subjects={subjects} onSubjectsUpdated={loadData} />
                )}

                {/* VIEW 9: MASTER KELAS & ROMBEL */}
                {activeTab === 'data-kelas' && (
                  <KelasManager classes={classes} onClassesUpdated={loadData} />
                )}

                {/* VIEW 10: PENGATURAN & IDENTITAS & LOGO MADRASAH */}
                {activeTab === 'pengaturan' && (
                  <PengaturanMadrasah madrasah={madrasah} onUpdated={loadData} />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* LOGIN & ROLE AUTHENTICATION MODAL */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => {
          handleUserChange(user);
          loadData();
          setIsLoginModalOpen(false);
        }}
        madrasah={madrasah}
      />
    </div>
  );
}
