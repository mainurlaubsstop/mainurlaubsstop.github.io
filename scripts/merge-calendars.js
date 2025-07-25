#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Merges two calendar JSON files into one
 * @param {string} primaryPath - Path to primary calendar JSON file (booking.com)
 * @param {string} secondaryPath - Path to secondary calendar JSON file (booking.mainurlaubsstop.de)
 * @param {string} outputPath - Path to output merged JSON file
 */
function mergeCalendars(primaryPath, secondaryPath, outputPath) {
  try {
    // Read both calendar files
    const primaryData = JSON.parse(fs.readFileSync(primaryPath, 'utf8'));
    const secondaryData = JSON.parse(fs.readFileSync(secondaryPath, 'utf8'));
    
    console.log(`Primary calendar: ${primaryData.events.length} events`);
    console.log(`Secondary calendar: ${secondaryData.events.length} events`);
    
    // Combine events from both sources
    const allEvents = [...primaryData.events, ...secondaryData.events];
    
    // Remove duplicate events (same start and end date)
    const uniqueEvents = removeDuplicateEvents(allEvents);
    
    // Sort events by start date
    uniqueEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
    
    // Create merged calendar data
    const mergedData = {
      events: uniqueEvents,
      summary: {
        totalEvents: uniqueEvents.length,
        bookedDays: uniqueEvents.length,
        nextAvailableDate: getNextAvailableDate(uniqueEvents),
        sources: {
          primary: primaryData.events.length,
          secondary: secondaryData.events.length,
          merged: uniqueEvents.length
        }
      }
    };
    
    // Check if content actually changed (excluding timestamp)
    let hasChanged = true;
    if (fs.existsSync(outputPath)) {
      try {
        const existingData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
        delete existingData.lastUpdated; // Remove timestamp for comparison
        
        hasChanged = JSON.stringify(existingData) !== JSON.stringify(mergedData);
      } catch (e) {
        // If we can't read/parse existing file, assume it changed
        hasChanged = true;
      }
    }
    
    // Add timestamp and write final file
    mergedData.lastUpdated = new Date().toISOString();
    fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2));
    
    console.log(`Successfully merged calendars: ${uniqueEvents.length} total events`);
    console.log(`Removed ${allEvents.length - uniqueEvents.length} duplicate events`);
    console.log(`Content ${hasChanged ? 'CHANGED' : 'UNCHANGED'} - ${hasChanged ? 'will trigger build' : 'no build needed'}`);
    console.log(`Output written to: ${outputPath}`);
    
    // Exit with code 1 if no changes (so GitHub Action can detect this)
    if (!hasChanged) {
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Error merging calendars:', error.message);
    process.exit(1);
  }
}

/**
 * Remove duplicate events based on start and end dates
 * @param {Array} events - Array of events
 * @returns {Array} Array of unique events
 */
function removeDuplicateEvents(events) {
  const seen = new Set();
  const uniqueEvents = [];
  
  for (const event of events) {
    // Create a unique key based on start and end date
    const key = `${event.start}_${event.end}`;
    
    if (!seen.has(key)) {
      seen.add(key);
      uniqueEvents.push(event);
    } else {
      console.log(`Duplicate event removed: ${event.start} to ${event.end} (${event.summary})`);
    }
  }
  
  return uniqueEvents;
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
  
  if (args.length !== 3) {
    console.error('Usage: node merge-calendars.js <primary.json> <secondary.json> <output.json>');
    process.exit(1);
  }
  
  const [primaryPath, secondaryPath, outputPath] = args;
  mergeCalendars(primaryPath, secondaryPath, outputPath);
}

module.exports = { mergeCalendars, removeDuplicateEvents };