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
}> = ({ match, teamA, teamB, userPrediction, onPredict }) => {
    
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
             <div className="bg-gray-800 rounded-lg p-4 flex flex-col gap-3 shadow-lg" dir="rtl">
                <div className="flex justify-between items-center text-center">
                    <span className="w-2/5 font-semibold text-sm sm:text-base text-right">{teamA.name}</span>
                    <div className="w-1/5 text-gray-400 text-lg font-bold">{match.team_a_score} : {match.team_b_score}</div>
                    <span className="w-2/5 font-semibold text-sm sm:text-base text-left">{teamB.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-700 text-gray-400">
                    <span>پیش‌بینی شما: <span className="font-semibold text-white">{userPrediction ? predictionText[userPrediction] : '---'}</span></span>
                    {actualResult && userPrediction && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {isCorrect ? 'درست' : 'نادرست'}
                        </span>
                    )}
                </div>
            </div>
        )
    }

    const PredictionButton: React.FC<{ result: PredictionResult; label: string }> = ({ result, label }) => (
        <button
            onClick={() => onPredict(match.id, result)}
            className={`w-full py-2 px-2 text-sm rounded-lg transition-all duration-200 transform hover:scale-105 ${
                userPrediction === result
                    ? 'bg-blue-600 text-white font-bold shadow-lg ring-2 ring-blue-400'
                    : 'bg-gray-700 hover:bg-blue-500'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="bg-gray-800 rounded-lg p-4 flex flex-col gap-4 shadow-lg" dir="rtl">
            <div className="flex justify-between items-center text-center">
                <span className="w-2/5 font-semibold text-sm sm:text-base text-right">{teamA.name}</span>
                <div className="w-1/5 text-gray-400 text-sm">VS</div>
                <span className="w-2/5 font-semibold text-sm sm:text-base text-left">{teamB.name}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-700">
                <PredictionButton result="teamA" label={`برد ${teamA.name.split(':')[0]}`} />
                <PredictionButton result="draw" label="مساوی" />
                <PredictionButton result="teamB" label={`برد ${teamB.name.split(':')[0]}`} />
            </div>
        </div>
    );
};

const PredictionView: React.FC<PredictionViewProps> = ({ matches, teams, predictions, user, onPredict, onLoginClick }) => {
  const getTeamById = (id: number) => teams.find(t => t.id === id);
  
  if (!user) {
    return (
      <div className="text-center bg-gray-800/50 p-8 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4">برای ثبت پیش‌بینی وارد شوید</h3>
        <p className="text-gray-400 mb-6">برای شرکت در بخش پیش‌بینی و ثبت امتیاز، لطفاً وارد حساب کاربری خود شوید یا یک حساب جدید بسازید.</p>
        <button 
          onClick={onLoginClick} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          ورود / ثبت‌نام
        </button>
      </div>
    );
  }

  const userPredictedMatchIds = new Set(predictions.map(p => p.match_id));

  const matchesToShow = matches.filter(m => 
    m.status === 'scheduled' || 
    (m.status === 'completed' && userPredictedMatchIds.has(m.id))
  );

  const groupedMatches = matchesToShow.reduce((acc, match) => {
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
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-300" dir="rtl">پیش‌بینی بازی‌ها</h2>
      
      {matchesToShow.length > 0 ? (
        sortedDates.map(date => (
          <div key={date}>
            <h3 className="text-lg font-semibold text-gray-300 bg-gray-700/50 p-2 rounded-md mb-4 text-center" dir="rtl">
              {formatDate(date)}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedMatches[date].map(match => {
                const teamA = getTeamById(match.team_a_id);
                const teamB = getTeamById(match.team_b_id);
                const userPrediction = predictions.find(p => p.match_id === match.id && p.user_id === user.id);

                if (!teamA || !teamB) return null;
                
                return (
                  <PredictionCard
                    key={match.id}
                    match={match}
                    teamA={teamA}
                    teamB={teamB}
                    userPrediction={userPrediction?.prediction}
                    onPredict={onPredict}
                  />
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400">در حال حاضر بازی برای پیش‌بینی وجود ندارد یا شما هیچ پیش‌بینی ثبت‌شده‌ای برای بازی‌های تمام‌شده ندارید.</p>
      )}
    </div>
  );
};

export default PredictionView;