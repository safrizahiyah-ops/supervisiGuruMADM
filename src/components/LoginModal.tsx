/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserAccount, UserRole, MadrasahIdentity } from '../types/supervisi';
import { storageService } from '../services/storageService';
import {
  Shield,
  BookOpenCheck,
  ClipboardCheck,
  Lock,
  User,
  LogIn,
  Check,
  AlertCircle,
  X,
  School,
  Sparkles,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  currentUser: UserAccount | null;
  onLoginSuccess: (user: UserAccount) => void;
  madrasah: MadrasahIdentity;
  isMandatory?: boolean; // if true, cannot be closed until logged in
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  madrasah,
  isMandatory = false,
}) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const users = storageService.getUsers();

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!usernameOrEmail.trim()) {
      setErrorMessage('Silakan masukkan username atau email.');
      return;
    }

    const authenticatedUser = storageService.login(usernameOrEmail, password);
    if (authenticatedUser) {
      onLoginSuccess(authenticatedUser);
      if (onClose) onClose();
    } else {
      setErrorMessage('Username/Email atau Password tidak sesuai. Silakan gunakan salah satu akun resmi di bawah.');
    }
  };

  const handleQuickLogin = (user: UserAccount) => {
    storageService.setCurrentUser(user);
    onLoginSuccess(user);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header with Madrasah Branding */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 p-6 sm:p-8 text-white relative">
          {!isMandatory && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-lg border-2 border-amber-400">
              {madrasah.logoUrl ? (
                <img
                  src={madrasah.logoUrl}
                  alt={madrasah.namaMadrasah}
                  className="w-full h-full object-contain"
                />
              ) : (
                <School className="w-8 h-8 text-emerald-800" />
              )}
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-1">
                <Sparkles className="w-3 h-3" />
                Portal Akses Berbasis Role
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Sistem Supervisi Akademik
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                {madrasah.namaMadrasah} • {madrasah.kabupaten}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-7">
          {/* Quick 1-Click Role Switch Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-700" />
                Pilih Akun Login Resmi (Akses Cepat 1-Klik)
              </h3>
              <span className="text-2xs text-slate-400">Klik salah satu untuk langsung masuk</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {users.map((u) => {
                const isCurrent = currentUser?.id === u.id;
                let roleColor = 'border-emerald-200 hover:border-emerald-500 bg-emerald-50/40 text-emerald-900';
                let badgeColor = 'bg-emerald-800 text-white';
                let Icon = Shield;

                if (u.role === 'WAKA_KURIKULUM') {
                  roleColor = 'border-blue-200 hover:border-blue-500 bg-blue-50/40 text-blue-900';
                  badgeColor = 'bg-blue-800 text-white';
                  Icon = BookOpenCheck;
                } else if (u.role === 'TIM_SUPERVISI') {
                  roleColor = 'border-amber-200 hover:border-amber-500 bg-amber-50/40 text-amber-900';
                  badgeColor = 'bg-amber-700 text-white';
                  Icon = ClipboardCheck;
                }

                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u)}
                    className={`relative p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${roleColor} ${
                      isCurrent ? 'ring-2 ring-emerald-600 border-emerald-600 bg-white' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-2xs font-extrabold px-2 py-0.5 rounded-full ${badgeColor}`}>
                          {u.role === 'ADMIN'
                            ? 'Admin'
                            : u.role === 'WAKA_KURIKULUM'
                            ? 'Waka Kurikulum'
                            : 'Tim Supervisi'}
                        </span>
                        {isCurrent && (
                          <span className="flex items-center gap-1 text-2xs font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                            <Check className="w-3 h-3" /> Aktif
                          </span>
                        )}
                      </div>

                      <div className="font-extrabold text-xs text-slate-900 leading-tight mb-1">
                        {u.name}
                      </div>
                      <p className="text-2xs text-slate-500 line-clamp-2 leading-relaxed">
                        {u.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-2xs text-slate-600 font-mono">
                      <span>usr: {u.username}</span>
                      <span className="text-emerald-700 font-bold hover:underline">Masuk &rarr;</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-2xs font-bold text-slate-400 uppercase tracking-wider absolute">
              atau masuk dengan kredensial
            </span>
          </div>

          {/* Form Login Manual */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username / Alamat Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    placeholder="misal: admin atau kurikulum"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi akun"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-2xs text-slate-400 text-center sm:text-left">
                Password default akun: <span className="font-mono text-slate-600">admin123</span> /{' '}
                <span className="font-mono text-slate-600">kurikulum123</span> /{' '}
                <span className="font-mono text-slate-600">supervisi123</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold shadow-md cursor-pointer transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Sekarang</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-2xs text-slate-500 text-center">
          Hak akses dibatasi sesuai penugasan resmi: <strong className="text-slate-700">Admin</strong> (Akses Penuh),{' '}
          <strong className="text-slate-700">Waka Kurikulum</strong> (Evaluasi & Monitoring),{' '}
          <strong className="text-slate-700">Tim Supervisi</strong> (Pelaksanaan & Instrumen).
        </div>
      </div>
    </div>
  );
};
