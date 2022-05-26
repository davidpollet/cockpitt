function isValidNumber(value: string) {
  return value.match(/^(\d+)((\.|,)\d+)?$/)
}

export default isValidNumber
