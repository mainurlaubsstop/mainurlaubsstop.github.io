#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Converts iCal data to JSON format for Hugo consumption
 * @param {string} icalPath - Path to iCal file
 * @param {string} outputPath - Path to output JSON file
 */
function convertICalToJSON(icalPath, outputPath) {
  try {
    // Read iCal file
    const icalData = fs.readFileSync(icalPath, 'utf8');
    
    // Parse iCal events
    const events = parseICalEvents(icalData);
    
    // Sort events by start date
    events.sort((a, b) => new Date(a.start) - new Date(b.start));
    
    // Create output object (without timestamp to allow proper change detection)
    const calendarData = {
      events: events,
      summary: {
        totalEvents: events.length,
        bookedDays: events.length,
        nextAvailableDate: getNextAvailableDate(events)
      }
    };
    
    // Only add timestamp after we check for changes
    const tempFile = outputPath + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(calendarData, null, 2));
    
    // Check if content actually changed (excluding timestamp)
    let hasChanged = true;
    if (fs.existsSync(outputPath)) {
      try {
        const existingData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
        delete existingData.lastUpdated; // Remove timestamp for comparison
        
        hasChanged = JSON.stringify(existingData) !== JSON.stringify(calendarData);
      } catch (e) {
        // If we can't read/parse existing file, assume it changed
        hasChanged = true;
      }
    }
    
    // Add timestamp and write final file
    calendarData.lastUpdated = new Date().toISOString();
    fs.writeFileSync(outputPath, JSON.stringify(calendarData, null, 2));
    fs.unlinkSync(tempFile);
    
    console.log(`Successfully converted iCal to JSON: ${events.length} events found`);
    console.log(`Content ${hasChanged ? 'CHANGED' : 'UNCHANGED'} - ${hasChanged ? 'will trigger build' : 'no build needed'}`);
    console.log(`Output written to: ${outputPath}`);
    
    // Exit with code 1 if no changes (so GitHub Action can detect this)
    if (!hasChanged) {
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Error converting iCal to JSON:', error.message);
    process.exit(1);
  }
}

/**
 * Parse iCal events from string data
 * @param {string} icalData - Raw iCal data
 * @returns {Array} Array of event objects
 */
function parseICalEvents(icalData) {
  const events = [];
  const lines = icalData.split('\n').map(line => line.trim());
  
  let currentEvent = null;
  let isInEvent = false;
  
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      isInEvent = true;
      currentEvent = {};
    } else if (line === 'END:VEVENT' && isInEvent) {
      if (currentEvent && currentEvent.start && currentEvent.end) {
        // Normalize event data
        const event = {
          start: normalizeDate(currentEvent.start),
          end: normalizeDate(currentEvent.end),
          summary: currentEvent.summary || 'Gebucht',
          status: 'booked',
          isBookingCom: true
        };
        
        // Calculate duration in days
        const startDate = new Date(event.start);
        const endDate = new Date(event.end);
        event.duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        events.push(event);
      }
      
      isInEvent = false;
      currentEvent = null;
    } else if (isInEvent && line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':');
      
      switch (key.split(';')[0]) { // Handle parameters like DTSTART;VALUE=DATE
        case 'DTSTART':
          currentEvent.start = value;
          break;
        case 'DTEND':
          currentEvent.end = value;
          break;
        case 'SUMMARY':
          currentEvent.summary = value;
          break;
        case 'DESCRIPTION':
          currentEvent.description = value;
          break;
      }
    }
  }
  
  return events;
}

/**
 * Normalize date format to ISO string
 * @param {string} dateStr - Date string from iCal
 * @returns {string} ISO date string
 */
function normalizeDate(dateStr) {
  // Handle different iCal date formats
  if (dateStr.includes('T')) {
    // DateTime format: 20241225T140000Z
    const cleanDate = dateStr.replace(/[TZ]/g, ' ').trim();
    const year = cleanDate.substr(0, 4);
    const month = cleanDate.substr(4, 2);
    const day = cleanDate.substr(6, 2);
    return `${year}-${month}-${day}`;
  } else {
    // Date only format: 20241225
    const year = dateStr.substr(0, 4);
    const month = dateStr.substr(4, 2);
    const day = dateStr.substr(6, 2);
    return `${year}-${month}-${day}`;
  }
}

/**
 * Find next available date (first day not booked)
 * @param {Array} events - Array of booking events
 * @returns {string} Next available date or null
 */
function getNextAvailableDate(events) {
  if (events.length === 0) {
    return new Date().toISOString().split('T')[0];
  }
  
  // Create set of booked dates
  const bookedDates = new Set();
  events.forEach(event => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    
    // Add all dates in the range
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      bookedDates.add(d.toISOString().split('T')[0]);
    }
  });
  
  // Find first available date starting from today
  const today = new Date();
  for (let i = 0; i < 365; i++) { // Check next 365 days
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() + i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    if (!bookedDates.has(dateStr)) {
      return dateStr;
    }
  }
  
  return null; // No available date found in next year
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.error('Usage: node convert-ical-to-json.js <input.ics> <output.json>');
    process.exit(1);
  }
  
  const [inputPath, outputPath] = args;
  convertICalToJSON(inputPath, outputPath);
}

module.exports = { convertICalToJSON, parseICalEvents, normalizeDate };