const getMillisecondsFromMinutes = (minutes: number): number => minutes * 60000

interface DateTimeFormatOptions {
  localeMatcher?: 'lookup' | 'best fit'
  weekday?: 'long' | 'short' | 'narrow'
  era?: 'long' | 'short' | 'narrow'
  year?: 'numeric' | '2-digit'
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow'
  day?: 'numeric' | '2-digit'
  hour?: 'numeric' | '2-digit'
  minute?: 'numeric' | '2-digit'
  second?: 'numeric' | '2-digit'
  timeZoneName?: 'long' | 'short'
  formatMatcher?: 'basic' | 'best fit'
  hour12?: boolean
  timeZone?: string // this is more complicated than the others, not sure what I expect here
  timeStyle?: 'full' | 'long' | 'medium' | 'short'
}

const setOptions = (options: DateTimeFormatOptions) => options

export const getFormattedTimeRange = (
  date: string,
  duration: number,
): string => {
  const startDate = new Date(date)

  const options = setOptions({ timeStyle: 'short' })

  const startTime = new Intl.DateTimeFormat('ru', options).format(startDate)

  const arrivalDate = new Date(
    startDate.getTime() + getMillisecondsFromMinutes(duration),
  )
  const arrivalTime = new Intl.DateTimeFormat('ru', options).format(arrivalDate)

  return `${startTime} - ${arrivalTime}`
}
