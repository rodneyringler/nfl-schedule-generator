/**
 * Excel spreadsheet generation using xlsx library
 */

import * as XLSX from 'xlsx';
import { Schedule } from './types';
import { NFL_TEAMS } from './nfl-teams';
import * as path from 'path';

/**
 * Color definitions (RGB hex values)
 */
const COLORS = {
  WIN: 'D4EDDA', // Light green
  LOSS: 'F5C6CB', // Light red
  TIE: 'FFF3CD', // Light yellow
  NOT_PLAYED: 'E9ECEF', // Light gray
  HEADER: '4A5568', // Dark gray for header
};

/**
 * Generate Excel spreadsheet from schedule data
 */
export function generateExcelSpreadsheet(
  schedule: Schedule,
  outputPath?: string
): string {
  console.log('📊 Generating Excel spreadsheet...');

  // Determine number of weeks
  let maxWeek = 0;
  Object.values(schedule).forEach((teamSchedule) => {
    Object.keys(teamSchedule).forEach((week) => {
      maxWeek = Math.max(maxWeek, parseInt(week));
    });
  });

  console.log(`   Found ${maxWeek} weeks of games`);

  // Build header row
  const headers = ['Team'];
  for (let i = 1; i <= maxWeek; i++) {
    headers.push(`Week ${i}`);
  }

  // Build data rows
  const data: any[][] = [headers];

  NFL_TEAMS.forEach((team) => {
    const row: any[] = [team];
    const teamSchedule = schedule[team] || {};

    for (let week = 1; week <= maxWeek; week++) {
      const game = teamSchedule[week];
      if (game) {
        row.push(game.opponent);
      } else {
        row.push('BYE');
      }
    }

    data.push(row);
  });

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  const colWidths = [{ wch: 25 }]; // Team name column
  for (let i = 1; i <= maxWeek; i++) {
    colWidths.push({ wch: 22 }); // Week columns
  }
  worksheet['!cols'] = colWidths;

  // Apply cell styling
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

  for (let R = range.s.r; R <= range.e.r; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[cellAddress];

      if (!cell) continue;

      // Initialize cell style
      if (!cell.s) cell.s = {};

      // Header row styling
      if (R === 0) {
        cell.s = {
          fill: {
            fgColor: { rgb: COLORS.HEADER },
          },
          font: {
            bold: true,
            color: { rgb: 'FFFFFF' },
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
          },
        };
      }
      // Data rows
      else {
        const teamIndex = R - 1;
        const team = NFL_TEAMS[teamIndex];
        const week = C;

        if (C === 0) {
          // Team name column - bold
          cell.s = {
            font: {
              bold: true,
            },
            alignment: {
              vertical: 'center',
            },
          };
        } else {
          // Game cells
          const teamSchedule = schedule[team] || {};
          const game = teamSchedule[week];

          let bgColor = COLORS.NOT_PLAYED;

          if (game) {
            switch (game.result) {
              case 'WIN':
                bgColor = COLORS.WIN;
                break;
              case 'LOSS':
                bgColor = COLORS.LOSS;
                break;
              case 'TIE':
                bgColor = COLORS.TIE;
                break;
              case 'NOT_PLAYED':
                bgColor = COLORS.NOT_PLAYED;
                break;
            }
          }

          cell.s = {
            fill: {
              fgColor: { rgb: bgColor },
            },
            alignment: {
              horizontal: 'center',
              vertical: 'center',
            },
          };
        }
      }
    }
  }

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'NFL 2025 Season');

  // Determine output path
  const finalPath =
    outputPath || path.join(process.cwd(), 'NFL-2025-Season.xlsx');

  // Write file
  XLSX.writeFile(workbook, finalPath);

  console.log(`✓ Spreadsheet saved to: ${finalPath}`);

  return finalPath;
}
