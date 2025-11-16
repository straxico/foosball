import React from 'react';
import { ProfileWithScore } from '../types';
import TrophyIcon from './icons/TrophyIcon';

interface PredictionLeaderboardProps {
  users: ProfileWithScore[];
}

const PredictionLeaderboard: React.FC<PredictionLeaderboardProps> = ({ users }) => {
  const sortedUsers = [...users].sort((a, b) => b.score - a.score);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/30 to-yellow-600/30 text-yellow-200 border-l-8 border-yellow-500 shadow-xl shadow-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/30 to-gray-500/30 text-gray-200 border-l-8 border-gray-400 shadow-xl shadow-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-orange-700/30 to-orange-800/30 text-orange-200 border-l-8 border-orange-600 shadow-xl shadow-orange-600/30';
      default:
        return 'bg-gray-800/70 border-l-4 border-gray-600 hover:border-blue-500/50';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '🎯';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80 rounded-2xl shadow-2xl p-4 sm:p-6 backdrop-blur-lg border border-gray-700/50 animate-fadeIn" dir="rtl">
      <h2 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 flex items-center justify-center gap-2">
        <TrophyIcon className="w-8 h-8 text-yellow-500 animate-bounce" />
        برترین پیش‌بینی‌ها
        <TrophyIcon className="w-8 h-8 text-yellow-500 animate-bounce" />
      </h2>
      <div className="space-y-3 max-w-2xl mx-auto">
        {sortedUsers.map((user, index) => (
          <div
            key={user.id}
            className={`flex items-center justify-between p-5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${getRankColor(index + 1)}`}
          >
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <span className="text-3xl">{getRankIcon(index + 1)}</span>
                <span className="font-bold text-xl text-white">{index + 1}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-white">{user.username}</span>
                {index < 3 && (
                  <span className="text-xs text-gray-400">
                    {index === 0 ? '👑 قهرمان' : index === 1 ? '⭐ عالی' : '🎖️ خوب'}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{user.score}</span>
                <span className="text-xs text-gray-400">امتیاز</span>
              </div>
              <div className="text-sm text-gray-300 text-right">
                <div>کل: <span className="text-white font-semibold">{user.totalPredictions ?? 0}</span></div>
                <div>درست: <span className="text-green-400 font-semibold">{user.correctPredictions ?? 0}</span></div>
                <div>غلط: <span className="text-red-400 font-semibold">{user.wrongPredictions ?? 0}</span></div>
                <div>در انتظار: <span className="text-yellow-300 font-semibold">{user.pendingPredictions ?? 0}</span></div>
              </div>
              <TrophyIcon className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        ))}
        {sortedUsers.length === 0 && (
          <div className="text-center p-10 text-gray-400">
            <span className="text-6xl block mb-4">🏆</span>
            <p>هنوز کسی امتیازی کسب نکرده است!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionLeaderboard;