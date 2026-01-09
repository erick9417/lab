/**
 * Date formatting utilities for Costa Rica (dd/mm/yyyy format)
 */

/**
 * Format date from ISO (yyyy-mm-dd) to Costa Rican format (dd/mm/yyyy)
 * Avoid timezone shifts by parsing strings manually.
 * @param {string|Date} date - Date in ISO format or Date object
 * @returns {string} Date formatted as dd/mm/yyyy
 */
export const formatDateToDisplay = (date) => {
  if (!date) return ''
  try {
    // If we get a string like yyyy-mm-dd, parse manually to avoid timezone offset
    if (typeof date === 'string') {
      const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/)
      if (match) {
        const [, y, m, d] = match
        return `${d}/${m}/${y}`
      }
    }

    // Fallback for Date objects or other strings
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const day = String(dateObj.getUTCDate()).padStart(2, '0')
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0')
    const year = dateObj.getUTCFullYear()
    return `${day}/${month}/${year}`
  } catch {
    return ''
  }
}

/**
 * Convert Costa Rican format (dd/mm/yyyy) to ISO format (yyyy-mm-dd)
 * @param {string} dateString - Date in dd/mm/yyyy format
 * @returns {string} Date in yyyy-mm-dd format, or empty string if invalid
 */
export const formatDateToISO = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return ''
  
  // Try to parse dd/mm/yyyy format
  const match = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!match) return ''
  
  const day = match[1].padStart(2, '0')
  const month = match[2].padStart(2, '0')
  const year = match[3]
  
  // Validate date using UTC to avoid timezone shifts
  const dateObj = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)))
  if (isNaN(dateObj.getTime())) return ''
  
  return `${year}-${month}-${day}`
}

/**
 * Validate if a string is in dd/mm/yyyy format and is a valid date
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid dd/mm/yyyy format
 */
export const isValidDateFormat = (dateString) => {
  if (!dateString) return true // Allow empty
  const match = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!match) return false
  
  const day = parseInt(match[1])
  const month = parseInt(match[2])
  const year = parseInt(match[3])
  
  if (month < 1 || month > 12) return false
  if (day < 1 || day > 31) return false
  
  // Basic validation using UTC
  const dateObj = new Date(Date.UTC(year, month - 1, day))
  return dateObj.getUTCFullYear() === year && dateObj.getUTCMonth() === month - 1 && dateObj.getUTCDate() === day
}

/**
 * Format date for display in locale-friendly way (full month name)
 * Avoid timezone shifts by constructing UTC dates when input is a string.
 * @param {string|Date} date - Date in ISO format or Date object
 * @returns {string} Formatted date like "15 de enero de 2024"
 */
export const formatDateLong = (date) => {
  if (!date) return '-'
  try {
    let dateObj = date
    if (typeof date === 'string') {
      const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/)
      if (match) {
        const [, y, m, d] = match
        dateObj = new Date(Date.UTC(parseInt(y), parseInt(m) - 1, parseInt(d)))
      } else {
        dateObj = new Date(date)
      }
    }

    return dateObj.toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
  } catch {
    return '-'
  }
}
