export const getFormattedPrice = (price: number): string => {
  const formattedPrice = new Intl.NumberFormat('ru-RU', {
    maximumSignificantDigits: 3,
  }).format(price)

  return `${formattedPrice} Р`
}
