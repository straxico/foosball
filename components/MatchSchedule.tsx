import React, { useState } from 'react';
import { Match, Team } from '../types';

interface MatchScheduleProps {
  matches: Match[];
  teams: Team[];
  isAdmin: boolean;
  onUpdateMatch: (matchId: number, scoreA: number, scoreB: number) => void;
  onUpdateMatchDate: (matchId: number, newDate: string) => void;
}

const MatchCard: React.FC<{
    match: Match;
    teamA: Team;
    teamB: Team;
    isAdmin: boolean;
    onUpdateMatch: (matchId: number, scoreA: number, scoreB: number) => void;
    onUpdateMatchDate: (matchId: number, newDate: string) => void;
}> = ({ match, teamA, teamB, isAdmin, onUpdateMatch, onUpdateMatchDate }) => {
    const [scoreA, setScoreA] = useState<string>(match.team_a_score?.toString() ?? '');
    const [scoreB, setScoreB] = useState<string>(match.team_b_score?.toString() ?? '');

    const handleUpdateResult = () => {
        const numA = parseInt(scoreA, 10);
        const numB = parseInt(scoreB, 10);
        if (!isNaN(numA) && !isNaN(numB)) {
            onUpdateMatch(match.id, numA, numB);
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.value) {
            onUpdateMatchDate(match.id, e.target.value);
        }
    };
    
    const isCompleted = match.status === 'completed';

    return (
        <div className="group bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl p-5 flex flex-col gap-4 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.02]" dir="rtl">
            <div className="flex justify-between items-center text-center">
                <div className="w-2/5 text-right">
                    <span className="font-semibold text-sm sm:text-base block transition-colors group-hover:text-blue-400">{teamA.name}</span>
                    <span className="text-xs text-gray-500">{teamA.players.map(p => p.name.split(' ')[0]).join('، ')}</span>
                </div>
                <div className="w-1/5 flex flex-col items-center">
                    <span className="text-gray-400 text-xs mb-1">{isCompleted ? '⚡' : '⚔️'}</span>
                    <span className="text-gray-400 text-sm font-bold">VS</span>
                </div>
                <div className="w-2/5 text-left">
                    <span className="font-semibold text-sm sm:text-base block transition-colors group-hover:text-blue-400">{teamB.name}</span>
                    <span className="text-xs text-gray-500">{teamB.players.map(p => p.name.split(' ')[0]).join('، ')}</span>
                </div>
            </div>

            {isAdmin && (
                <div className="flex flex-col gap-2 pt-3 border-t border-gray-700/50">
                    <label htmlFor={`match-date-${match.id}`} className="text-xs text-gray-400 flex items-center gap-1">
                        📅 {isCompleted ? "تاریخ بازی" : "تغییر تاریخ بازی"}
                    </label>
                    {isCompleted ? (
                         <p className="text-sm text-gray-500 bg-gray-900/50 p-2 rounded-lg">تاریخ بازی‌های انجام شده قابل تغییر نیست.</p>
                    ) : (
                        <input
                            type="date"
                            id={`match-date-${match.id}`}
                            defaultValue={match.match_date?.split('T')[0] || ''}
                            onChange={handleDateChange}
                            className="bg-gray-700/70 text-white rounded-lg p-2 text-sm w-full border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                    )}
                </div>
            )}

            {(isCompleted || isAdmin) && (
                <div className="flex flex-col gap-3 pt-3 border-t border-gray-700/50">
                    <div className="flex justify-center items-center gap-4">
                        {isAdmin ? (
                            <>
                                <input 
                                    type="number" 
                                    placeholder="-" 
                                    value={scoreA} 
                                    onChange={(e) => setScoreA(e.target.value)} 
                                    className="w-16 bg-gray-700/70 text-center rounded-lg p-2 text-xl font-bold border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                                />
                                <span className="text-2xl font-bold text-gray-500">:</span>
                                <input 
                                    type="number" 
                                    placeholder="-" 
                                    value={scoreB} 
                                    onChange={(e) => setScoreB(e.target.value)} 
                                    className="w-16 bg-gray-700/70 text-center rounded-lg p-2 text-xl font-bold border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                                />
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{match.team_a_score}</span>
                                <span className="text-2xl font-bold text-gray-500">:</span>
                                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">{match.team_b_score}</span>
                            </div>
                        )}
                    </div>
                    {isAdmin && (
                        <button 
                            onClick={handleUpdateResult} 
                            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-2 px-4 rounded-lg text-sm w-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50"
                        >
                            💾 ذخیره نتیجه
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};


const MatchSchedule: React.FC<MatchScheduleProps> = ({ matches, teams, isAdmin, onUpdateMatch, onUpdateMatchDate }) => {
  const getTeamById = (id: number) => teams.find(t => t.id === id);

  const groupedMatches = matches.reduce((acc, match) => {
    const date = match.match_date || 'بدون تاریخ';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  const sortedDates = Object.keys(groupedMatches).sort((a, b) => {
    if (a === 'بدون تاریخ') return 1;
    if (b === 'بدون تاریخ') return -1;
    return new Date(a).getTime() - new Date(b).getTime();
  });

  const formatDate = (dateString: string) => {
    if (dateString === 'بدون تاریخ') return dateString;
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'full' }).format(date);
    } catch {
        return dateString;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400" dir="rtl">
        📅 برنامه کامل بازی‌ها
      </h2>
      {matches.length === 0 && (
        <div className="text-center p-10 bg-gray-800/50 rounded-xl border border-gray-700/50">
          <p className="text-gray-400 text-lg">هیچ بازی برای نمایش وجود ندارد.</p>
        </div>
      )}
      {sortedDates.map(date => (
        <div key={date} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200 bg-gradient-to-r from-gray-700/70 to-gray-800/70 p-3 rounded-xl mb-4 text-center border border-gray-700/50 shadow-lg" dir="rtl">
            📆 {formatDate(date)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedMatches[date].map(match => {
              const teamA = getTeamById(match.team_a_id);
              const teamB = getTeamById(match.team_b_id);

              if (!teamA || !teamB) return null;
              return (
                <MatchCard
                  key={match.id}
                  match={match}
                  teamA={teamA}
                  teamB={teamB}
                  isAdmin={isAdmin}
                  onUpdateMatch={onUpdateMatch}
                  onUpdateMatchDate={onUpdateMatchDate}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchSchedule;