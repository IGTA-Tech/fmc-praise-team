// API Route: /api/songs
// Handles CRUD operations for weeks and songs

import { NextRequest, NextResponse } from 'next/server';
import { getAllWeeks, createWeek } from '@/lib/google/sheets';
import { weekSchema } from '@/types';
import { ValidationError } from '@/types';

// GET /api/songs - Get all weeks with optional filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get('month');
    const worship_leader = searchParams.get('worship_leader');
    const search = searchParams.get('search');

    let weeks = await getAllWeeks();

    // Apply filters
    if (month) {
      weeks = weeks.filter(week => week.month === month);
    }

    if (worship_leader) {
      weeks = weeks.filter(week => week.worship_leader === worship_leader);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      weeks = weeks.filter(week => 
        week.songs.some(song => 
          song.title.toLowerCase().includes(searchLower) ||
          song.lead_singer.toLowerCase().includes(searchLower)
        ) ||
        week.worship_leader?.toLowerCase().includes(searchLower)
      );
    }

    // Sort by date descending
    weeks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      success: true,
      data: weeks,
    });
  } catch (error: any) {
    console.error('Error fetching weeks:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch weeks' },
      { status: 500 }
    );
  }
}

// POST /api/songs - Create a new week
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = weekSchema.parse({
      ...body,
      date: new Date(body.date),
      rehearsal_date: body.rehearsal_date ? new Date(body.rehearsal_date) : undefined,
    });

    const newWeek = await createWeek(validatedData as any);

    return NextResponse.json({
      success: true,
      data: newWeek,
      message: 'Week created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating week:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create week' },
      { status: 500 }
    );
  }
}
