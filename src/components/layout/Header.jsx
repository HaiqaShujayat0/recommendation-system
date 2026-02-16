import React from 'react';
import { Brain, User, Menu } from 'lucide-react';

/**
 * App header: logo, title, optional patient info and mobile menu trigger.
 * Receives selectedPatient and onMenuClick from App.
 */
export default function Header({ selectedPatient, onMenuClick }) {
  return (
    <header className="bg-gradient-to-r from-primary-900 to-primary-800 text-white px-4 py-3 shadow-lg z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {selectedPatient && (
            <button
              type="button"
              onClick={onMenuClick}
              className="p-2 hover:bg-white/10 rounded-lg lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight font-display">GLYERAL</h1>
              <p className="text-[10px] text-primary-200 -mt-1">Physician Decision Support</p>
            </div>
          </div>
        </div>
        {selectedPatient && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{selectedPatient.name}</p>
              <p className="text-xs text-primary-200">MR# {selectedPatient.mrNumber}</p>
            </div>
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
