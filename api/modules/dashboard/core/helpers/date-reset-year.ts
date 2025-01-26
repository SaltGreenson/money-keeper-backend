export const dateResetYear = (date: Date = new Date()) => {
  const resetted = new Date(date)

  resetted.setMonth(0, 1)
  resetted.setHours(0, 0, 0, 0)

  return resetted
}
