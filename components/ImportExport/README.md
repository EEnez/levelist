# 📁 Import/Export System

An advanced import/export system for LevelList game collection, supporting multiple formats and customization options.

## 🚀 Features

### Export Formats
- **JSON** - Standard format with complete data
- **CSV** - Compatible with Excel/Google Sheets for data analysis  
- **Steam** - Compatible format with Steam libraries
- **Backup** - Complete backup with metadata

### Export Options
- ✅ Metadata (developer, publisher, release dates)
- ✅ Personal notes
- ✅ Ratings and playtime
- ✅ Platform and status filtering
- ✅ Custom date range

### Import
- 🔥 Automatic duplicate detection
- 🔍 Imported data validation
- 📊 Detailed import report (successes, errors, duplicates)
- 🎯 Drag & drop support
- 📋 Sample files for testing

## 🛠️ Usage

### Main Component
```tsx
import ImportExportModal from '@/components/ImportExport/ImportExportModal';

<ImportExportModal 
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  defaultMode="export" // or "import"
/>
```

### Reusable Button
```tsx
import ImportExportButton from '@/components/ImportExport/ImportExportButton';

<ImportExportButton 
  variant="default" // "default" | "icon-only" | "compact"
  defaultMode="export"
  className="custom-classes"
/>
```

## 📝 File Formats

### JSON Standard
```json
[
  {
    "id": "game-1",
    "title": "The Witcher 3",
    "genres": ["rpg", "action"],
    "platforms": ["pc", "playstation_5"],
    "status": "completed",
    "rating": 9,
    "hoursPlayed": 120
  }
]
```

### CSV Format
```csv
Title,Status,Genres,Platforms,Rating,Hours Played,Developer,Publisher,Notes
"The Witcher 3",completed,"rpg, action","pc, playstation_5",9,120,"CD Projekt Red","CD Projekt","Amazing game!"
```

### Steam Format
```json
{
  "list": [
    {
      "appid": "game-1",
      "title": "The Witcher 3",
      "released": 2015,
      "developer": "CD Projekt Red",
      "publisher": "CD Projekt",
      "playtime_forever": 7200
    }
  ]
}
```

### Backup Format
```json
{
  "version": "1.0.0",
  "timestamp": "2024-01-20T12:00:00.000Z",
  "gamesCount": 150,
  "games": [...],
  "metadata": {
    "appVersion": "1.0.0",
    "exportedBy": "LevelList",
    "platform": "Web"
  }
}
```

## 🔧 Utilities

### Export Functions
```tsx
import { exportGames, ExportFormat, ExportOptions } from '@/utils/importExport';

const options: ExportOptions = {
  format: ExportFormat.JSON,
  includeMetadata: true,
  includeNotes: true,
  includeRatings: true
};

const data = exportGames(games, options);
```

### Import Functions
```tsx
import { importGames, ImportResult } from '@/utils/importExport';

const result: ImportResult = await importGames(
  fileContent, 
  ExportFormat.JSON, 
  existingGames
);

console.log(`Imported: ${result.imported.length}`);
console.log(`Duplicates: ${result.duplicates}`);
console.log(`Errors: ${result.errors.length}`);
```

## 🧪 Testing

### Sample Files
Use the sample file generation utilities:

```tsx
import { downloadSampleFile } from '@/utils/sampleExportData';

// Download JSON sample file
downloadSampleFile('json');

// Download CSV sample file  
downloadSampleFile('csv');

// Download Steam sample file
downloadSampleFile('steam');

// Download backup sample file
downloadSampleFile('backup');
```

## 🎯 GameContext Integration

The system integrates seamlessly with the global context:

```tsx
const { addBulkGames } = useGames();

// Import multiple games
const result = await importGames(content, format, existingGames);
if (result.success) {
  await addBulkGames(result.imported);
}
```

## 🚀 Future Enhancements

- [ ] Epic Games Store support
- [ ] External API integration
- [ ] Cloud synchronization
- [ ] Automatic backup scheduling
- [ ] Custom export format

## 📦 Architecture

```
components/ImportExport/
├── ImportExportModal.tsx     # Main modal component
├── ImportExportButton.tsx    # Reusable button
└── README.md                # Documentation

utils/
├── importExport.ts          # Import/export logic
└── sampleExportData.ts      # Sample data

contexts/
└── GameContext.tsx          # addBulkGames integration
```

## 🎨 Animations

Uses Framer Motion for:
- Smooth modal transitions
- Drag & drop animations
- Visual loading state feedback
- Progressive result display 