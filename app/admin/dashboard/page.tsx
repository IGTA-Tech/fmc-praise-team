'use client';

import { useEffect, useState } from 'react';
import { Week } from '@/types';
import { WeeksList } from '@/components/admin';
import { LoadingSpinner, ErrorMessage } from '@/components/shared';
import { Plus, Music2, LogOut, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchWeeks();
  }, []);

  const fetchWeeks = async () => {
    try {
      const response = await fetch('/api/songs');
      const data = await response.json();
      if (data.success) {
        setWeeks(data.data);
      } else {
        setError(data.error || 'Failed to load weeks');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/songs/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setWeeks(weeks.filter((w) => w.id !== id));
        alert('Week deleted successfully');
      }
    } catch (err) {
      alert('Failed to delete week');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/verify', { method: 'POST' });
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music2 className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-purple-100 text-sm">FMC Praise Team Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded-lg transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                View Public Site
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Weeks</h3>
            <p className="text-3xl font-bold text-purple-600">{weeks.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Songs</h3>
            <p className="text-3xl font-bold text-purple-600">
              {weeks.reduce((sum, week) => sum + week.songs.length, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-1">Upcoming</h3>
            <p className="text-3xl font-bold text-purple-600">
              {weeks.filter((w) => new Date(w.date) >= new Date()).length}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Scheduled Weeks</h2>
          <Link
            href="/admin/songs/add"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add New Week
          </Link>
        </div>

        {/* Weeks List */}
        {error ? (
          <ErrorMessage message={error} onRetry={fetchWeeks} />
        ) : (
          <WeeksList weeks={weeks} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
