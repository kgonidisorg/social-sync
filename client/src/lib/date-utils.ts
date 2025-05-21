import { format, addMonths, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, isToday } from "date-fns";

// Format a date to display in the UI
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return format(date, "MMM d, yyyy");
}

// Format time to display in the UI
export function formatTime(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return format(date, "h:mm a");
}

// Format date and time together
export function formatDateTime(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

// Get calendar days for a month including leading/trailing days from adjacent months
export function getCalendarDays(month: Date = new Date()): Array<{ date: Date; isCurrentMonth: boolean; isToday: boolean }> {
  const start = startOfWeek(startOfMonth(month));
  const end = endOfWeek(endOfMonth(month));
  
  const days = [];
  let day = start;
  
  while (day <= end) {
    days.push({
      date: day,
      isCurrentMonth: isSameMonth(day, month),
      isToday: isToday(day)
    });
    day = addDays(day, 1);
  }
  
  return days;
}

// Get the current month name and year
export function getCurrentMonthName(date: Date = new Date()): string {
  return format(date, "MMMM yyyy");
}

// Get previous month
export function getPreviousMonth(date: Date): Date {
  return addMonths(date, -1);
}

// Get next month
export function getNextMonth(date: Date): Date {
  return addMonths(date, 1);
}

// Convert 24hr format to 12hr format with AM/PM
export function convertTo12HourFormat(hours: number, minutes: number): string {
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  
  return `${displayHours}:${displayMinutes} ${period}`;
}
