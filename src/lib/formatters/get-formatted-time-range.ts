const getMillisecondsFromMinutes = (minutes: number): number => minutes * 60000

export const getFormattedTimeRange = (
  date: string,
  duration: number,
): string => {
  const startDate = new Date(date)

  const startTime = new Intl.DateTimeFormat('ru', {
    //@ts-ignore
    timeStyle: 'short',
  }).format(startDate)

  const arrivalDate = new Date(
    startDate.getTime() + getMillisecondsFromMinutes(duration),
  )
  const arrivalTime = new Intl.DateTimeFormat('ru', {
    //@ts-ignore
    timeStyle: 'short',
  }).format(arrivalDate)

  return `${startTime} - ${arrivalTime}`
}
