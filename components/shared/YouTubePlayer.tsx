'use client';

// YouTube Player Component

import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  autoplay?: boolean;
  className?: string;
}

export function YouTubePlayer({ 
  videoId, 
  title = 'YouTube Video',
  autoplay = false,
  className 
}: YouTubePlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0`;
  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className={cn('relative aspect-video bg-gray-900 rounded-lg overflow-hidden', className)}>
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center cursor-pointer group"
          style={{ backgroundImage: `url(${thumbnail})` }}
          onClick={() => setIsLoaded(true)}
        >
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-10 h-10 text-white ml-1" fill="white" />
            </div>
          </div>
        </div>
      )}
      
      {isLoaded && (
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )}
    </div>
  );
}
