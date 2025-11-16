import React, { useState, useEffect, useCallback } from 'react';
import { Team, Match, Prediction, Profile, ProfileWithScore, TeamStats, PredictionResult, Session } from './types';
import { supabaseService } from './services/supabaseService';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import LeagueTable from './components/LeagueTable';
import MatchSchedule from './components/MatchSchedule';
import PredictionLeaderboard from './components/PredictionLeaderboard';
import PredictionView from './components/PredictionView';
import TeamDetails from './components/TeamDetails';
import Auth from './components/Auth';

type View = 'table' | 'schedule' | 'leaderboard' | 'predictions';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentView, setCurrentView] = useState<View>('table');
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [leaderboard, setLeaderboard] = useState<ProfileWithScore[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isAdmin = profile?.role === 'admin';

  const fetchData = useCallback(async (currentSession: Session | null) => {
    setIsLoading(true);
    try {
      const [fetchedTeams, fetchedMatches, fetchedLeaderboard] = await Promise.all([
        supabaseService.getTeams(),
        supabaseService.getMatches(),
        supabaseService.getLeaderboard(),
      ]);
      const fetchedStats = await supabaseService.calculateTeamStats(fetchedTeams, fetchedMatches);
      
        // Always fetch predictions so they can be shown publicly even when
        // a user is not logged in. The UI will use the `session` to decide
        // whether prediction controls are available for the current viewer.
        const fetchedPredictions = await supabaseService.getPredictions();

      setTeams(fetchedTeams);
      setMatches(fetchedMatches);
      setLeaderboard(fetchedLeaderboard);
      setTeamStats(fetchedStats);
      setPredictions(fetchedPredictions);

    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
        setIsLoading(false);
    }
  }, []);
  
  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      fetchData(session); // Fetch initial data based on initial session
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setShowAuthModal(false); // Close modal on login
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchData]);

  // Fetch profile when session changes
  useEffect(() => {
    if (session?.user) {
        supabaseService.getProfile(session.user.id).then(setProfile);
    } else {
        setProfile(null);
    }
  }, [session]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => fetchData(session))
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, fetchData]);

  const handleUpdateMatch = async (matchId: number, scoreA: number, scoreB: number) => {
    if (!isAdmin) return;
    await supabaseService.updateMatch(matchId, scoreA, scoreB);
  };

  const handleUpdateTeamName = async (teamId: number, newName: string) => {
    if (!isAdmin) return;
    await supabaseService.updateTeamName(teamId, newName);
  };

  const handleUpdateMatchDate = async (matchId: number, newDate: string) => {
    if (!isAdmin) return;
    await supabaseService.updateMatchDate(matchId, newDate);
  };

  const handlePredict = async (matchId: number, prediction: PredictionResult) => {
    if (!session) return;
    await supabaseService.addPrediction(matchId, session.user.id, prediction);
  };
  
  const handleSelectTeam = (teamId: number) => {
    setSelectedTeamId(teamId);
  };

  const handleBackToMain = () => {
    setSelectedTeamId(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-20">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-xl text-gray-300 animate-pulse">⚽ در حال بارگذاری...</p>
        </div>
      );
    }

    if (selectedTeamId) {
        return <TeamDetails 
            teamId={selectedTeamId}
            teams={teams}
            matches={matches}
            stats={teamStats}
            onBack={handleBackToMain}
        />;
    }

    switch (currentView) {
      case 'table':
        return <LeagueTable 
            teams={teams} 
            stats={teamStats} 
            isAdmin={isAdmin}
            onSelectTeam={handleSelectTeam}
            onUpdateTeamName={handleUpdateTeamName}
        />;
      case 'predictions':
        return <PredictionView
            matches={matches}
            teams={teams}
            predictions={predictions}
            user={session?.user ?? null}
            onPredict={handlePredict}
            onLoginClick={() => setShowAuthModal(true)}
        />;
      case 'schedule':
        return (
          <MatchSchedule
            matches={matches}
            teams={teams}
            isAdmin={isAdmin}
            onUpdateMatch={handleUpdateMatch}
            onUpdateMatchDate={handleUpdateMatchDate}
          />
        );
      case 'leaderboard':
        return <PredictionLeaderboard users={leaderboard} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {showAuthModal && <Auth onClose={() => setShowAuthModal(false)} />}
      
      {!selectedTeamId && (
        <Header
          session={session}
          currentView={currentView}
          onViewChange={setCurrentView}
          isAdmin={isAdmin}
          onLoginClick={() => setShowAuthModal(true)}
        />
      )}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
      
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default App;