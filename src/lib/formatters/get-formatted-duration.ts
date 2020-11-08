export const getFormattedDuration = (duration: number): string => {
  const hours = duration / 60
  const rHours = Math.floor(hours)
  const minutes = (hours - rHours) * 60
  const rMinutes = Math.round(minutes)
  const hoursStr = `${rHours}ч`
  const minutesStr = rMinutes === 0 ? '' : ` ${rMinutes}м`

  return `${hoursStr}${minutesStr}`
}
