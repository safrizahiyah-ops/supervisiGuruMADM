/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserRole } from '../types/supervisi';
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  BookOpen,
  GraduationCap,
  Archive,
  BarChart3,
  CheckSquare,
  TrendingUp,
  UserCheck,
  FileText,
  Settings,
  X,
  School,
  ShieldAlert,
  Lock,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'supervisi-baru'
  | 'data-guru'
  | 'data-mapel'
  | 'data-kelas'
  | 'arsip-supervisi'
  | 'rekapitulasi'
  | 'analisis-indikator'
  | 'riwayat-guru'
  | 'monitoring-kamad'
  | 'laporan-semester'
  | 'pengaturan';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  userRole: UserRole;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  madrasahName: string;
}

interface NavItemConfig {
  id: NavTab;
  label: string;
  icon: any;
  section: string;
  highlight?: boolean;
  badge?: string;
  allowedRoles: UserRole[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  userRole,
  isMobileOpen,
  onCloseMobile,
  madrasahName,
}) => {
  // Navigation list with strict role permissions
  const allNavItems: NavItemConfig[] = [
    // UTAMA
    {
      id: 'dashboard',
      label: userRole === 'WAKA_KURIKULUM' ? 'Dashboard Kurikulum' : userRole === 'TIM_SUPERVISI' ? 'Dashboard Supervisi' : 'Dashboard Utama',
      icon: LayoutDashboard,
      section: 'UTAMA',
      allowedRoles: ['ADMIN', 'WAKA_KURIKULUM', 'TIM_SUPERVISI'],
    },

    // SUPERVISI
    {
      id: 'supervisi-baru',
      label: '+ Supervisi Baru',
      icon: PlusCircle,
      highlight: true,
      section: 'PELAKSANAAN',
      allowedRoles: ['ADMIN', 'TIM_SUPERVISI'],
    },
    {
      id: 'arsip-supervisi',
      label: userRole === 'TIM_SUPERVISI' ? 'Arsip Supervisi Saya' : 'Arsip Dokumen Supervisi',
      icon: Archive,
      section: 'PELAKSANAAN',
      allowedRoles: ['ADMIN', 'WAKA_KURIKULUM', 'TIM_SUPERVISI'],
    },

    // EVALUASI & KURIKULUM
    {
      id: 'monitoring-kamad',
      label: 'Monitoring & Tindak Lanjut',
      icon: UserCheck,
      section: 'EVALUASI KURIKULUM',
      badge: 'Waka',
      allowedRoles: ['ADMIN', 'WAKA_KURIKULUM'],
    },
    {
      id: 'analisis-indikator',
      label: 'Analisis 38 Indikator',
      icon: CheckSquare,
      section: 'EVALUASI KURIKULUM',
      allowedRoles: ['ADMIN', 'WAKA_KURIKULUM'],
    },
    {
      id: 'rekapitulasi',
      label: 'Rekapitulasi Madrasah',
      icon: BarChart3,
      section: 'EVALUASI KURIKULUM',
      allowedRoles: ['ADMIN', 'WAKA_KURIKULUM'],
    },
    {
      id: 'riwayat-guru',
      label: 'Perkembangan Guru',
      icon: TrendingUp,
      section: 'EVALUASI KURIKULUM',
      allowedRoles: ['ADMIN', 'WAKA_KURIKULUM'],
    },
    {
      id: 'laporan-semester',
      label: 'Laporan Semester',
      icon: FileText,
      section: 'EVALUASI KURIKULUM',
      allowedRoles: ['ADMIN', 'WAKA_KURIKULUM'],
    },

    // DATA MASTER
    {
      id: 'data-guru',
      label: userRole === 'ADMIN' ? 'Data Guru (Excel/Edit)' : 'Daftar Guru & Tendik',
      icon: Users,
      section: 'DATA MASTER',
      allowedRoles: ['ADMIN', 'WAKA_KURIKULUM', 'TIM_SUPERVISI'],
    },
    {
      id: 'data-mapel',
      label: 'Mata Pelajaran',
      icon: BookOpen,
      section: 'DATA MASTER',
      allowedRoles: ['ADMIN', 'WAKA_KURIKULUM'],
    },
    {
      id: 'data-kelas',
      label: 'Kelas & Rombel',
      icon: GraduationCap,
      section: 'DATA MASTER',
      allowedRoles: ['ADMIN', 'WAKA_KURIKULUM'],
    },

    // SISTEM & PENGATURAN (ADMIN ONLY)
    {
      id: 'pengaturan',
      label: 'Pengaturan & Logo',
      icon: Settings,
      section: 'SISTEM',
      badge: 'Admin',
      allowedRoles: ['ADMIN'],
    },
  ];

  // Filter items strictly by userRole
  const permittedNavItems = allNavItems.filter((item) => item.allowedRoles.includes(userRole));

  // Determine sections present in permitted items
  const sections: string[] = [];
  permittedNavItems.forEach((item) => {
    if (!sections.includes(item.section)) {
      sections.push(item.section);
    }
  });

  const getRoleLabel = () => {
    if (userRole === 'ADMIN') return 'Hak Akses: Administrator (Penuh)';
    if (userRole === 'WAKA_KURIKULUM') return 'Hak Akses: Waka Kurikulum';
    return 'Hak Akses: Tim Supervisi';
  };

  const content = (
    <div className="h-full flex flex-col justify-between py-5 px-4">
      <div>
        {/* Mobile Header with close button */}
        <div className="flex items-center justify-between pb-4 mb-3 border-b border-slate-200 lg:hidden">
          <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
            <School className="w-5 h-5 text-emerald-700" />
            <span className="truncate">{madrasahName}</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Access Scope Badge */}
        <div className="mb-4 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-2 text-2xs font-bold text-slate-600">
          <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span className="truncate">{getRoleLabel()}</span>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-4">
          {sections.map((sec) => {
            const items = permittedNavItems.filter((it) => it.section === sec);
            return (
              <div key={sec} className="space-y-1">
                <div className="px-3 text-2xs font-black uppercase tracking-wider text-slate-400 mb-1">
                  {sec}
                </div>
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const isHighlight = item.highlight;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                        isActive
                          ? 'bg-emerald-800 text-white shadow-sm'
                          : isHighlight
                          ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive
                            ? 'text-white'
                            : isHighlight
                            ? 'text-emerald-700'
                            : 'text-slate-500'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`ml-auto text-2xs px-1.5 py-0.2 rounded-md font-bold ${
                            isActive
                              ? 'bg-emerald-700 text-white'
                              : item.badge === 'Admin'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-200 text-center">
        <div className="text-2xs font-semibold text-slate-400">
          Supervisi Akademik Kurikulum Merdeka
        </div>
        <div className="text-2xs font-black text-emerald-950 truncate">
          {madrasahName}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="app-sidebar hidden lg:block w-64 bg-white border-r border-slate-200 shrink-0 h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl z-50 overflow-y-auto">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
