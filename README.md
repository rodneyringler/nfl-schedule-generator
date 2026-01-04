# 🏈 NFL 2025 Season Schedule Generator

A TypeScript application that automatically generates an Excel spreadsheet with the complete NFL 2025 season schedule and real-time game results, featuring color-coded outcomes.

## ✨ Features

- **📅 Complete Schedule**: Fetches all games for the 2025 NFL season
- **🎨 Color-Coded Results**:
  - 🟢 **Green** - Team won
  - 🔴 **Red** - Team lost
  - 🟡 **Yellow** - Tie game
  - ⚪ **Gray** - Game not played / BYE week
- **📊 Excel Output**: Generates a local `.xlsx` file you can open in Excel, Google Sheets, or any spreadsheet app
- **🔄 Real-Time Data**: Fetches the latest results from ESPN's API
- **💪 TypeScript**: Fully typed for better development experience

## 📋 Prerequisites

- **Node.js** version 18 or higher
- **npm** (comes with Node.js)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/rodneyringler/nfl-schedule-generator.git
cd nfl-schedule-generator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Generate the spreadsheet

```bash
npm run generate
```

That's it! The spreadsheet will be saved as `NFL-2025-Season.xlsx` in the project directory.

## 📖 Usage

### Quick Generation (Recommended)

```bash
npm run generate
```

This compiles the TypeScript code and runs the application.

### Development Mode

```bash
npm run dev
```

Runs the application directly from TypeScript source without building.

### Manual Build and Run

```bash
# Build the TypeScript code
npm run build

# Run the compiled code
npm start
```

## 📊 Spreadsheet Format

The generated spreadsheet contains:

- **Column A**: Team names (all 32 NFL teams in alphabetical order)
- **Columns B onward**: Weekly matchups (Week 1, Week 2, etc.)
- **Cell Content**:
  - `vs TeamName` - Home game
  - `@ TeamName` - Away game
  - `BYE` - Team has a bye week
- **Cell Colors**: Indicate game outcome (see color legend above)

### Example Row

| Team | Week 1 | Week 2 | Week 3 | ... |
|------|--------|--------|--------|-----|
| Kansas City Chiefs | vs Detroit Lions | @ Cincinnati Bengals | BYE | ... |

## 🛠️ Project Structure

```
nfl-schedule-generator/
├── src/
│   ├── index.ts              # Main entry point
│   ├── api.ts                # ESPN API integration
│   ├── excel-generator.ts    # Excel file generation
│   ├── nfl-teams.ts          # List of NFL teams
│   └── types.ts              # TypeScript type definitions
├── dist/                     # Compiled JavaScript (generated)
├── package.json              # Project dependencies
├── tsconfig.json             # TypeScript configuration
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

## 🔧 Configuration

By default, the spreadsheet is saved as `NFL-2025-Season.xlsx` in the project root. To customize the output location, you can modify the `generateExcelSpreadsheet` function call in `src/index.ts`:

```typescript
// Custom output path
const outputPath = generateExcelSpreadsheet(schedule, '/path/to/output.xlsx');
```

## 📡 Data Source

This application uses ESPN's unofficial API to fetch NFL schedule and results data. The API endpoint:

```
https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2025/types/2/events
```

**Note**: This is an unofficial API and may change without notice. The application includes error handling for API failures.

## 🐛 Troubleshooting

### "No games found in ESPN data"

The 2025 NFL season schedule might not be published yet, or the API might be temporarily unavailable. Try again later.

### "ESPN API returned status 403/500"

- Check your internet connection
- The ESPN API might be experiencing issues
- Try again in a few minutes

### "Module not found" errors

Make sure you've installed dependencies:

```bash
npm install
```

### Excel file won't open

- Ensure you have Excel, LibreOffice, or Google Sheets installed
- The file format is `.xlsx` (Excel 2007+)
- Try uploading to Google Drive and opening with Google Sheets

## 🔄 Updating Results During the Season

As the NFL season progresses and games are played, simply run the generator again to get updated results:

```bash
npm run generate
```

Each run creates a fresh spreadsheet with the latest data.

## 📦 Dependencies

- **[xlsx](https://www.npmjs.com/package/xlsx)** - Excel file generation
- **TypeScript** - Type-safe development
- **ts-node** - TypeScript execution for development

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](#license) file for details.

## ⚠️ Disclaimer

This application is for personal use only. It uses ESPN's unofficial API which is not officially supported and may change without notice. Please be respectful of ESPN's API usage policies and avoid making excessive requests.

## 🙏 Acknowledgments

- ESPN for providing the sports data API
- The NFL for the amazing game of football
- The [SheetJS](https://sheetjs.com/) team for the xlsx library

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/rodneyringler/nfl-schedule-generator/issues)
3. Create a new issue if your problem isn't addressed

---

**Enjoy tracking the NFL 2025 season!** 🏈
