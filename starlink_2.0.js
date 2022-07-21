class Satelite {
  // Ma miec: uuid, wysokość, współrzędne, status żagla słonecznego(on/off), status nadawania sygnału(on/off), status włączenia satelity
  constructor() {
    this.uuid = Utils.uuidv4();
    this.heigth = 0;
    this.coordinates = {
      latitude: 0,
      longitude: 0
    }
    this.state = {
      solarSail: "off",
      broadcasting: "off",
      turned: "off"
    }
  }
}

class GroupOfSatelites {
  constructor() {
    // Zawiera ewidencję satelit które znajdują się w grupie
    this.satellites = [];
  }
  addSatelite(sat) {
    this.satellites.push(sat);
  }
}

class Operator {
  // Ma miec: imie, nazwisko, uuid
  // Ma umożliwiać:
  // - zmianę wysokości i wpółrzędnych pojedynczych satelit
  // - zmianę wysokości i wpółrzędnychcałej grupy
  // - otwieranie i składanie żagli słonecznych dla pojedynczego egzemplarza jak i całej grupy
  // - właczanie i wyłączanie sygnału nadawczego dla pojedynczych satelit oraz grup
  // - może tworzyć nowe grupy
}

class Overlord {
  // Ma mieć: imie, nazwisko, uuid
  // Ma umożliwiać:
  // - to samo co zwykły operator
  // - może wyłączyć poszczególne satelity, wybrane grupy lub cały system (wszystkie dostępne satelity)
}

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