export const getFormattedDuration = (durationMinutes: number): string => {
  const hours = durationMinutes / 60
  const rHours = Math.floor(hours)
  const restMinutes = (hours - rHours) * 60
  const rMinutes = Math.round(restMinutes)
  const hoursStr = `${rHours}ч`
  const minutesStr = rMinutes === 0 ? '' : ` ${rMinutes}м`

  return `${hoursStr}${minutesStr}`
}
