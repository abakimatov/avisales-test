const cases = [2, 0, 1, 1, 1, 2] as const

export const pluralize = (count: number, words: string[]): string => {
  const wordIdx =
    count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)]
  return words[wordIdx]
}
