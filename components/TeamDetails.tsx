import React from 'react';
import { Team, Match, TeamStats } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface TeamDetailsProps {
  teamId: number;
  teams: Team[];
  matches: Match[];
  stats: TeamStats[];
  onBack: () => void;
}

const StatCard: React.FC<{ label: string; value: string | number; className?: string; icon?: string }> = ({ label, value, className, icon }) => (
    <div className={`bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-4 rounded-xl text-center border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 ${className}`}>
        <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
            {icon && <span>{icon}</span>}
            {label}
        </p>
        <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mt-1">{value}</p>
    </div>
);

const TeamDetails: React.FC<TeamDetailsProps> = ({ teamId, teams, matches, stats, onBack }) => {
  const team = teams.find(t => t.id === teamId);
  const teamStats = stats.find(s => s.teamId === teamId);
  const teamMatches = matches
    .filter(m => m.team_a_id === teamId || m.team_b_id === teamId)
    .sort((a, b) => new Date(a.match_date || 0).getTime() - new Date(b.match_date || 0).getTime());

  if (!team || !teamStats) {
    return (
      <div className="text-center p-10">
        <p>تیم مورد نظر یافت نشد.</p>
        <button onClick={onBack} className="mt-4 text-blue-400 hover:underline">بازگشت</button>
      </div>
    );
  }

  const getResultBadge = (match: Match) => {
    if (match.status !== 'completed' || match.team_a_score === null || match.team_b_score === null) {
      return <span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full bg-gray-700/70 text-gray-300">⏳ برگزار نشده</span>;
    }

    const isTeamA = match.team_a_id === teamId;
    const teamScore = isTeamA ? match.team_a_score : match.team_b_score;
    const opponentScore = isTeamA ? match.team_b_score : match.team_a_score;

    if (teamScore > opponentScore) {
      return <span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg">✓ برد</span>;
    }
    if (teamScore < opponentScore) {
      return <span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg">✗ باخت</span>;
    }
    return <span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg">= مساوی</span>;
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80 rounded-2xl shadow-2xl p-4 sm:p-6 backdrop-blur-lg border border-gray-700/50 animate-fadeIn" dir="rtl">
      <header className="flex items-center justify-between mb-6 border-b border-gray-700/50 pb-4">
        <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">{team.name}</h1>
            <div className="flex items-center gap-3 mt-3">
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-lg shadow-lg">{team.group_name}</span>
                <p className="text-gray-400">{team.players.map(p => p.name).join('، ')}</p>
            </div>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 hover:from-gray-600 hover:to-gray-500 hover:scale-105 shadow-lg"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>بازگشت</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats and Players Section */}
        <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 flex items-center gap-2">
                📊 آمار کلی
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
                <StatCard label="امتیاز" value={teamStats.points} icon="🏆" />
                <StatCard label="بازی" value={teamStats.played} icon="⚽" />
                <StatCard label="برد" value={teamStats.won} icon="✓" />
                <StatCard label="مساوی" value={teamStats.drawn} icon="=" />
                <StatCard label="باخت" value={teamStats.lost} icon="✗" />
                <StatCard label="تفاضل گل" value={teamStats.goalDifference > 0 ? `+${teamStats.goalDifference}` : teamStats.goalDifference} icon="⚡" />
            </div>

            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 flex items-center gap-2 mt-8">
                👥 بازیکنان
            </h2>
            <ul className="space-y-2 bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-4 rounded-xl border border-gray-700/50">
                {team.players.map(player => (
                    <li key={player.name} className="text-gray-200 p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                        🎮 {player.name}
                    </li>
                ))}
            </ul>
        </div>
        
        {/* Match History Section */}
        <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-4 flex items-center gap-2">
                📜 تاریخچه بازی‌ها
            </h2>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {teamMatches.map(match => {
              const opponentId = match.team_a_id === teamId ? match.team_b_id : match.team_a_id;
              const opponent = teams.find(t => t.id === opponentId);
              const isCompleted = match.status === 'completed';
              
              return (
                <div key={match.id} className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-5 rounded-xl flex items-center justify-between border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
                    <div className="flex-1 text-right">
                        <span className="font-bold text-lg">{team.name.split(':')[0]}</span>
                    </div>
                    <div className="flex-grow-0 flex-shrink-0 text-center mx-4">
                        {isCompleted ? (
                             <span className="text-2xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{match.team_a_score} - {match.team_b_score}</span>
                        ) : (
                             <span className="text-xl font-bold text-gray-500">⚔️ VS</span>
                        )}
                        <div className="mt-2">{getResultBadge(match)}</div>
                    </div>
                    <div className="flex-1 text-left">
                        <span className="font-bold text-lg">{opponent?.name.split(':')[0]}</span>
                    </div>
                </div>
              );
            })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;