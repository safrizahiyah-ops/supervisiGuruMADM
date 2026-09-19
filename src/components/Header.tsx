/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MadrasahIdentity, UserAccount, UserRole } from '../types/supervisi';
import { Menu, PlusCircle, Shield, BookOpenCheck, ClipboardCheck, School, LogOut, UserCircle } from 'lucide-react';

interface HeaderProps {
  madrasah: MadrasahIdentity;
  currentUser: UserAccount;
  allUsers: UserAccount[];
  onUserChange: (user: UserAccount) => void;
  onOpenMobileMenu: () => void;
  onNewSupervision: () => void;
  onOpenLoginModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  madrasah,
  currentUser,
  allUsers,
  onUserChange,
  onOpenMobileMenu,
  onNewSupervision,
  onOpenLoginModal,
}) => {
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return {
          label: 'Admin (Akses Penuh)',
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          dot: 'bg-emerald-600',
          icon: Shield,
        };
      case 'WAKA_KURIKULUM':
        return {
          label: 'Waka Kurikulum',
          bg: 'bg-blue-100 text-blue-900 border-blue-300',
          dot: 'bg-blue-600',
          icon: BookOpenCheck,
        };
      case 'TIM_SUPERVISI':
        return {
          label: 'Tim Supervisi',
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'bg-amber-600',
          icon: ClipboardCheck,
        };
    }
  };

  const badge = getRoleBadge(currentUser.role);
  const BadgeIcon = badge.icon;

  const canCreateSupervision = currentUser.role === 'ADMIN' || currentUser.role === 'TIM_SUPERVISI';

  return (
    <header className="app-header sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Left: Mobile hamburger & Logo/Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Buka Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl overflow-hidden bg-emerald-900 p-1 flex items-center justify-center shadow-xs border border-emerald-800">
                {madrasah.logoUrl ? (
                  <img
                    src={madrasah.logoUrl}
                    alt={madrasah.namaMadrasah}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <School className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-emerald-950 text-base sm:text-lg tracking-tight leading-tight">
                    {madrasah.namaMadrasah}
                  </h1>
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-emerald-100 text-emerald-800">
                    Kurikulum Merdeka
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium hidden sm:block">
                  Sistem Supervisi Akademik Pelaksanaan Pembelajaran • {madrasah.kabupaten}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Quick Action & Role / User Account */}
          <div className="flex items-center gap-2 sm:gap-3">
            {canCreateSupervision && (
              <button
                onClick={onNewSupervision}
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Supervisi Baru</span>
              </button>
            )}

            {/* Active Account Profile Box */}
            <div className="flex items-center gap-2 border border-slate-200 rounded-2xl px-2.5 sm:px-3 py-1.5 bg-slate-50/90 shadow-2xs">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
                <BadgeIcon className="w-4 h-4 text-emerald-800" />
              </div>

              <div className="hidden sm:block text-left pr-1">
                <div className="text-xs font-black text-slate-800 leading-tight truncate max-w-[140px]">
                  {currentUser.name}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`inline-flex items-center gap-1 text-2xs px-1.5 py-0.2 rounded-md font-bold border ${badge.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    {badge.label}
                  </span>
                </div>
              </div>

              {/* Login / Switch Account Button */}
              {onOpenLoginModal && (
                <button
                  type="button"
                  onClick={onOpenLoginModal}
                  className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-emerald-800 bg-white hover:bg-emerald-50 border border-slate-300 hover:border-emerald-300 rounded-xl px-2.5 py-1 transition-all cursor-pointer shadow-2xs"
                  title="Ganti Akun / Login Role Lain"
                >
                  <UserCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="hidden md:inline">Ganti Akun</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
