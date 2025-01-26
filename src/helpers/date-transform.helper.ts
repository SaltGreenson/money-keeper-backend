export const dateTransform = (
  date?: Date,
  additionalTransform: (date: Date) => Date = (date: Date) => date
) => {
  if (!date) {
    return undefined
  }

  return additionalTransform(new Date(date))
}
