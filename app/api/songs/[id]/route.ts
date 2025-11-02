// API Route: /api/songs/[id]
// Handles individual week operations

import { NextRequest, NextResponse } from 'next/server';
import { getWeekById, updateWeek, deleteWeek } from '@/lib/google/sheets';
import { weekSchema, Week } from '@/types';

// GET /api/songs/[id] - Get single week
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const week = await getWeekById(id);

    if (!week) {
      return NextResponse.json(
        { success: false, error: 'Week not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: week,
    });
  } catch (error: any) {
    console.error('Error fetching week:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch week' },
      { status: 500 }
    );
  }
}

// PUT /api/songs/[id] - Update week
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate request body
    const validatedData = weekSchema.partial().parse({
      ...body,
      date: body.date ? new Date(body.date) : undefined,
      rehearsal_date: body.rehearsal_date ? new Date(body.rehearsal_date) : undefined,
    });

    const updatedWeek = await updateWeek(id, validatedData as Partial<Week>);

    if (!updatedWeek) {
      return NextResponse.json(
        { success: false, error: 'Week not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedWeek,
      message: 'Week updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating week:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update week' },
      { status: 500 }
    );
  }
}

// DELETE /api/songs/[id] - Delete week
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteWeek(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Week not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Week deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting week:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete week' },
      { status: 500 }
    );
  }
}
