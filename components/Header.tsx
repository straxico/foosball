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
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        currentView === view
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <header className="bg-gray-800 shadow-lg p-4 sticky top-0 z-10">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-white text-center">
          مدیریت مسابقات فوتبال دستی
        </h1>
        <nav className="flex items-center gap-2 bg-gray-900/50 p-1 rounded-lg">
          <NavButton view="table" label="جدول لیگ" icon={<ListIcon className="w-5 h-5" />} />
          <NavButton view="predictions" label="پیش‌بینی" icon={<CheckCircleIcon className="w-5 h-5" />} />
          <NavButton view="schedule" label="برنامه بازی‌ها" icon={<CalendarIcon className="w-5 h-5" />} />
          <NavButton view="leaderboard" label="برترین‌ها" icon={<TrophyIcon className="w-5 h-5" />} />
        </nav>
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-2">
              {isAdmin && <span className="text-xs font-bold bg-yellow-500 text-gray-900 px-2 py-1 rounded-md">ادمین</span>}
              <span className="text-sm text-gray-300">{session.user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg py-2 px-3 transition-colors"
              >
                خروج
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg py-2 px-4 transition-colors"
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