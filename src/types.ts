/**
 * Type definitions for NFL schedule data
 */

export interface GameResult {
  opponent: string;
  result: 'WIN' | 'LOSS' | 'TIE' | 'NOT_PLAYED';
}

export interface TeamSchedule {
  [week: number]: GameResult;
}

export interface Schedule {
  [teamName: string]: TeamSchedule;
}

export interface ESPNEvent {
  $ref: string;
}

export interface ESPNData {
  items: ESPNEvent[];
}

export interface ESPNEventDetail {
  week?: {
    number: number;
  };
  competitions?: Array<{
    $ref: string;
  }>;
}

export interface ESPNCompetition {
  status?: {
    type?: {
      name: string;
    };
  };
  competitors?: ESPNCompetitor[];
}

export interface ESPNCompetitor {
  homeAway: 'home' | 'away';
  winner?: boolean;
  team: {
    $ref: string;
  };
}

export interface ESPNTeam {
  displayName: string;
}
