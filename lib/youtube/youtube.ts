// YouTube API Integration for FMC Praise Team

import { YouTubeVideoData } from '@/types';
import { extractYouTubeId as extractId, formatYouTubeDuration } from '@/lib/utils/validation';

export { extractId as extractVideoId };

// Cache for YouTube metadata
const metadataCache = new Map<string, { data: YouTubeVideoData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Validate YouTube URL
 */
export function validateYouTubeUrl(url: string): boolean {
  return extractId(url) !== null;
}

/**
 * Get video metadata from YouTube Data API
 */
export async function getVideoMetadata(url: string): Promise<YouTubeVideoData | null> {
  const videoId = extractId(url);
  
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  // Check cache
  const cached = metadataCache.get(videoId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    console.warn('YouTube API key not configured');
    return getBasicMetadata(videoId);
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails,statistics&key=${apiKey}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found');
    }

    const video = data.items[0];
    const metadata: YouTubeVideoData = {
      id: videoId,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.high.url,
      thumbnails: {
        default: video.snippet.thumbnails.default.url,
        medium: video.snippet.thumbnails.medium.url,
        high: video.snippet.thumbnails.high.url,
        standard: video.snippet.thumbnails.standard?.url,
        maxres: video.snippet.thumbnails.maxres?.url,
      },
      duration: video.contentDetails.duration,
      duration_formatted: formatYouTubeDuration(video.contentDetails.duration),
      view_count: parseInt(video.statistics.viewCount, 10),
      channel_title: video.snippet.channelTitle,
      published_at: video.snippet.publishedAt,
    };

    // Cache the result
    metadataCache.set(videoId, { data: metadata, timestamp: Date.now() });

    return metadata;
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    // Fallback to basic metadata
    return getBasicMetadata(videoId);
  }
}

/**
 * Get basic metadata without API (fallback)
 */
function getBasicMetadata(videoId: string): YouTubeVideoData {
  return {
    id: videoId,
    title: 'YouTube Video',
    thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    thumbnails: {
      default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
      medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      standard: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    },
    duration: 'PT0S',
    duration_formatted: '0:00',
    view_count: 0,
    channel_title: 'Unknown',
    published_at: new Date().toISOString(),
  };
}

/**
 * Get YouTube embed URL
 */
export function getEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Clear metadata cache
 */
export function clearCache(): void {
  metadataCache.clear();
}
