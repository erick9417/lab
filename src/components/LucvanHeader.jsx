import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * LucvanHeader - Header unificado para paneles admin, clínica y taller.
 * Props:
 * - title: string (título principal)
 * - user: { name: string, role?: string }
 * - onBack: function (opcional, callback para botón volver)
 * - onLogout: function (callback para cerrar sesión)
 * - showBack: boolean (mostrar botón volver)
 * - children: ReactNode (opcional, para botones extra)
 */
export default function LucvanHeader({ title, user, onBack, onLogout, showBack = false, children }) {
  const navigate = useNavigate();
  
  return (
    <header className="bg-gradient-to-r from-[#0066A4] to-[#003C63] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/lucvan-logo-web.png" alt="Lucván" className="h-16 brightness-0 invert" />
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-3 items-center">
              {showBack && (
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-white/10 border-2 border-white/30 text-white rounded-full hover:bg-white/20 transition font-medium backdrop-blur-sm"
                >
                  ← Volver
                </button>
              )}
              {children}
              {(user?.name || user?.email) && (
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full shadow-sm border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                    {(user?.name || user?.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="leading-tight text-right">
                    <p className="text-sm font-semibold text-blue-50 tracking-tight">
                      {user?.name || user?.email}
                    </p>
                    <p className="text-[11px] text-blue-100/80 uppercase font-semibold">Usuario</p>
                  </div>
                </div>
              )}
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-[#F5C400] text-[#003C63] rounded-full hover:bg-[#ffd933] transition font-bold shadow-lg"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
