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
        <div className="bg-gray-800 rounded-lg p-4 flex flex-col gap-4" dir="rtl">
            <div className="flex justify-between items-center text-center">
                <span className="w-2/5 font-semibold text-sm sm:text-base text-right">{teamA.name}</span>
                <div className="w-1/5 text-gray-400 text-sm">VS</div>
                <span className="w-2/5 font-semibold text-sm sm:text-base text-left">{teamB.name}</span>
            </div>

            {isAdmin && (
                <div className="flex flex-col gap-2 pt-2 border-t border-gray-700">
                    <label htmlFor={`match-date-${match.id}`} className="text-xs text-gray-400">
                        {isCompleted ? "تاریخ بازی" : "تغییر تاریخ بازی"}
                    </label>
                    {isCompleted ? (
                         <p className="text-sm text-gray-500">تاریخ بازی‌های انجام شده قابل تغییر نیست.</p>
                    ) : (
                        <input
                            type="date"
                            id={`match-date-${match.id}`}
                            defaultValue={match.match_date?.split('T')[0] || ''}
                            onChange={handleDateChange}
                            className="bg-gray-700 text-white rounded p-1 text-sm w-full"
                        />
                    )}
                </div>
            )}

            {(isCompleted || isAdmin) && (
                <div className="flex flex-col gap-3">
                    <div className="flex justify-center items-center gap-4">
                        {isAdmin ? (
                            <>
                                <input type="number" placeholder="-" value={scoreA} onChange={(e) => setScoreA(e.target.value)} className="w-14 bg-gray-700 text-center rounded p-1"/>
                                <span className="text-xl font-bold">:</span>
                                <input type="number" placeholder="-" value={scoreB} onChange={(e) => setScoreB(e.target.value)} className="w-14 bg-gray-700 text-center rounded p-1"/>
                            </>
                        ) : (
                            <span className="text-2xl font-bold tracking-wider">{match.team_a_score} : {match.team_b_score}</span>
                        )}
                    </div>
                    {isAdmin && <button onClick={handleUpdateResult} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-4 rounded text-sm w-full transition-colors">ذخیره نتیجه</button>}
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

  const sortedDates = Object.keys(groupedMatches).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const formatDate = (dateString: string) => {
    try {
        return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'full' }).format(new Date(dateString));
    } catch {
        return dateString;
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-300" dir="rtl">برنامه کامل بازی‌ها</h2>
      {matches.length === 0 && <p className="text-center text-gray-400">هیچ بازی برای نمایش وجود ندارد.</p>}
      {sortedDates.map(date => (
        <div key={date}>
          <h3 className="text-lg font-semibold text-gray-300 bg-gray-700/50 p-2 rounded-md mb-4 text-center" dir="rtl">
            {formatDate(date)}
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