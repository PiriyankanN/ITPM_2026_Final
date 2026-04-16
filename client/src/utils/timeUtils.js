/**
 * Parses time strings like "6.00 A.M", "11:00 PM", "8 AM" into minutes from midnight.
 * Handles common variations in formatting.
 */
const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  
  // Clean string: 6.00 A.M -> 06:00 AM
  let cleanTime = timeStr.toUpperCase().replace(/\./g, ':').trim();
  
  // Extract hours, minutes, and period (AM/PM)
  const match = cleanTime.match(/(\d+)(?::(\d+))?\s*(AM|PM)?/);
  if (!match) return null;

  let [_, hours, minutes, period] = match;
  hours = parseInt(hours);
  minutes = minutes ? parseInt(minutes) : 0;

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

/**
 * Checks if current time is within a range like "6.00 A.M - 11.00 A.M" or "8:00 - 22:00".
 * Returns { isOpen: boolean, statusText: string }
 */
export const checkServiceStatus = (openingHours, manualOverride) => {
  // If admin manually closed it, respect that first
  if (manualOverride === false) {
    return { isOpen: false, statusText: "Closed (Manual)" };
  }

  if (!openingHours || openingHours.toLowerCase().includes("contact") || openingHours.toLowerCase().includes("varies")) {
    return { isOpen: manualOverride ?? true, statusText: manualOverride ? "Open" : "Contact for Hours" };
  }

  // Split range: "6.00 A.M - 11.00 A.M" -> ["6.00 A.M", "11.00 A.M"]
  const parts = openingHours.split(/[-–—to]/i);
  if (parts.length !== 2) {
    return { isOpen: manualOverride ?? true, statusText: "Open" };
  }

  const startMinutes = parseTimeToMinutes(parts[0]);
  const endMinutes = parseTimeToMinutes(parts[1]);

  if (startMinutes === null || endMinutes === null) {
    return { isOpen: manualOverride ?? true, statusText: "Open" };
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let isOpen = false;
  if (startMinutes <= endMinutes) {
    // Normal range (e.g. 8 AM - 10 PM)
    isOpen = currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  } else {
    // Crosses midnight (e.g. 10 PM - 2 AM)
    isOpen = currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }

  return { 
    isOpen, 
    statusText: isOpen ? "Open Now" : "Closed" 
  };
};
