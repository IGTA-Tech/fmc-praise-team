'use client';

// Song Card Component - Displays individual song with YouTube player

import { Song } from '@/types';
import { YouTubePlayer } from '@/components/shared';
import { Music, User, Clock, Eye } from 'lucide-react';
import { formatNumber } from '@/lib/utils/validation';
import { SONG_TYPE_COLORS } from '@/lib/utils/constants';
import { cn } from '@/lib/utils';

interface SongCardProps {
  song: Song;
  showPlayer?: boolean;
}

export function SongCard({ song, showPlayer = true }: SongCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* YouTube Player or Thumbnail */}
      {showPlayer && song.youtube_id && (
        <YouTubePlayer videoId={song.youtube_id} title={song.title} />
      )}

      {/* Song Info */}
      <div className="p-4">
        {/* Song Type Badge */}
        <span
          className={cn(
            'inline-block px-2 py-1 rounded-full text-xs font-medium border mb-2',
            SONG_TYPE_COLORS[song.type]
          )}
        >
          {song.type}
        </span>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{song.title}</h3>

        {/* Lead Singer */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
          <User className="w-4 h-4" />
          <span>{song.lead_singer}</span>
        </div>

        {/* Duration and Views */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {song.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{song.duration}</span>
            </div>
          )}
          {song.view_count !== undefined && song.view_count > 0 && (
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{formatNumber(song.view_count)}</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {song.notes && (
          <div className="mt-3 p-2 bg-purple-50 rounded text-sm text-gray-700">
            {song.notes}
          </div>
        )}
      </div>
    </div>
  );
}
