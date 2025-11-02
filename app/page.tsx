'use client';

import { useEffect, useState } from 'react';
import { Week } from '@/types';
import { WeekCard } from '@/components/public';
import { SearchBar } from '@/components/public';
import { LoadingSpinner, ErrorMessage } from '@/components/shared';
import { Music2 } from 'lucide-react';

export default function HomePage() {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [filteredWeeks, setFilteredWeeks] = useState<Week[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeeks();
  }, []);

  const fetchWeeks = async () => {
    try {
      const response = await fetch('/api/songs');
      const data = await response.json();
      if (data.success) {
        setWeeks(data.data);
        setFilteredWeeks(data.data);
      } else {
        setError(data.error || 'Failed to load schedule');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredWeeks(weeks);
      return;
    }

    const filtered = weeks.filter((week) =>
      week.songs.some(
        (song) =>
          song.title.toLowerCase().includes(query.toLowerCase()) ||
          song.lead_singer.toLowerCase().includes(query.toLowerCase())
      ) ||
      week.worship_leader?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredWeeks(filtered);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music2 className="w-12 h-12" />
            <h1 className="text-4xl font-bold">FMC Praise Team</h1>
          </div>
          <p className="text-center text-purple-100 text-lg">
            Worship Schedule & Song List
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-4 -mt-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {error ? (
          <ErrorMessage message={error} onRetry={fetchWeeks} />
        ) : filteredWeeks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <Music2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No upcoming services scheduled</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredWeeks.map((week, index) => (
              <WeekCard
                key={week.id}
                week={week}
                isCurrent={index === 0}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            FMC Praise Team &copy; 2025 - All songs for worship and praise
          </p>
        </div>
      </footer>
    </div>
  );
}
