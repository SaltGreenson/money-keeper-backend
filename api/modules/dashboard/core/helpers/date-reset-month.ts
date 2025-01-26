export const dateResetMonth = (date: Date = new Date()) => {
  const resetted = new Date(date)

  resetted.setDate(1)
  resetted.setHours(0, 0, 0, 0)

  return resetted
}
