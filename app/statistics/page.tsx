'use client';

import { useMemo } from 'react';
import { sampleGames } from '@/components/GameCard/GameCard.stories';
import { GameStatus, Platform, Genre } from '@/types';

export default function StatisticsPage() {
  const games = sampleGames;

  // Calculate statistics
  const stats = useMemo(() => {
    const totalGames = games.length;
    const totalHours = games.reduce((sum, game) => sum + (game.hoursPlayed || 0), 0);
    const averageRating = games.filter(g => g.rating).reduce((sum, game) => sum + (game.rating || 0), 0) / games.filter(g => g.rating).length;

    // Status distribution
    const statusCounts = Object.values(GameStatus).reduce((acc, status) => {
      acc[status] = games.filter(game => game.status === status).length;
      return acc;
    }, {} as Record<GameStatus, number>);

    // Platform distribution
    const platformCounts = Object.values(Platform).reduce((acc, platform) => {
      acc[platform] = games.filter(game => game.platforms.includes(platform)).length;
      return acc;
    }, {} as Record<Platform, number>);

    // Genre distribution
    const genreCounts = Object.values(Genre).reduce((acc, genre) => {
      acc[genre] = games.filter(game => game.genres.includes(genre)).length;
      return acc;
    }, {} as Record<Genre, number>);

    // Recent completions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCompletions = games.filter(game => 
      game.completionDate && new Date(game.completionDate) > thirtyDaysAgo
    ).length;

    // Most played platform
    const mostPlayedPlatform = Object.entries(platformCounts)
      .sort(([,a], [,b]) => b - a)[0];

    // Most popular genre
    const mostPopularGenre = Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      totalGames,
      totalHours,
      averageRating: isNaN(averageRating) ? 0 : averageRating,
      statusCounts,
      platformCounts,
      genreCounts,
      recentCompletions,
      mostPlayedPlatform,
      mostPopularGenre,
      completionRate: totalGames > 0 ? (statusCounts[GameStatus.COMPLETED] / totalGames) * 100 : 0
    };
  }, [games]);

  const formatLabel = (value: string) => {
    return value.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getStatusColor = (status: GameStatus) => {
    switch (status) {
      case GameStatus.COMPLETED:
        return 'bg-green-500';
      case GameStatus.CURRENTLY_PLAYING:
        return 'bg-blue-500';
      case GameStatus.WANT_TO_PLAY:
        return 'bg-yellow-500';
      case GameStatus.ON_HOLD:
        return 'bg-orange-500';
      case GameStatus.DROPPED:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistics</h1>
        <p className="text-gray-600">
          Overview of your gaming collection and progress
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Games */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Games</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalGames}</p>
            </div>
          </div>
        </div>

        {/* Total Hours */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hours Played</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalHours}h</p>
            </div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}/10</p>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completionRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Games by Status</h3>
          <div className="space-y-4">
            {Object.entries(stats.statusCounts).map(([status, count]) => {
              const percentage = stats.totalGames > 0 ? (count / stats.totalGames) * 100 : 0;
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(status as GameStatus)}`}></div>
                    <span className="text-sm font-medium text-gray-700">
                      {formatLabel(status)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getStatusColor(status as GameStatus)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-8 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Games by Platform</h3>
          <div className="space-y-4">
            {Object.entries(stats.platformCounts)
              .filter(([, count]) => count > 0)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 6)
              .map(([platform, count]) => {
                const percentage = stats.totalGames > 0 ? (count / stats.totalGames) * 100 : 0;
                return (
                  <div key={platform} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {formatLabel(platform)}
                    </span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-8 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Games completed this month</span>
              </div>
              <span className="text-lg font-bold text-green-600">{stats.recentCompletions}</span>
            </div>

            {stats.mostPlayedPlatform && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Most played platform</span>
                </div>
                <span className="text-sm font-bold text-blue-600">
                  {formatLabel(stats.mostPlayedPlatform[0])} ({stats.mostPlayedPlatform[1]} games)
                </span>
              </div>
            )}

            {stats.mostPopularGenre && (
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Favorite genre</span>
                </div>
                <span className="text-sm font-bold text-purple-600">
                  {formatLabel(stats.mostPopularGenre[0])} ({stats.mostPopularGenre[1]} games)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{stats.statusCounts[GameStatus.CURRENTLY_PLAYING]}</p>
              <p className="text-sm text-gray-600">Currently Playing</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{stats.statusCounts[GameStatus.WANT_TO_PLAY]}</p>
              <p className="text-sm text-gray-600">Want to Play</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{stats.statusCounts[GameStatus.ON_HOLD]}</p>
              <p className="text-sm text-gray-600">On Hold</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{stats.statusCounts[GameStatus.DROPPED]}</p>
              <p className="text-sm text-gray-600">Dropped</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 