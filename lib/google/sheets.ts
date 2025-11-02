// Google Sheets Integration for FMC Praise Team

import { google } from 'googleapis';
import { Week, Song } from '@/types';
import { formatForAPI, getCurrentWeekServiceDate, getUpcomingWeeks as getUpcomingWeekDates } from '@/lib/utils';

const sheets = google.sheets('v4');

let auth: any = null;

/**
 * Initialize Google Sheets API with service account
 */
export async function initGoogleSheets() {
  if (auth) return auth;

  const credentials = {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  await auth.authorize();
  return auth;
}

/**
 * Get all weeks from Google Sheets
 */
export async function getAllWeeks(): Promise<Week[]> {
  const authClient = await initGoogleSheets();
  
  const response = await sheets.spreadsheets.values.get({
    auth: authClient,
    spreadsheetId: process.env.GOOGLE_SHEET_ID || process.env.GOOGLE_SHEETS_ID,
    range: 'A2:Z',
  });

  const rows = response.data.values || [];
  return rows.map(rowToWeek).filter(Boolean) as Week[];
}

/**
 * Get week by ID
 */
export async function getWeekById(id: string): Promise<Week | null> {
  const weeks = await getAllWeeks();
  return weeks.find(week => week.id === id) || null;
}

/**
 * Get week by service date
 */
export async function getWeekByDate(date: Date): Promise<Week | null> {
  const weeks = await getAllWeeks();
  return weeks.find(week => 
    new Date(week.date).toDateString() === date.toDateString()
  ) || null;
}

/**
 * Create a new week
 */
export async function createWeek(data: Partial<Week>): Promise<Week> {
  const authClient = await initGoogleSheets();
  
  const newWeek: Week = {
    id: `week-${Date.now()}`,
    date: data.date!,
    month: new Date(data.date!).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    rehearsal_date: data.rehearsal_date,
    attire: data.attire,
    worship_leader: data.worship_leader,
    serving_members: data.serving_members || [],
    songs: data.songs || [],
    created_at: new Date(),
    updated_at: new Date(),
  };

  const row = weekToRow(newWeek);

  await sheets.spreadsheets.values.append({
    auth: authClient,
    spreadsheetId: process.env.GOOGLE_SHEET_ID || process.env.GOOGLE_SHEETS_ID!,
    range: 'A:Z',
    valueInputOption: 'RAW',
    requestBody: {
      values: [row],
    },
  });

  return newWeek;
}

/**
 * Update an existing week
 */
export async function updateWeek(id: string, data: Partial<Week>): Promise<Week | null> {
  const authClient = await initGoogleSheets();
  const weeks = await getAllWeeks();
  const index = weeks.findIndex(w => w.id === id);
  
  if (index === -1) return null;

  const updatedWeek: Week = {
    ...weeks[index],
    ...data,
    updated_at: new Date(),
  };

  const row = weekToRow(updatedWeek);
  const rowNumber = index + 2; // +2 for header and 0-index

  await sheets.spreadsheets.values.update({
    auth: authClient,
    spreadsheetId: process.env.GOOGLE_SHEET_ID || process.env.GOOGLE_SHEETS_ID!,
    range: `A${rowNumber}:Z${rowNumber}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [row],
    },
  });

  return updatedWeek;
}

/**
 * Delete a week
 */
export async function deleteWeek(id: string): Promise<boolean> {
  const authClient = await initGoogleSheets();
  const weeks = await getAllWeeks();
  const index = weeks.findIndex(w => w.id === id);
  
  if (index === -1) return false;

  const rowNumber = index + 2;

  await sheets.spreadsheets.batchUpdate({
    auth: authClient,
    spreadsheetId: process.env.GOOGLE_SHEET_ID || process.env.GOOGLE_SHEETS_ID!,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId: 0,
            dimension: 'ROWS',
            startIndex: rowNumber - 1,
            endIndex: rowNumber,
          },
        },
      }],
    },
  });

  return true;
}

/**
 * Get current week
 */
export async function getCurrentWeek(): Promise<Week | null> {
  const currentDate = getCurrentWeekServiceDate();
  return await getWeekByDate(currentDate);
}

/**
 * Get upcoming weeks
 */
export async function getUpcomingWeeks(count: number = 4): Promise<Week[]> {
  const weeks = await getAllWeeks();
  const now = new Date();
  
  return weeks
    .filter(week => new Date(week.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, count);
}

// Helper functions

function rowToWeek(row: any[]): Week | null {
  if (!row || row.length < 2) return null;

  const songs: Song[] = [];
  
  // Parse songs (starting from column 6)
  for (let i = 6; i < row.length; i += 6) {
    if (row[i]) {
      songs.push({
        id: `song-${i}`,
        title: row[i] || '',
        youtube_url: row[i + 1] || '',
        youtube_id: row[i + 2] || '',
        lead_singer: row[i + 3] || '',
        type: row[i + 4] as any,
        notes: row[i + 5] || '',
        order: Math.floor(i / 6),
      });
    }
  }

  return {
    id: row[0],
    date: new Date(row[1]),
    month: row[2],
    rehearsal_date: row[3] ? new Date(row[3]) : undefined,
    attire: row[4],
    worship_leader: row[5],
    serving_members: row[6] ? row[6].split(',').map((s: string) => s.trim()) : [],
    songs,
    created_at: new Date(row[row.length - 2] || Date.now()),
    updated_at: new Date(row[row.length - 1] || Date.now()),
  };
}

function weekToRow(week: Week): any[] {
  const row = [
    week.id,
    formatForAPI(week.date),
    week.month,
    week.rehearsal_date ? formatForAPI(week.rehearsal_date) : '',
    week.attire || '',
    week.worship_leader || '',
    week.serving_members?.join(', ') || '',
  ];

  // Add songs (max 6 songs with 6 fields each)
  for (let i = 0; i < 6; i++) {
    const song = week.songs[i];
    if (song) {
      row.push(
        song.title,
        song.youtube_url,
        song.youtube_id,
        song.lead_singer,
        song.type,
        song.notes || ''
      );
    } else {
      row.push('', '', '', '', '', '');
    }
  }

  row.push(formatForAPI(week.created_at), formatForAPI(week.updated_at));

  return row;
}
