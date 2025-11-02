'use client';

// Week Card Component - Displays complete week with sticky header and songs

import { Week } from '@/types';
import { SongCard } from './SongCard';
import { Calendar, Music2, Users, Shirt, Mail } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';
import { cn } from '@/lib/utils';

interface WeekCardProps {
  week: Week;
  isCurrent?: boolean;
  className?: string;
}

export function WeekCard({ week, isCurrent = false, className }: WeekCardProps) {
  return (
    <div className={cn('bg-white rounded-xl shadow-lg border-2', className, {
      'border-purple-600': isCurrent,
      'border-gray-200': !isCurrent,
    })}>
      {/* Current Week Badge */}
      {isCurrent && (
        <div className="bg-purple-600 text-white text-center py-2 px-4 font-semibold text-sm">
          THIS WEEK
        </div>
      )}

      {/* Week Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-6 h-6" />
          <h2 className="text-2xl font-bold">{formatDate(week.date, 'EEEE, MMMM d, yyyy')}</h2>
        </div>
        <p className="text-purple-100 text-sm">{week.month}</p>
      </div>

      {/* Weekly Context Card (Sticky Info) */}
      <div className="bg-purple-50 border-b-2 border-purple-100 p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
          <Music2 className="w-5 h-5" />
          Week Information
        </h3>

        <div className="grid gap-3">
          {/* Rehearsal Date */}
          {week.rehearsal_date && (
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Rehearsal</p>
                <p className="text-sm text-gray-900">{formatDate(week.rehearsal_date, 'EEEE, MMMM d')}</p>
              </div>
            </div>
          )}

          {/* Attire */}
          {week.attire && (
            <div className="flex items-start gap-3">
              <Shirt className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Attire</p>
                <p className="text-sm text-gray-900">{week.attire}</p>
              </div>
            </div>
          )}

          {/* Worship Leader */}
          {week.worship_leader && (
            <div className="flex items-start gap-3">
              <Music2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Worship Leader</p>
                <p className="text-sm text-gray-900">{week.worship_leader}</p>
              </div>
            </div>
          )}

          {/* Serving Members */}
          {week.serving_members && week.serving_members.length > 0 && (
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Team Members</p>
                <p className="text-sm text-gray-900">{week.serving_members.join(', ')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
            <Mail className="w-4 h-4" />
            Email Team
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium">
            <Calendar className="w-4 h-4" />
            Add to Calendar
          </button>
        </div>
      </div>

      {/* Songs Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Music2 className="w-6 h-6 text-purple-600" />
          Songs ({week.songs.length})
        </h3>

        {week.songs.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {week.songs
              .sort((a, b) => a.order - b.order)
              .map(song => (
                <SongCard key={song.id} song={song} />
              ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No songs scheduled yet</p>
        )}
      </div>
    </div>
  );
}
