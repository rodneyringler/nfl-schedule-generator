/**
 * Excel spreadsheet generation using exceljs library
 */

import ExcelJS from 'exceljs';
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
export async function generateExcelSpreadsheet(
  schedule: Schedule,
  outputPath?: string
): Promise<string> {
  console.log('📊 Generating Excel spreadsheet...');

  // Determine number of weeks
  let maxWeek = 0;
  Object.values(schedule).forEach((teamSchedule) => {
    Object.keys(teamSchedule).forEach((week) => {
      maxWeek = Math.max(maxWeek, parseInt(week));
    });
  });

  console.log(`   Found ${maxWeek} weeks of games`);

  // Create workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('NFL 2025 Season');

  // Build header row
  const headerRow = worksheet.addRow(['Team']);
  for (let i = 1; i <= maxWeek; i++) {
    headerRow.getCell(i + 1).value = `Week ${i}`;
  }

  // Style header row
  headerRow.eachCell((cell, colNumber) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF' + COLORS.HEADER },
    };
    cell.font = {
      bold: true,
      color: { argb: 'FFFFFFFF' },
    };
    cell.alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
  });

  // Set header row height
  headerRow.height = 25;

  // Build data rows
  NFL_TEAMS.forEach((team) => {
    const row = worksheet.addRow([team]);
    const teamSchedule = schedule[team] || {};

    for (let week = 1; week <= maxWeek; week++) {
      const game = teamSchedule[week];
      const cell = row.getCell(week + 1);
      
      if (game) {
        cell.value = game.opponent;
        
        // Set background color based on result
        let bgColor = COLORS.NOT_PLAYED;
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
        
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF' + bgColor },
        };
      } else {
        cell.value = 'BYE';
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF' + COLORS.NOT_PLAYED },
        };
      }
      
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
    }

    // Style team name column (first column)
    row.getCell(1).font = {
      bold: true,
    };
    row.getCell(1).alignment = {
      vertical: 'middle',
    };
  });

  // Set column widths
  worksheet.getColumn(1).width = 25; // Team name column
  for (let i = 1; i <= maxWeek; i++) {
    worksheet.getColumn(i + 1).width = 22; // Week columns
  }

  // Determine output path
  const finalPath =
    outputPath || path.join(process.cwd(), 'NFL-2025-Season.xlsx');

  // Write file
  await workbook.xlsx.writeFile(finalPath);
  console.log(`✓ Spreadsheet saved to: ${finalPath}`);

  return finalPath;
}
