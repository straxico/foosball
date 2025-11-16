import React from 'react';
import { Match, Team, Prediction, PredictionResult } from '../types';
import { User } from '@supabase/supabase-js';

interface PredictionViewProps {
  matches: Match[];
  teams: Team[];
  predictions: Prediction[];
  user: User | null;
  onPredict: (matchId: number, prediction: PredictionResult) => void;
  onLoginClick: () => void;
}

const PredictionCard: React.FC<{
    match: Match;
    teamA: Team;
    teamB: Team;
    userPrediction?: PredictionResult;
    onPredict: (matchId: number, prediction: PredictionResult) => void;
  predictionsForMatch?: Prediction[];
  allowPredict?: boolean;
  teamPlayersA?: string[];
  teamPlayersB?: string[];
  teamNameA?: string;
  teamNameB?: string;
}> = ({ match, teamA, teamB, userPrediction, onPredict, predictionsForMatch, allowPredict = true, teamPlayersA = [], teamPlayersB = [], teamNameA = '', teamNameB = '' }) => {
    
    const isCompleted = match.status === 'completed';

    if (isCompleted) {
        let actualResult: PredictionResult | null = null;
        if (match.team_a_score !== null && match.team_b_score !== null) {
            if (match.team_a_score > match.team_b_score) actualResult = 'teamA';
            else if (match.team_b_score > match.team_a_score) actualResult = 'teamB';
            else actualResult = 'draw';
        }

        const isCorrect = actualResult && userPrediction === actualResult;
        
        const predictionText = {
            teamA: `برد ${teamA.name.split(':')[0]}`,
            teamB: `برد ${teamB.name.split(':')[0]}`,
            draw: 'مساوی'
        };

        return (
             <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl p-5 flex flex-col gap-3 shadow-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300" dir="rtl">
                <div className="flex justify-between items-center text-center">
                    <span className="w-2/5 font-semibold text-sm sm:text-base text-right">{teamA.name}</span>
                    <div className="w-1/5 flex flex-col items-center">
                        <span className="text-xs text-gray-500 mb-1">⚡</span>
                        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                            {match.team_a_score} : {match.team_b_score}
                        </div>
                    </div>
                    <span className="w-2/5 font-semibold text-sm sm:text-base text-left">{teamB.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-3 border-t border-gray-700/50 text-gray-400">
                    <span>پیش‌بینی شما: <span className="font-semibold text-white">{userPrediction ? predictionText[userPrediction] : '---'}</span></span>
                    {actualResult && userPrediction && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${isCorrect ? 'bg-gradient-to-r from-green-500 to-green-600 text-white animate-pulse' : 'bg-gradient-to-r from-red-500 to-red-600 text-white'}`}>
                            {isCorrect ? '✓ درست' : '✗ نادرست'}
                        </span>
                    )}
                </div>
            </div>
        )
    }

    const PredictionButton: React.FC<{ result: PredictionResult; label: string }> = ({ result, label }) => (
        <button
        onClick={() => { if (allowPredict) onPredict(match.id, result); }}
            className={`group w-full py-3 px-2 text-sm rounded-xl transition-all duration-300 transform hover:scale-105 ${
                userPrediction === result
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-xl shadow-blue-500/50 ring-2 ring-blue-400 scale-105'
                    : 'bg-gray-700/70 hover:bg-gradient-to-r hover:from-blue-500/50 hover:to-purple-500/50 border border-gray-600 hover:border-blue-500'
            }`}
        >
            <span className="transition-transform group-hover:scale-110 inline-block">{label}</span>
        </button>
    );

    return (
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl p-5 flex flex-col gap-4 shadow-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20" dir="rtl">
            <div className="flex justify-between items-center text-center">
                <span className="w-2/5 font-semibold text-sm sm:text-base text-right flex items-center justify-end gap-2">
                  <span>{teamA.name}</span>
                  {/* group icon with hover tooltip */}
                  <div className="relative group">
                    <span className="text-xs bg-gray-800/60 p-1 rounded-full cursor-default">👥</span>
                    <div className="absolute right-0 -top-2 translate-y-[-105%] hidden group-hover:block w-48 z-20">
                      <div className="bg-gray-800 text-gray-100 p-3 rounded-lg border border-gray-700 shadow-lg text-sm">
                        <div className="text-xs text-gray-400 mb-1">اعضای تیم: {teamNameA ?? ''}</div>
                        <div className="max-h-36 overflow-y-auto">
                          {(teamPlayersA ?? []).map((p, idx) => (
                            <div key={idx} className="mb-1">{p}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </span>
                <div className="w-1/5 flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">⚔️</span>
                    <span className="text-gray-400 text-sm font-bold">VS</span>
                </div>
                    <span className="w-2/5 font-semibold text-sm sm:text-base text-left flex items-center gap-2">
                      <div className="relative group">
                        <span className="text-xs bg-gray-800/60 p-1 rounded-full cursor-default">👥</span>
                        <div className="absolute left-0 -top-2 translate-y-[-105%] hidden group-hover:block w-48 z-20">
                          <div className="bg-gray-800 text-gray-100 p-3 rounded-lg border border-gray-700 shadow-lg text-sm">
                            <div className="text-xs text-gray-400 mb-1">اعضای تیم: {teamNameB ?? ''}</div>
                            <div className="max-h-36 overflow-y-auto">
                              {(teamPlayersB ?? []).map((p, idx) => (
                                <div key={idx} className="mb-1">{p}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <span>{teamB.name}</span>
                    </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-700/50">
                {allowPredict ? (
                  <>
                    <PredictionButton result="teamA" label={`برد ${teamA.name.split(':')[0]}`} />
                    <PredictionButton result="draw" label="مساوی" />
                    <PredictionButton result="teamB" label={`برد ${teamB.name.split(':')[0]}`} />
                  </>
                ) : (
                  <div className="col-span-3 text-sm text-gray-400 text-center py-2">برای ثبت پیش‌بینی باید وارد شوید</div>
                )}
            </div>
            {/* Show aggregate counts if available */}
            {predictionsForMatch && predictionsForMatch.length > 0 && (
              <div className="pt-3 text-sm text-gray-300 border-t border-gray-700/30">
                <div className="flex gap-3 items-center">
                  <span className="font-semibold">آمار پیش‌بینی‌ها:</span>
                  <span>🏆 {predictionsForMatch.filter(p => p.prediction === 'teamA').length}</span>
                  <span>🤝 {predictionsForMatch.filter(p => p.prediction === 'draw').length}</span>
                  <span>🏆 {predictionsForMatch.filter(p => p.prediction === 'teamB').length}</span>
                </div>
              </div>
            )}
        </div>
    );
};

const PredictionView: React.FC<PredictionViewProps> = ({ matches, teams, predictions, user, onPredict, onLoginClick }) => {
  const getTeamById = (id: number) => teams.find(t => t.id === id);
  
  const readOnly = !user;
  const readOnlyBanner = readOnly ? (
    <div className="text-center bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-2xl border border-gray-700/50 shadow-lg backdrop-blur-sm animate-fadeIn">
      <div className="text-4xl mb-2">👀</div>
      <h3 className="text-xl font-bold text-gray-100 mb-2">نمایش عمومی پیش‌بینی‌ها</h3>
      <p className="text-gray-400 mb-3">برای ثبت یا ویرایش پیش‌بینی‌ها باید وارد شوید — اما نتایج و آمار عمومی برای همه قابل مشاهده‌اند.</p>
      <button onClick={onLoginClick} className="text-sm underline text-blue-400">ورود / ثبت‌نام</button>
    </div>
  ) : null;

  const userPredictedMatchIds = new Set(predictions.filter(p => p.user_id === user?.id).map(p => p.match_id));

  // If the user is not logged in we want to show all scheduled and completed matches
  // with public predictions. If they are logged in, keep the previous behavior so
  // they see scheduled matches and the completed matches they already predicted.
  const matchesToShow = matches.filter(m => {
    if (readOnly) return m.status === 'scheduled' || m.status === 'completed';
    return m.status === 'scheduled' || (m.status === 'completed' && userPredictedMatchIds.has(m.id));
  });

  const groupedMatches = matchesToShow.reduce((acc, match) => {
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
      <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400" dir="rtl">
        🎯 پیش‌بینی بازی‌ها
      </h2>
      
      {readOnlyBanner}
      {matchesToShow.length > 0 ? (
        sortedDates.map(date => (
          <div key={date} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200 bg-gradient-to-r from-gray-700/70 to-gray-800/70 p-3 rounded-xl mb-4 text-center border border-gray-700/50 shadow-lg" dir="rtl">
              📆 {formatDate(date)}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedMatches[date].map(match => {
                const teamA = getTeamById(match.team_a_id);
                const teamB = getTeamById(match.team_b_id);
                // Only check a user's prediction if they're logged in
                const userPrediction = user ? predictions.find(p => p.match_id === match.id && p.user_id === user.id) : undefined;

                if (!teamA || !teamB) return null;

                // Get members of the group (players across all teams with same group name)
                const teamPlayersA = teamA.players.map(p => p.name);
                const teamPlayersB = teamB.players.map(p => p.name);
                
                return (
                  <PredictionCard
                    key={match.id}
                    match={match}
                    teamA={teamA}
                    teamB={teamB}
                    userPrediction={userPrediction?.prediction}
                    onPredict={onPredict}
                    predictionsForMatch={predictions.filter(p => p.match_id === match.id)}
                    allowPredict={!readOnly}
                    teamPlayersA={teamPlayersA}
                    teamPlayersB={teamPlayersB}
                    teamNameA={teamA.name}
                    teamNameB={teamB.name}
                  />
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center p-10 bg-gray-800/50 rounded-xl border border-gray-700/50">
          <span className="text-6xl block mb-4">🎯</span>
          <p className="text-gray-400 text-lg">در حال حاضر بازی برای پیش‌بینی وجود ندارد.</p>
        </div>
      )}
    </div>
  );
};

export default PredictionView;