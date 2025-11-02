'use client';

import { Week } from '@/types';
import { formatDate } from '@/lib/utils/date';
import { Edit, Trash2, Music } from 'lucide-react';
import Link from 'next/link';

interface WeeksListProps {
  weeks: Week[];
  onDelete?: (id: string) => void;
}

export function WeeksList({ weeks, onDelete }: WeeksListProps) {
  return (
    <div className="space-y-4">
      {weeks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Music className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No weeks scheduled yet</p>
          <Link
            href="/admin/songs/add"
            className="inline-block mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Add First Week
          </Link>
        </div>
      ) : (
        weeks.map((week) => (
          <div key={week.id} className="bg-white rounded-lg shadow border p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {formatDate(week.date, 'EEEE, MMMM d, yyyy')}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  {week.worship_leader && (
                    <div>
                      <span className="font-medium">Leader:</span> {week.worship_leader}
                    </div>
                  )}
                  {week.attire && (
                    <div>
                      <span className="font-medium">Attire:</span> {week.attire}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Songs:</span> {week.songs.length}
                  </div>
                  {week.rehearsal_date && (
                    <div>
                      <span className="font-medium">Rehearsal:</span> {formatDate(week.rehearsal_date, 'MMM d')}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin/songs/edit/${week.id}`}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </Link>
                {onDelete && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this week?')) {
                        onDelete(week.id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
