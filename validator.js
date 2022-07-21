class Validator {
  static checkIfString(value) {
    return typeof value === "string" && value.length > 0
  }
  static checkIfInstanceOf(comparedObject, referenceObject) {
    return comparedObject instanceof referenceObject
  }
  static checkIfEmptyArray(array) {
    return !array.length
  }
  static ValidateEmail(email) {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return email.match(validRegex)
  }
}
class Utils {
  static uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }
}