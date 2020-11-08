import { pluralize } from './pluralize'

const stopsForms = ['пересадка', 'пересадки', 'пересадок']

export const getStopsLabel = (stopsAmount: number): string => {
  const labelHead = stopsAmount === 0 ? 'Без' : stopsAmount
  const pluralizedLabel = pluralize(stopsAmount, stopsForms)

  return `${labelHead} ${pluralizedLabel}`
}
