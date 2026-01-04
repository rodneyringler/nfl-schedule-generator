#!/usr/bin/env node

/**
 * NFL 2025 Season Schedule Generator
 *
 * This application fetches the NFL 2025 season schedule and results from ESPN's API
 * and generates a color-coded Excel spreadsheet showing each team's schedule.
 *
 * Color coding:
 * - Green: Win
 * - Red: Loss
 * - Yellow: Tie
 * - Gray: Game not played yet / BYE week
 */

import { fetchNFLSchedule, processScheduleData } from './api';
import { generateExcelSpreadsheet } from './excel-generator';

async function main() {
  console.log('🏈 NFL 2025 Season Schedule Generator\n');

  try {
    // Fetch schedule data from ESPN
    const espnData = await fetchNFLSchedule();

    // Process the data into our schedule format
    const schedule = await processScheduleData(espnData);

    // Generate Excel spreadsheet
    const outputPath = await generateExcelSpreadsheet(schedule);

    console.log('\n✅ Success!');
    console.log(`📄 Your NFL schedule is ready: ${outputPath}\n`);
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
    console.error('\nPossible issues:');
    console.error('  - No internet connection');
    console.error('  - ESPN API is unavailable');
    console.error('  - 2025 season data not yet available\n');
    process.exit(1);
  }
}

// Run the application
main();
