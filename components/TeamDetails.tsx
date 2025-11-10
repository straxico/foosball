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

const StatCard: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className }) => (
    <div className={`bg-gray-800 p-4 rounded-lg text-center ${className}`}>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
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
      return <span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full bg-gray-700 text-gray-300">برگزار نشده</span>;
    }

    const isTeamA = match.team_a_id === teamId;
    const teamScore = isTeamA ? match.team_a_score : match.team_b_score;
    const opponentScore = isTeamA ? match.team_b_score : match.team_a_score;

    if (teamScore > opponentScore) {
      return <span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full bg-green-900 text-green-300">برد</span>;
    }
    if (teamScore < opponentScore) {
      return <span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full bg-red-900 text-red-300">باخت</span>;
    }
    return <span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full bg-yellow-900 text-yellow-300">مساوی</span>;
  };

  return (
    <div className="bg-gray-800/50 rounded-xl shadow-2xl p-4 sm:p-6 backdrop-blur-sm" dir="rtl">
      <header className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
        <div>
            <h1 className="text-3xl font-bold text-blue-300">{team.name}</h1>
            <div className="flex items-center gap-3 mt-2">
                <span className="text-sm font-semibold bg-gray-700 text-blue-300 px-2 py-1 rounded">{team.group_name}</span>
                <p className="text-gray-400">{team.players.map(p => p.name).join('، ')}</p>
            </div>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>بازگشت</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats and Players Section */}
        <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xl font-bold text-white">آمار کلی</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
                <StatCard label="امتیاز" value={teamStats.points} className="text-blue-300" />
                <StatCard label="بازی" value={teamStats.played} />
                <StatCard label="برد" value={teamStats.won} className="text-green-400" />
                <StatCard label="مساوی" value={teamStats.drawn} className="text-yellow-400" />
                <StatCard label="باخت" value={teamStats.lost} className="text-red-400" />
                <StatCard label="تفاضل" value={teamStats.goalDifference > 0 ? `+${teamStats.goalDifference}` : teamStats.goalDifference} />
            </div>

            <h2 className="text-xl font-bold text-white mt-8">بازیکنان</h2>
            <ul className="space-y-2 bg-gray-800 p-4 rounded-lg">
                {team.players.map(player => (
                    <li key={player.name} className="text-gray-200">{player.name}</li>
                ))}
            </ul>
        </div>
        
        {/* Match History Section */}
        <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">تاریخچه بازی‌ها</h2>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {teamMatches.map(match => {
              const opponentId = match.team_a_id === teamId ? match.team_b_id : match.team_a_id;
              const opponent = teams.find(t => t.id === opponentId);
              const isCompleted = match.status === 'completed';
              
              return (
                <div key={match.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex-1 text-right">
                        <span className="font-bold">{team.name.split(':')[0]}</span>
                    </div>
                    <div className="flex-grow-0 flex-shrink-0 text-center mx-4">
                        {isCompleted ? (
                             <span className="text-xl font-mono font-bold">{match.team_a_score} - {match.team_b_score}</span>
                        ) : (
                             <span className="text-lg font-bold text-gray-500">VS</span>
                        )}
                        <div className="mt-1">{getResultBadge(match)}</div>
                    </div>
                    <div className="flex-1 text-left">
                        <span className="font-bold">{opponent?.name.split(':')[0]}</span>
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