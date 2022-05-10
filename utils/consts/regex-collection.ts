const EMAIL_REGEX = /\S+@+\S+\.\S+/
const PASSWORD_REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[²&~"#'{}()[\]-\|`_\\^@=+-¨£$¤%ùµ*?,<>.;:§!€*/]).{8,}$/
export { EMAIL_REGEX, PASSWORD_REGEX }
