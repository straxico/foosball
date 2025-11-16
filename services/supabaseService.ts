import { supabase } from '../supabaseClient';
import { Team, Match, Prediction, Profile, PredictionResult, TeamStats, ProfileWithScore } from '../types';

class SupabaseService {
  
  async getTeams(): Promise<Team[]> {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        id,
        name,
        group_name,
        players (
          id,
          name,
          team_id
        )
      `);
    if (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
    return data || [];
  }
  
  async getMatches(): Promise<Match[]> {
    const { data, error } = await supabase.from('matches').select('*').order('match_date', { ascending: true }).order('id', { ascending: true });
    if (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
    return data || [];
  }
  
  async getProfiles(): Promise<Profile[]> {
     const { data, error } = await supabase.from('profiles').select('*');
     if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
     }
     return data || [];
  }

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      // Don't throw an error if profile doesn't exist, just return null
      console.error('Error fetching profile:', error.message);
      return null;
    }
    return data;
  }

  async getPredictions(): Promise<Prediction[]> {
    const { data, error } = await supabase.from('predictions').select('*');
    if (error) {
        console.error('Error fetching predictions:', error);
        throw error;
    }
    return data || [];
  }

  async addPrediction(matchId: number, userId: string, prediction: PredictionResult): Promise<Prediction> {
    const { data, error } = await supabase
      .from('predictions')
      .upsert({ match_id: matchId, user_id: userId, prediction }, { onConflict: 'match_id,user_id' })
      .select()
      .single();

    if (error) {
      console.error('Error adding prediction:', error);
      throw error;
    }
    return data;
  }
  
  async updateMatch(matchId: number, teamAScore: number, teamBScore: number): Promise<Match | null> {
    const { data, error } = await supabase
      .from('matches')
      .update({ team_a_score: teamAScore, team_b_score: teamBScore, status: 'completed' })
      .eq('id', matchId)
      .select()
      .single();

    if (error) {
        console.error('Error updating match:', error);
        return null;
    }
    
    return data;
  }

  async updateTeamName(teamId: number, newName: string): Promise<Team | null> {
    const { data, error } = await supabase
        .from('teams')
        .update({ name: newName })
        .eq('id', teamId)
        .select()
        .single();
    
    if (error) {
        console.error('Error updating team name:', error);
        return null;
    }

    return data;
  }

  async updateMatchDate(matchId: number, newDate: string): Promise<Match | null> {
    const { data, error } = await supabase
        .from('matches')
        .update({ match_date: newDate })
        .eq('id', matchId)
        .select()
        .single();
    
    if (error) {
        console.error('Error updating match date:', error);
        return null;
    }

    return data;
  }
  
  async getLeaderboard(): Promise<ProfileWithScore[]> {
    const [profiles, matchesResponse, predictions] = await Promise.all([
      this.getProfiles(),
      supabase.from('matches').select('*'),
      this.getPredictions(),
    ]);

    const allMatches = matchesResponse.data || [];
    const completedMatches = allMatches.filter(m => m.status === 'completed');

    const userScores: { [userId: string]: number } = {};
    const userTotals: { [userId: string]: number } = {};
    const userCorrect: { [userId: string]: number } = {};
    const userWrong: { [userId: string]: number } = {};
    const userPending: { [userId: string]: number } = {};
    profiles.forEach(p => {
      userScores[p.id] = 0;
      userTotals[p.id] = 0;
      userCorrect[p.id] = 0;
      userWrong[p.id] = 0;
      userPending[p.id] = 0;
    });
    
    for (const match of completedMatches) {
        if (match.team_a_score === null || match.team_b_score === null) continue;

        const matchPredictions = predictions.filter(p => p.match_id === match.id);
        
        let actualResult: PredictionResult;
        if (match.team_a_score > match.team_b_score) {
            actualResult = 'teamA';
        } else if (match.team_b_score > match.team_a_score) {
            actualResult = 'teamB';
        } else {
            actualResult = 'draw';
        }

        for (const prediction of matchPredictions) {
            if (prediction.prediction === actualResult) {
                userScores[prediction.user_id] = (userScores[prediction.user_id] || 0) + 1;
            userCorrect[prediction.user_id] = (userCorrect[prediction.user_id] || 0) + 1;
            }
        }
    }
      // Count totals and pending/wrong for all matches
      for (const p of predictions) {
        userTotals[p.user_id] = (userTotals[p.user_id] || 0) + 1;
        // find match by id
        const match = allMatches.find(m => m.id === p.match_id);
        if (!match) continue;
        if (match.status !== 'completed') {
          userPending[p.user_id] = (userPending[p.user_id] || 0) + 1;
          continue;
        }
        // completed match; check if prediction matched
        let actualResult: PredictionResult | null = null;
        if (match.team_a_score !== null && match.team_b_score !== null) {
          if (match.team_a_score > match.team_b_score) actualResult = 'teamA';
          else if (match.team_b_score > match.team_a_score) actualResult = 'teamB';
          else actualResult = 'draw';
        }
        if (actualResult && p.prediction === actualResult) {
          // counted above already in userCorrect via the previous loop
        } else {
          userWrong[p.user_id] = (userWrong[p.user_id] || 0) + 1;
        }
      }
    return profiles.map(profile => ({
      ...profile,
      score: userScores[profile.id] || 0,
      totalPredictions: userTotals[profile.id] || 0,
      correctPredictions: userCorrect[profile.id] || 0,
      wrongPredictions: userWrong[profile.id] || 0,
      pendingPredictions: userPending[profile.id] || 0,
    })).sort((a, b) => (b.score - a.score));
  }

  async calculateTeamStats(teams: Team[], matches: Match[]): Promise<TeamStats[]> {
    const completedMatches = matches.filter(m => m.status === 'completed');
    const statsMap = new Map<number, TeamStats>();

    teams.forEach(team => {
        statsMap.set(team.id, {
            teamId: team.id,
            played: 0, won: 0, drawn: 0, lost: 0,
            goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0
        });
    });

    completedMatches.forEach(match => {
        const { team_a_id, team_b_id, team_a_score, team_b_score } = match;
        if (team_a_score === null || team_b_score === null) return;
        
        const teamAStats = statsMap.get(team_a_id)!;
        const teamBStats = statsMap.get(team_b_id)!;

        teamAStats.played++;
        teamBStats.played++;

        teamAStats.goalsFor += team_a_score;
        teamBStats.goalsFor += team_b_score;

        teamAStats.goalsAgainst += team_b_score;
        teamBStats.goalsAgainst += team_a_score;

        teamAStats.goalDifference = teamAStats.goalsFor - teamAStats.goalsAgainst;
        teamBStats.goalDifference = teamBStats.goalsFor - teamBStats.goalsAgainst;

        if (team_a_score > team_b_score) {
            teamAStats.won++;
            teamBStats.lost++;
            teamAStats.points += 3;
        } else if (team_b_score > team_a_score) {
            teamBStats.won++;
            teamAStats.lost++;
            teamBStats.points += 3;
        } else {
            teamAStats.drawn++;
            teamBStats.drawn++;
            teamAStats.points += 1;
            teamBStats.points += 1;
        }
    });

    return Array.from(statsMap.values());
  }
}

export const supabaseService = new SupabaseService();