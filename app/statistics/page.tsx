'use client';

import { useGames } from '@/contexts/GameContext';

export default function StatisticsPage() {
  const { games, isLoading, error } = useGames();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-gray-600 dark:text-gray-400">
            Loading statistics...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-red-600 dark:text-red-400">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalGames = games.length;
  const completedGames = games.filter(game => game.status === 'completed').length;
  const playingGames = games.filter(game => game.status === 'currently_playing').length;
  const wantToPlayGames = games.filter(game => game.status === 'want_to_play').length;
  const onHoldGames = games.filter(game => game.status === 'on_hold').length;
  const droppedGames = games.filter(game => game.status === 'dropped').length;

  const totalHoursPlayed = games.reduce((total, game) => total + (game.hoursPlayed || 0), 0);
  const averageRating = games.filter(game => game.rating).length > 0 
    ? games.filter(game => game.rating).reduce((sum, game) => sum + (game.rating || 0), 0) / games.filter(game => game.rating).length
    : 0;

  const completionRate = totalGames > 0 ? (completedGames / totalGames) * 100 : 0;

  // Genre statistics
  const genreStats = games.reduce((acc, game) => {
    game.genres.forEach(genre => {
      acc[genre] = (acc[genre] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topGenres = Object.entries(genreStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Platform statistics
  const platformStats = games.reduce((acc, game) => {
    game.platforms.forEach(platform => {
      acc[platform] = (acc[platform] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topPlatforms = Object.entries(platformStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Recent activity
  const recentlyCompleted = games
    .filter(game => game.status === 'completed' && game.completionDate)
    .sort((a, b) => {
      const dateA = a.completionDate ? new Date(a.completionDate).getTime() : 0;
      const dateB = b.completionDate ? new Date(b.completionDate).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Statistics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of your collection and gaming habits
        </p>
      </div>

      {totalGames === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No statistics available
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add games to your collection to see your statistics!
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Add Game
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Total Games
              </h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {totalGames}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Hours Played
              </h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {totalHoursPlayed}h
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Average Rating
              </h3>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {averageRating.toFixed(1)}/10
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Completion Rate
              </h3>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {completionRate.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Games by Status
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {completedGames}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {playingGames}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Playing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                  {wantToPlayGames}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Want to Play</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  {onHoldGames}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">On Hold</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                  {droppedGames}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Dropped</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Genres */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Top Genres
              </h2>
              {topGenres.length > 0 ? (
                <div className="space-y-4">
                  {topGenres.map(([genre, count], index) => (
                    <div key={genre} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                          {index + 1}.
                        </span>
                        <span className="text-gray-900 dark:text-white ml-2">
                          {genre}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                          <div
                            className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
                            style={{ width: `${(count / totalGames) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No genres available</p>
              )}
            </div>

            {/* Top Platforms */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Top Platforms
              </h2>
              {topPlatforms.length > 0 ? (
                <div className="space-y-4">
                  {topPlatforms.map(([platform, count], index) => (
                    <div key={platform} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                          {index + 1}.
                        </span>
                        <span className="text-gray-900 dark:text-white ml-2">
                          {platform}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                          <div
                            className="bg-green-600 dark:bg-green-400 h-2 rounded-full"
                            style={{ width: `${(count / totalGames) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No platforms available</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          {recentlyCompleted.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Recently Completed
              </h2>
              <div className="space-y-4">
                {recentlyCompleted.map((game) => (
                  <div key={game.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {game.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {game.completionDate && new Date(game.completionDate).toLocaleDateString('en-US')}
                      </p>
                    </div>
                    {game.rating && (
                      <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                        ⭐ {game.rating}/10
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 