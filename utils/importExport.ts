import { Game, GameStatus, Genre, Platform } from '@/types';

// Types for export formats
export enum ExportFormat {
  JSON = 'json',
  CSV = 'csv',
  STEAM = 'steam',
  BACKUP = 'backup'
}

export interface ExportOptions {
  format: ExportFormat;
  includeMetadata?: boolean;
  includePlatforms?: Platform[];
  includeStatuses?: GameStatus[];
  includeNotes?: boolean;
  includeRatings?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ImportResult {
  success: boolean;
  imported: Game[];
  errors: string[];
  duplicates: number;
  total: number;
}

export interface BackupData {
  version: string;
  timestamp: Date;
  gamesCount: number;
  games: Game[];
  metadata: {
    appVersion: string;
    exportedBy: string;
    platform: string;
  };
}

// Export functions
export const exportGames = (games: Game[], options: ExportOptions): string => {
  let filteredGames = [...games];

  // Apply filters
  if (options.includePlatforms?.length) {
    filteredGames = filteredGames.filter(game => 
      game.platforms.some(platform => options.includePlatforms!.includes(platform))
    );
  }

  if (options.includeStatuses?.length) {
    filteredGames = filteredGames.filter(game => 
      options.includeStatuses!.includes(game.status)
    );
  }

  if (options.dateRange) {
    filteredGames = filteredGames.filter(game => {
      const gameDate = game.createdAt;
      return gameDate >= options.dateRange!.start && gameDate <= options.dateRange!.end;
    });
  }

  switch (options.format) {
    case ExportFormat.JSON:
      return exportToJSON(filteredGames, options);
    case ExportFormat.CSV:
      return exportToCSV(filteredGames, options);
    case ExportFormat.STEAM:
      return exportToSteamFormat(filteredGames);
    case ExportFormat.BACKUP:
      return exportToBackup(filteredGames, options);
    default:
      throw new Error(`Unsupported export format: ${options.format}`);
  }
};

const exportToJSON = (games: Game[], options: ExportOptions): string => {
  const data = games.map(game => {
    const exportGame: any = {
      id: game.id,
      title: game.title,
      genres: game.genres,
      platforms: game.platforms,
      status: game.status,
    };

    if (options.includeMetadata) {
      exportGame.description = game.description;
      exportGame.developer = game.developer;
      exportGame.publisher = game.publisher;
      exportGame.releaseDate = game.releaseDate;
      exportGame.createdAt = game.createdAt;
      exportGame.updatedAt = game.updatedAt;
    }

    if (options.includeNotes && game.notes) {
      exportGame.notes = game.notes;
    }

    if (options.includeRatings && game.rating) {
      exportGame.rating = game.rating;
      exportGame.hoursPlayed = game.hoursPlayed;
      exportGame.completionDate = game.completionDate;
      exportGame.startDate = game.startDate;
    }

    return exportGame;
  });

  return JSON.stringify(data, null, 2);
};

const exportToCSV = (games: Game[], options: ExportOptions): string => {
  const headers = ['Title', 'Status', 'Genres', 'Platforms'];
  
  if (options.includeRatings) {
    headers.push('Rating', 'Hours Played');
  }
  
  if (options.includeMetadata) {
    headers.push('Developer', 'Publisher', 'Release Date');
  }
  
  if (options.includeNotes) {
    headers.push('Notes');
  }

  const rows = games.map(game => {
    const row = [
      `"${game.title.replace(/"/g, '""')}"`,
      game.status,
      `"${game.genres.join(', ')}"`,
      `"${game.platforms.join(', ')}"`,
    ];

    if (options.includeRatings) {
      row.push(game.rating?.toString() || '', game.hoursPlayed?.toString() || '');
    }

    if (options.includeMetadata) {
      row.push(
        game.developer || '',
        game.publisher || '',
        game.releaseDate?.toLocaleDateString() || ''
      );
    }

    if (options.includeNotes) {
      row.push(`"${(game.notes || '').replace(/"/g, '""')}"`);
    }

    return row.join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};

const exportToSteamFormat = (games: Game[]): string => {
  // Steam wishlist compatible format
  const steamData = {
    list: games
      .filter(game => game.platforms.includes(Platform.PC))
      .map(game => ({
        appid: game.id,
        title: game.title,
        released: game.releaseDate?.getFullYear() || new Date().getFullYear(),
        developer: game.developer || 'Unknown',
        publisher: game.publisher || 'Unknown',
        playtime_forever: Math.round((game.hoursPlayed || 0) * 60), // Convert to minutes
      })),
  };

  return JSON.stringify(steamData, null, 2);
};

const exportToBackup = (games: Game[], options: ExportOptions): string => {
  const backupData: BackupData = {
    version: '1.0.0',
    timestamp: new Date(),
    gamesCount: games.length,
    games: games,
    metadata: {
      appVersion: '1.0.0',
      exportedBy: 'LevelList',
      platform: typeof window !== 'undefined' ? navigator.platform : 'Unknown',
    },
  };

  return JSON.stringify(backupData, null, 2);
};

// Import functions
export const importGames = async (
  fileContent: string,
  format: ExportFormat,
  existingGames: Game[]
): Promise<ImportResult> => {
  const result: ImportResult = {
    success: false,
    imported: [],
    errors: [],
    duplicates: 0,
    total: 0,
  };

  try {
    let gamesToImport: Game[];

    switch (format) {
      case ExportFormat.JSON:
        gamesToImport = await importFromJSON(fileContent);
        break;
      case ExportFormat.CSV:
        gamesToImport = await importFromCSV(fileContent);
        break;
      case ExportFormat.STEAM:
        gamesToImport = await importFromSteam(fileContent);
        break;
      case ExportFormat.BACKUP:
        gamesToImport = await importFromBackup(fileContent);
        break;
      default:
        throw new Error(`Unsupported import format: ${format}`);
    }

    result.total = gamesToImport.length;

    // Check for duplicates and validate
    const existingTitles = new Set(existingGames.map(g => g.title.toLowerCase()));
    
    for (const game of gamesToImport) {
      try {
        // Validate required fields
        if (!game.title || !game.genres?.length || !game.platforms?.length) {
          result.errors.push(`Invalid game data: ${game.title || 'Unknown title'}`);
          continue;
        }

        // Check for duplicates
        if (existingTitles.has(game.title.toLowerCase())) {
          result.duplicates++;
          continue;
        }

        // Ensure proper Game structure
        const validatedGame: Game = {
          ...game,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        result.imported.push(validatedGame);
      } catch (error) {
        result.errors.push(`Error processing game "${game.title}": ${error}`);
      }
    }

    result.success = result.imported.length > 0;
    
  } catch (error) {
    result.errors.push(`Import failed: ${error}`);
  }

  return result;
};

const importFromJSON = async (content: string): Promise<Game[]> => {
  const data = JSON.parse(content);
  
  // Handle both direct array and wrapped formats
  const games = Array.isArray(data) ? data : data.games || [];
  
  return games.map((item: any) => ({
    ...item,
    releaseDate: item.releaseDate ? new Date(item.releaseDate) : undefined,
    completionDate: item.completionDate ? new Date(item.completionDate) : undefined,
    startDate: item.startDate ? new Date(item.startDate) : undefined,
    createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
    updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
  }));
};

const importFromCSV = async (content: string): Promise<Game[]> => {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  
  const games: Game[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const game: Partial<Game> = {};
    
    headers.forEach((header, index) => {
      const value = values[index]?.replace(/"/g, '').trim();
      if (!value) return;
      
      switch (header.toLowerCase()) {
        case 'title':
          game.title = value;
          break;
        case 'status':
          game.status = value as GameStatus;
          break;
        case 'genres':
          game.genres = value.split(',').map(g => g.trim() as Genre);
          break;
        case 'platforms':
          game.platforms = value.split(',').map(p => p.trim() as Platform);
          break;
        case 'rating':
          game.rating = parseInt(value) || undefined;
          break;
        case 'hours played':
          game.hoursPlayed = parseInt(value) || undefined;
          break;
        case 'developer':
          game.developer = value;
          break;
        case 'publisher':
          game.publisher = value;
          break;
        case 'notes':
          game.notes = value;
          break;
      }
    });
    
    if (game.title && game.genres?.length && game.platforms?.length) {
      games.push(game as Game);
    }
  }
  
  return games;
};

const importFromSteam = async (content: string): Promise<Game[]> => {
  const data = JSON.parse(content);
  const steamGames = data.list || data.games || [];
  
  return steamGames.map((item: any) => ({
    title: item.title || item.name,
    description: item.short_description || '',
    genres: [Genre.ACTION], // Default genre, would need Steam API for real genres
    platforms: [Platform.PC],
    status: GameStatus.WANT_TO_PLAY,
    developer: item.developer,
    publisher: item.publisher,
    releaseDate: item.release_date ? new Date(item.release_date) : undefined,
    hoursPlayed: item.playtime_forever ? Math.round(item.playtime_forever / 60) : undefined,
  }));
};

const importFromBackup = async (content: string): Promise<Game[]> => {
  const backupData: BackupData = JSON.parse(content);
  
  if (!backupData.games || !Array.isArray(backupData.games)) {
    throw new Error('Invalid backup format');
  }
  
  return backupData.games.map(game => ({
    ...game,
    releaseDate: game.releaseDate ? new Date(game.releaseDate) : undefined,
    completionDate: game.completionDate ? new Date(game.completionDate) : undefined,
    startDate: game.startDate ? new Date(game.startDate) : undefined,
    createdAt: game.createdAt ? new Date(game.createdAt) : new Date(),
    updatedAt: game.updatedAt ? new Date(game.updatedAt) : new Date(),
  }));
};

// Utility functions
const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const parseCsvLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
};

// Download helper
export const downloadFile = (content: string, filename: string, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const getExportFilename = (format: ExportFormat, baseName = 'levelist-games'): string => {
  const timestamp = new Date().toISOString().split('T')[0];
  const extension = format === ExportFormat.CSV ? 'csv' : 'json';
  return `${baseName}-${timestamp}.${extension}`;
}; 