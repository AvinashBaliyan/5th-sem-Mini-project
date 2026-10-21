import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInCalendarDays, parseISO, startOfToday } from 'date-fns';
import type { PerformanceRecord } from "./mock-data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateWorkoutStreak(performanceData: PerformanceRecord[]): number {
  if (performanceData.length === 0) {
    return 0;
  }

  // Get unique, sorted dates in descending order
  const uniqueDates = [
    ...new Set(performanceData.map((record) => record.date)),
  ].map(dateStr => parseISO(dateStr)).sort((a, b) => b.getTime() - a.getTime());
  
  const today = startOfToday();
  const mostRecentDate = uniqueDates[0];

  // If the last activity was not today or yesterday, the streak is 0.
  if (differenceInCalendarDays(today, mostRecentDate) > 1) {
    return 0;
  }
  
  let streak = 0;
  // If the most recent day is today or yesterday, the streak is at least 1.
  if (differenceInCalendarDays(today, mostRecentDate) <= 1) {
      streak = 1;
      let lastDate = mostRecentDate;

      for (let i = 1; i < uniqueDates.length; i++) {
        const currentDate = uniqueDates[i];
        if (differenceInCalendarDays(lastDate, currentDate) === 1) {
          streak++;
          lastDate = currentDate;
        } else {
          // Gap in dates, so the streak is broken.
          break;
        }
      }
  }

  return streak;
}
