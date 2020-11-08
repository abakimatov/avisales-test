import { pluralize } from './pluralize'

const stopsForms = ['пересадка', 'пересадки', 'пересадок']

export const getStopsLabel = (stopsAmount: string | number): string => {
  const stopsAmountInt = Number(stopsAmount)

  const labelHead = stopsAmountInt === 0 ? 'Без' : stopsAmount
  const pluralizedLabel = pluralize(stopsAmountInt, stopsForms)

  return `${labelHead} ${pluralizedLabel}`
}
