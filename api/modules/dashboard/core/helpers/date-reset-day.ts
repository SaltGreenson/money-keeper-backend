export const dateResetDay = (date: Date = new Date()) => {
  const resetted = new Date(date)

  resetted.setHours(0, 0, 0, 0)

  return resetted
}
