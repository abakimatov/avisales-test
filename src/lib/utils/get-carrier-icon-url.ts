import { CARRIER_ICONS_URL } from 'constants/api'

export const getCarrierIconUrl = (IATACode: string): string =>
  `${CARRIER_ICONS_URL}${IATACode}.png`
