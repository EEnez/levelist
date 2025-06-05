'use client';

import { useGames } from '@/contexts/GameContext';
import { GameStatus } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getStatusLabel } from '@/utils/gameUtils';
import Link from 'next/link';

export default function DashboardPage() {
  const { games } = useGames();

  // Calculate games by status for pie chart
  const gamesByStatus = Object.values(GameStatus).map(status => {
    const count = games.filter(game => game.status === status).length;
    return {
      name: getStatusLabel(status),
      value: count,
      status: status
    };
  }).filter(item => item.value > 0);

  // Colors for the pie chart
  const COLORS = {
    [GameStatus.WANT_TO_PLAY]: '#3B82F6', // Blue
    [GameStatus.CURRENTLY_PLAYING]: '#10B981', // Green
    [GameStatus.COMPLETED]: '#8B5CF6', // Purple
    [GameStatus.ON_HOLD]: '#F59E0B', // Yellow
    [GameStatus.DROPPED]: '#EF4444', // Red
  };

  // Calculate comprehensive statistics
  const totalGames = games.length;
  const completedGames = games.filter(game => game.status === GameStatus.COMPLETED).length;
  const totalHoursPlayed = games.reduce((total, game) => total + (game.hoursPlayed || 0), 0);
  const averageRating = games.filter(game => game.rating).length > 0 
    ? games.filter(game => game.rating).reduce((sum, game) => sum + (game.rating || 0), 0) / games.filter(game => game.rating).length
    : 0;
  const completionRate = totalGames > 0 ? (completedGames / totalGames) * 100 : 0;

  // Gaming trends - Games completed over time (last 12 months)
  const getMonthsData = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      const completedInMonth = games.filter(game => {
        if (game.status !== GameStatus.COMPLETED || !game.completionDate) return false;
        const completionDate = new Date(game.completionDate);
        return completionDate.getFullYear() === date.getFullYear() && 
               completionDate.getMonth() === date.getMonth();
      }).length;

      months.push({
        month: monthName,
        completed: completedInMonth,
        monthKey
      });
    }
    
    return months;
  };

  const monthlyData = getMonthsData();

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
    .filter(game => game.status === GameStatus.COMPLETED && game.completionDate)
    .sort((a, b) => {
      const dateA = a.completionDate ? new Date(a.completionDate).getTime() : 0;
      const dateB = b.completionDate ? new Date(b.completionDate).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string }; value: number }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">
            {data.payload.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.value} games ({((data.value / games.length) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const LineTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">
            {label}
          </p>
          <p className="text-sm text-purple-600 dark:text-purple-400">
            {payload[0].value} games completed
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Analyze your gaming statistics and trends
        </p>
      </div>

      {games.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Data Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add some games to your library to see analytics and insights.
          </p>
          <Link
            href="/games/add"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Add Your First Game
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <span className="text-2xl">🎮</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Games
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalGames}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Games in library
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-2xl">🕒</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Hours Played
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalHoursPlayed}h
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Time invested
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Average Rating
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {averageRating > 0 ? averageRating.toFixed(1) : '0'}/10
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                Personal score
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Completion Rate
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {completionRate.toFixed(1)}%
              </p>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                Games completed
              </p>
            </div>
          </div>

          {/* Gaming Trends */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Gaming Trends - Completed Games Over Time
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <Tooltip content={<LineTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                    animationBegin={0}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Games by Status Pie Chart */}
            <div className="xl:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Games by Status
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gamesByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={120}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {gamesByStatus.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[entry.status as GameStatus]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value) => (
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Genres */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
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
                            className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-1000"
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
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
                            className="bg-green-600 dark:bg-green-400 h-2 rounded-full transition-all duration-1000"
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
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