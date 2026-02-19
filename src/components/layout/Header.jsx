import React, { useState, useRef, useEffect } from 'react';
import { Brain, User, Menu, Sparkles, Search, Bell, LogOut, ChevronDown, Settings } from 'lucide-react';
import SettingsModal from '../settings/SettingsModal';

export default function Header({ selectedPatient, onMenuClick, user, onSignOut }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '';

  return (
    <>
      <header className="relative bg-gradient-to-r from-primary-950 via-primary-900 to-primary-800 text-white shadow-lg z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {selectedPatient && (
              <button type="button" onClick={onMenuClick} className="p-2 hover:bg-white/10 rounded-xl lg:hidden border border-white/10 transition-all duration-200" aria-label="Toggle menu">
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center border border-white/10">
                <Brain className="w-5 h-5 text-primary-200" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight flex items-center gap-1.5">
                  GLYERAL
                  <Sparkles className="w-3.5 h-3.5 text-primary-300 opacity-70" />
                </h1>
                <p className="text-[11px] text-primary-200/70 -mt-0.5 font-medium">Healthcare Decision Support</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!selectedPatient && (
              <div className="hidden md:flex items-center bg-white/10 border border-white/10 rounded-xl px-3 py-1.5 gap-2 min-w-[200px]">
                <Search className="w-4 h-4 text-primary-300" />
                <span className="text-sm text-primary-300/60">Search...</span>
              </div>
            )}
            {selectedPatient && (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold">{selectedPatient.name}</p>
                  <p className="text-xs text-primary-200/70">MR# {selectedPatient.mrNumber}</p>
                </div>
              </div>
            )}
            <button className="p-2 hover:bg-white/10 rounded-xl transition-colors relative" aria-label="Notifications">
              <Bell className="w-4.5 h-4.5 text-primary-200" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full" />
            </button>

            <button
              type="button"
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              aria-label="Settings"
              onClick={() => {
                setShowUserMenu(false);
                setShowSettings(true);
              }}
            >
              <Settings className="w-4.5 h-4.5 text-primary-200" />
            </button>

            {/* User avatar + dropdown */}
            <div className="relative" ref={menuRef}>
              <button type="button" onClick={() => setShowUserMenu((s) => !s)} className="flex items-center gap-2 p-1 pr-2 hover:bg-white/10 rounded-xl transition-all duration-200" aria-label="User menu">
                <div className="w-8 h-8 bg-white/15 rounded-full flex items-center justify-center border border-white/15 text-xs font-bold">
                  {initials || <User className="w-4 h-4" />}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-primary-200 transition-transform duration-200 hidden sm:block ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-card-lg border border-slate-200/80 py-2 animate-scale-in z-50">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
                  </div>
                  <button type="button" onClick={() => { setShowUserMenu(false); onSignOut?.(); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}