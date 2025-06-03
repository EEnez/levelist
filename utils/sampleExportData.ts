import { Game, GameStatus, Genre, Platform } from '@/types';

// Sample data for testing import functionality
export const sampleGamesJSON = [
  {
    id: 'sample-1',
    title: 'Ghost of Tsushima',
    description: 'An open-world action-adventure game set in feudal Japan during the Mongol invasion.',
    genres: [Genre.ACTION, Genre.ADVENTURE],
    platforms: [Platform.PLAYSTATION_4, Platform.PLAYSTATION_5, Platform.PC],
    status: GameStatus.COMPLETED,
    rating: 9,
    hoursPlayed: 60,
    notes: 'Stunning visuals and excellent combat system. The photo mode is incredible.',
    developer: 'Sucker Punch Productions',
    publisher: 'Sony Interactive Entertainment',
    releaseDate: '2020-07-17',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 'sample-2',
    title: 'Celeste',
    description: 'A challenging 2D platformer about climbing a mountain and overcoming anxiety.',
    genres: [Genre.INDIE, Genre.PLATFORMER],
    platforms: [Platform.PC, Platform.NINTENDO_SWITCH],
    status: GameStatus.WANT_TO_PLAY,
    notes: 'Heard great things about the story and gameplay. Perfect difficulty curve.',
    developer: 'Maddy Makes Games',
    publisher: 'Maddy Makes Games',
    releaseDate: '2018-01-25',
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z'
  },
  {
    id: 'sample-3',
    title: 'Disco Elysium',
    description: 'A groundbreaking role-playing game with no combat, featuring deep dialogue and choices.',
    genres: [Genre.RPG, Genre.INDIE],
    platforms: [Platform.PC, Platform.PLAYSTATION_4, Platform.XBOX_ONE],
    status: GameStatus.CURRENTLY_PLAYING,
    rating: 10,
    hoursPlayed: 25,
    notes: 'Incredible writing and voice acting. The political themes are fascinating.',
    developer: 'ZA/UM',
    publisher: 'ZA/UM',
    releaseDate: '2019-10-15',
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z'
  }
];

export const sampleGamesCSV = `Title,Status,Genres,Platforms,Rating,Hours Played,Developer,Publisher,Notes
"Ghost of Tsushima",completed,"action, adventure","playstation_4, playstation_5, pc",9,60,"Sucker Punch Productions","Sony Interactive Entertainment","Stunning visuals and excellent combat system. The photo mode is incredible."
"Celeste",want_to_play,"indie, platformer","pc, nintendo_switch",,,"Maddy Makes Games","Maddy Makes Games","Heard great things about the story and gameplay. Perfect difficulty curve."
"Disco Elysium",currently_playing,"rpg, indie","pc, playstation_4, xbox_one",10,25,"ZA/UM","ZA/UM","Incredible writing and voice acting. The political themes are fascinating."`;

export const sampleSteamFormat = {
  list: [
    {
      appid: 'sample-1',
      title: 'Ghost of Tsushima',
      released: 2020,
      developer: 'Sucker Punch Productions',
      publisher: 'Sony Interactive Entertainment',
      playtime_forever: 3600 // 60 hours in minutes
    },
    {
      appid: 'sample-3',
      title: 'Disco Elysium',
      released: 2019,
      developer: 'ZA/UM',
      publisher: 'ZA/UM',
      playtime_forever: 1500 // 25 hours in minutes
    }
  ]
};

export const sampleBackupFormat = {
  version: '1.0.0',
  timestamp: '2024-01-20T12:00:00.000Z',
  gamesCount: 3,
  games: sampleGamesJSON,
  metadata: {
    appVersion: '1.0.0',
    exportedBy: 'LevelList',
    platform: 'Web'
  }
};

// Helper functions to generate test files
export const generateSampleFile = (format: 'json' | 'csv' | 'steam' | 'backup'): string => {
  switch (format) {
    case 'json':
      return JSON.stringify(sampleGamesJSON, null, 2);
    case 'csv':
      return sampleGamesCSV;
    case 'steam':
      return JSON.stringify(sampleSteamFormat, null, 2);
    case 'backup':
      return JSON.stringify(sampleBackupFormat, null, 2);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
};

export const downloadSampleFile = (format: 'json' | 'csv' | 'steam' | 'backup') => {
  const content = generateSampleFile(format);
  const filename = `sample-import-${format}-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'json'}`;
  const mimeType = format === 'csv' ? 'text/csv' : 'application/json';
  
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