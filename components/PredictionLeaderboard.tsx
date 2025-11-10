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
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
      case 2:
        return 'bg-gray-400/20 text-gray-200 border-gray-400';
      case 3:
        return 'bg-yellow-700/20 text-yellow-500 border-yellow-700';
      default:
        return 'bg-gray-700/50 border-gray-600';
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-xl shadow-2xl p-4 sm:p-6 backdrop-blur-sm" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-300">برترین پیش‌بینی‌ها</h2>
      <div className="space-y-3 max-w-md mx-auto">
        {sortedUsers.map((user, index) => (
          <div
            key={user.id}
            className={`flex items-center justify-between p-4 rounded-lg border-l-4 transition-all duration-300 transform hover:scale-105 ${getRankColor(index + 1)}`}
          >
            <div className="flex items-center gap-4">
              <span className="font-bold text-xl w-8 text-center">{index + 1}</span>
              <span className="font-medium text-white">{user.username}</span>
            </div>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <span>{user.score}</span>
              <TrophyIcon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionLeaderboard;