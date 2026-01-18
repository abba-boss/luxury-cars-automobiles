/**
 * Utility functions for date formatting
 */
import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function formatDate(dateString: string | Date | undefined | null): string {
  try {
    // Handle undefined or null values
    if (dateString === undefined || dateString === null) {
      console.warn('Received undefined or null date value');
      return 'Just now';
    }

    // Handle different date formats that might come from the backend
    let date: Date;

    if (typeof dateString === 'string') {
      // Try different common date formats
      date = new Date(dateString);

      // If the date is invalid, try parsing with different approaches
      if (isNaN(date.getTime())) {
        console.warn('Initial date parsing failed for:', dateString);
        // Try parsing as ISO string with date-fns
        date = parseISO(dateString);

        if (isNaN(date.getTime())) {
          console.warn('ISO format parsing failed for:', dateString);
          // Try replacing spaces with 'T' for ISO format
          const isoFormat = dateString.replace(' ', 'T');
          date = new Date(isoFormat);

          if (isNaN(date.getTime())) {
            console.warn('Alternative parsing failed, using current date');
            // If all attempts fail, return relative time from now
            return 'Just now';
          }
        }
      }
    } else {
      date = dateString;
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Final date validation failed');
      return 'Just now';
    }

    // Return relative time if less than 24 hours, otherwise return formatted date
    const diffInHours = Math.abs(new Date().getTime() - date.getTime()) / 36e5;
    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true }); // e.g., "2 hours ago"
    } else {
      return format(date, 'MMM d, yyyy'); // e.g., "Jan 15, 2023"
    }
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'Just now';
  }
}

export function formatDateTime(dateString: string | Date | undefined | null): string {
  try {
    // Handle undefined or null values
    if (dateString === undefined || dateString === null) {
      return 'Just now';
    }

    let date: Date;

    if (typeof dateString === 'string') {
      date = new Date(dateString);

      if (isNaN(date.getTime())) {
        date = parseISO(dateString);

        if (isNaN(date.getTime())) {
          const isoFormat = dateString.replace(' ', 'T');
          date = new Date(isoFormat);

          if (isNaN(date.getTime())) {
            return 'Just now';
          }
        }
      }
    } else {
      date = dateString;
    }

    if (isNaN(date.getTime())) {
      return 'Just now';
    }

    // Return relative time if less than 24 hours, otherwise return formatted datetime
    const diffInHours = Math.abs(new Date().getTime() - date.getTime()) / 36e5;
    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true }); // e.g., "2 hours ago"
    } else {
      return format(date, 'MMM d, yyyy h:mm a'); // e.g., "Jan 15, 2023 2:30 PM"
    }
  } catch (error) {
    console.warn('Error formatting datetime:', error);
    return 'Just now';
  }
}

export function formatTime(dateString: string | Date | undefined | null): string {
  try {
    // Handle undefined or null values
    if (dateString === undefined || dateString === null) {
      return 'Just now';
    }

    let date: Date;

    if (typeof dateString === 'string') {
      date = new Date(dateString);

      if (isNaN(date.getTime())) {
        date = parseISO(dateString);

        if (isNaN(date.getTime())) {
          const isoFormat = dateString.replace(' ', 'T');
          date = new Date(isoFormat);

          if (isNaN(date.getTime())) {
            return 'Just now';
          }
        }
      }
    } else {
      date = dateString;
    }

    if (isNaN(date.getTime())) {
      return 'Just now';
    }

    // Return relative time if less than 24 hours, otherwise return formatted time
    const diffInHours = Math.abs(new Date().getTime() - date.getTime()) / 36e5;
    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true }); // e.g., "2 hours ago"
    } else {
      return format(date, 'h:mm a'); // e.g., "2:30 PM"
    }
  } catch (error) {
    console.warn('Error formatting time:', error);
    return 'Just now';
  }
}