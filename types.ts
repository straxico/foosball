import { Session } from '@supabase/supabase-js';

export interface Player {
  id: number;
  name: string;
  team_id: number;
}

export interface Team {
  id: number;
  name: string;
  group_name: string;
  players: Player[];
}

export interface Match {
  id: number;
  team_a_id: number;
  team_b_id: number;
  team_a_score: number | null;
  team_b_score: number | null;
  status: 'scheduled' | 'completed';
  match_date: string | null;
}

export type PredictionResult = 'teamA' | 'teamB' | 'draw';

export interface Prediction {
  id?: number;
  match_id: number;
  user_id: string;
  prediction: PredictionResult;
}

export interface Profile {
  id: string;
  username: string;
  role: string;
}

export interface ProfileWithScore extends Profile {
    score: number;
  totalPredictions?: number;
  correctPredictions?: number;
  wrongPredictions?: number;
  pendingPredictions?: number;
}


export interface TeamStats {
  teamId: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export type { Session };