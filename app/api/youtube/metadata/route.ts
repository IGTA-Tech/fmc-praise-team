// API Route: /api/youtube/metadata
// Fetches YouTube video metadata

import { NextRequest, NextResponse } from 'next/server';
import { getVideoMetadata, validateYouTubeUrl } from '@/lib/youtube/youtube';

// POST /api/youtube/metadata - Get video metadata
export async function POST(request: NextRequest) {
  try {
    const { youtube_url } = await request.json();

    if (!youtube_url) {
      return NextResponse.json(
        { success: false, error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    if (!validateYouTubeUrl(youtube_url)) {
      return NextResponse.json(
        { success: false, error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    const metadata = await getVideoMetadata(youtube_url);

    if (!metadata) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch video metadata' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: metadata,
    });
  } catch (error: any) {
    console.error('Error fetching YouTube metadata:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch metadata' },
      { status: 500 }
    );
  }
}
