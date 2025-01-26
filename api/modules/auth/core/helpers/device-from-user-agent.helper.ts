const DEVICE_FROM_AGENT_REG = /(?<=;\s)([^)]+)/

export const deviceFromUserAgent = (userAgent: string) => {
  const device = userAgent.match(DEVICE_FROM_AGENT_REG)

  return device?.at(0) || userAgent
}
