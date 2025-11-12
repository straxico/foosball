import React from 'react';
import { Session } from '../types';
import CalendarIcon from './icons/CalendarIcon';
import ListIcon from './icons/ListIcon';
import TrophyIcon from './icons/TrophyIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import { supabase } from '../supabaseClient';

type View = 'table' | 'schedule' | 'leaderboard' | 'predictions';

interface HeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isAdmin: boolean;
  session: Session | null;
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentView, onViewChange, isAdmin, session, onLoginClick
}) => {
  const handleLogout = () => {
    supabase.auth.signOut();
  };

  const NavButton: React.FC<{
    view: View;
    label: string;
    icon: React.ReactNode;
  }> = ({ view, label, icon }) => (
    <button
      onClick={() => onViewChange(view)}
      className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
        currentView === view
          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50 scale-105'
          : 'text-gray-300 hover:bg-gray-700/70 hover:text-white hover:scale-105'
      }`}
    >
      <span className="transition-transform group-hover:rotate-6 duration-300">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
      {currentView === view && (
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></span>
      )}
    </button>
  );

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl p-4 sticky top-0 z-50 backdrop-blur-lg border-b border-gray-700/50">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 text-center animate-gradient">
          ⚽ مدیریت مسابقات فوتبال دستی
        </h1>
        <nav className="flex items-center gap-2 bg-gray-900/70 backdrop-blur-md p-1.5 rounded-xl border border-gray-700/50 shadow-xl">
          <NavButton view="table" label="جدول لیگ" icon={<ListIcon className="w-5 h-5" />} />
          <NavButton view="predictions" label="پیش‌بینی" icon={<CheckCircleIcon className="w-5 h-5" />} />
          <NavButton view="schedule" label="برنامه بازی‌ها" icon={<CalendarIcon className="w-5 h-5" />} />
          <NavButton view="leaderboard" label="برترین‌ها" icon={<TrophyIcon className="w-5 h-5" />} />
        </nav>
        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-2 bg-gray-900/50 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-700/50">
              {isAdmin && <span className="text-xs font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 px-2 py-1 rounded-md shadow-lg animate-pulse">👑 ادمین</span>}
              <span className="text-sm text-gray-300 hidden md:inline">{session.user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-semibold rounded-lg py-2 px-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/50"
              >
                خروج
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-700 hover:via-blue-600 hover:to-purple-700 text-white text-sm font-semibold rounded-lg py-2 px-4 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50"
            >
              ورود / ثبت‌نام
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;