// Date utility functions for FMC Praise Team

import { format, parse, addDays, startOfWeek, endOfWeek, isWithinInterval, isSameDay } from 'date-fns';

/**
 * Format a date for display
 */
export function formatDate(date: Date | string, formatStr: string = 'MMMM d, yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Format date for month display (e.g., "January 2025")
 */
export function formatMonth(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMMM yyyy');
}

/**
 * Get the current week's service date (assumes services are on Sunday)
 * Returns the next Sunday or current Sunday if today is Sunday
 */
export function getCurrentWeekServiceDate(): Date {
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  if (dayOfWeek === 0) {
    // Today is Sunday
    return today;
  }
  
  // Calculate days until next Sunday
  const daysUntilSunday = 7 - dayOfWeek;
  return addDays(today, daysUntilSunday);
}

/**
 * Get upcoming weeks (next N Sundays)
 */
export function getUpcomingWeeks(count: number = 4): Date[] {
  const weeks: Date[] = [];
  let currentDate = getCurrentWeekServiceDate();
  
  for (let i = 0; i < count; i++) {
    weeks.push(new Date(currentDate));
    currentDate = addDays(currentDate, 7);
  }
  
  return weeks;
}

/**
 * Check if a date is the current week
 */
export function isCurrentWeek(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const currentSunday = getCurrentWeekServiceDate();
  
  return isSameDay(dateObj, currentSunday);
}

/**
 * Get rehearsal date (typically 3 days before service)
 */
export function getDefaultRehearsalDate(serviceDate: Date | string): Date {
  const dateObj = typeof serviceDate === 'string' ? new Date(serviceDate) : serviceDate;
  return addDays(dateObj, -3);
}

/**
 * Parse date string to Date object
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Format date for API/database (ISO string)
 */
export function formatForAPI(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString();
}

/**
 * Check if a date is within a range
 */
export function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
  return isWithinInterval(date, { start: startDate, end: endDate });
}

/**
 * Get week start and end dates
 */
export function getWeekRange(date: Date): { start: Date; end: Date } {
  return {
    start: startOfWeek(date, { weekStartsOn: 0 }), // Sunday
    end: endOfWeek(date, { weekStartsOn: 0 }),
  };
}

/**
 * Sort dates in ascending order
 */
export function sortDatesAscending(dates: Date[]): Date[] {
  return [...dates].sort((a, b) => a.getTime() - b.getTime());
}

/**
 * Sort dates in descending order
 */
export function sortDatesDescending(dates: Date[]): Date[] {
  return [...dates].sort((a, b) => b.getTime() - a.getTime());
}
