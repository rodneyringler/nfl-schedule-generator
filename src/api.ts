/**
 * ESPN API integration for fetching NFL schedule data
 */

import {
  ESPNData,
  ESPNEventDetail,
  ESPNCompetition,
  ESPNTeam,
  Schedule,
} from './types';
import { NFL_TEAMS } from './nfl-teams';

const ESPN_API_URL =
  'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2025/types/2/events?limit=1000';

/**
 * Fetch NFL schedule from ESPN API
 */
export async function fetchNFLSchedule(): Promise<ESPNData> {
  console.log('📡 Fetching NFL 2025 schedule from ESPN API...');

  const response = await fetch(ESPN_API_URL);

  if (!response.ok) {
    throw new Error(`ESPN API returned status ${response.status}`);
  }

  const data: ESPNData = await response.json();
  console.log(`✓ Found ${data.items?.length || 0} games`);

  return data;
}

/**
 * Process ESPN data into a schedule matrix
 */
export async function processScheduleData(espnData: ESPNData): Promise<Schedule> {
  const schedule: Schedule = {};

  // Initialize schedule for all teams
  NFL_TEAMS.forEach((team) => {
    schedule[team] = {};
  });

  if (!espnData.items || espnData.items.length === 0) {
    console.log('⚠️  No games found in ESPN data');
    return schedule;
  }

  console.log('⚙️  Processing schedule data...');

  let processedCount = 0;

  // Process each game
  for (const eventRef of espnData.items) {
    try {
      // Fetch detailed event data
      const eventResponse = await fetch(eventRef.$ref);
      const event: ESPNEventDetail = await eventResponse.json();

      // Get week number
      const week = event.week?.number || 1;

      // Fetch competition details
      if (event.competitions && event.competitions.length > 0) {
        const compRef = event.competitions[0].$ref;
        const compResponse = await fetch(compRef);
        const competition: ESPNCompetition = await compResponse.json();

        // Get competitors
        if (competition.competitors && competition.competitors.length === 2) {
          const homeCompRef = competition.competitors.find(
            (c) => c.homeAway === 'home'
          );
          const awayCompRef = competition.competitors.find(
            (c) => c.homeAway === 'away'
          );

          if (homeCompRef && awayCompRef) {
            const homeTeamResponse = await fetch(homeCompRef.team.$ref);
            const awayTeamResponse = await fetch(awayCompRef.team.$ref);

            const homeTeam: ESPNTeam = await homeTeamResponse.json();
            const awayTeam: ESPNTeam = await awayTeamResponse.json();

            const homeTeamName = homeTeam.displayName;
            const awayTeamName = awayTeam.displayName;

            // Determine game status
            const status = competition.status?.type?.name || 'STATUS_SCHEDULED';
            const homeWinner = homeCompRef.winner;
            const awayWinner = awayCompRef.winner;

            let homeResult: 'WIN' | 'LOSS' | 'TIE' | 'NOT_PLAYED' = 'NOT_PLAYED';
            let awayResult: 'WIN' | 'LOSS' | 'TIE' | 'NOT_PLAYED' = 'NOT_PLAYED';

            if (status === 'STATUS_FINAL') {
              if (homeWinner && awayWinner) {
                // Tie
                homeResult = 'TIE';
                awayResult = 'TIE';
              } else if (homeWinner) {
                homeResult = 'WIN';
                awayResult = 'LOSS';
              } else if (awayWinner) {
                homeResult = 'LOSS';
                awayResult = 'WIN';
              }
            }

            // Store in schedule
            if (schedule[homeTeamName]) {
              schedule[homeTeamName][week] = {
                opponent: `vs ${awayTeamName}`,
                result: homeResult,
              };
            }

            if (schedule[awayTeamName]) {
              schedule[awayTeamName][week] = {
                opponent: `@ ${homeTeamName}`,
                result: awayResult,
              };
            }

            processedCount++;
          }
        }
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(
        '⚠️  Error processing event:',
        error instanceof Error ? error.message : error
      );
      continue;
    }
  }

  console.log(`✓ Processed ${processedCount} games`);

  return schedule;
}
