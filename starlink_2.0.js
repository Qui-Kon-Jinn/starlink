class Satellite {
  // Ma miec: uuid, wysokość, współrzędne, status żagla słonecznego(on/off), status nadawania sygnału(on/off), status włączenia satelity
  constructor() {
    this.uuid = Utils.uuidv4();
    this.height = 0;
    this.coordinates = {
      latitude: 0,
      longitude: 0
    }
    this.state = {
      solarSail: "off",
      broadcasting: "off",
      turned: "on"
    }
    allSatellites.push(this)
  }
}

class GroupOfSatellites {
  constructor(satellites = []) {
    // Zawiera ewidencję satelit które znajdują się w grupie
    this.satellites = satellites;
  }
  addSatellite(sat) {
    if (!Validator.checkIfInstanceOf(sat, Satellite)) throw new Error("The given object needs to be a Satellite class instance")
    this.satellites.push(sat);
    return this
  }
  deleteSatellite(index) {
    if (!isFinite(index) || !(index >= 0)) throw new Error("The index must be a finite, not negative number")
    this.satellites.splice(index, 1)
  }
  showSatelites() {
    return console.table(this.satellites);
  }
}

class Operator {
  // Ma miec: imie, nazwisko, uuid
  constructor(name, surname) {
    this.name = name
    this.surname = surname
    this.uuid = Utils.uuidv4();
  }
  // Ma umożliwiać:
  // - zmianę wysokości i wpółrzędnych pojedynczych satelit
  // - zmianę wysokości i wpółrzędnychcałej grupy
  // - otwieranie i składanie żagli słonecznych dla pojedynczego egzemplarza jak i całej grupy
  // - właczanie i wyłączanie sygnału nadawczego dla pojedynczych satelit oraz grup
  // - może tworzyć nowe grupy
  setSatelliteHeight(satellite, height) {
    if (!Validator.checkIfInstanceOf(satellite, Satellite)) throw new Error("the input object is not of Satellite class")
    if (!Validator.checkIfNumberInRange(height, 0, 100000)) throw new Error("Minimal and maximal heigth is 0 and 100 000");
    satellite.height = height;
    return this
  }
  setSatelliteLatitude(satellite, latitude) {
    if (!Validator.checkIfInstanceOf(satellite, Satellite)) throw new Error("the input object is not of Satellite class")
    if (!Validator.checkIfNumberInRange(latitude, -180, 180)) throw new Error("Minimal and maximal latitude is -180 and 180");
    satellite.coordinates.latitude = latitude;
    return this
  }
  setSatelliteLongitude(satellite, longitude) {
    if (!Validator.checkIfInstanceOf(satellite, Satellite)) throw new Error("the input object is not of Satellite class")
    if (!Validator.checkIfNumberInRange(longitude, -180, 180)) throw new Error("Minimal and maximal longitude is -180 and 180");
    satellite.coordinates.longitude = longitude;
    return this
  }
  setSatellitePosition(satellite, height, latitude, longitude) {
    this.setSatelliteHeight(satellite, height).setSatelliteLatitude(satellite, latitude).setSatelliteLongitude(satellite, longitude);
  }
  setGroupOfSatellitesPosition(satGroup, height, latitude, longitude) {
    if (!Validator.checkIfInstanceOf(satGroup, GroupOfSatellites)) throw new Error("the input object is not of GroupOfSatellites class")
    satGroup.satellites.forEach((sat) => this.setSatellitePosition(sat, height, latitude, longitude));
  }
  setSatelliteSolarsail(satellite, solarSail) {
    if (!Validator.checkIfInstanceOf(satellite, Satellite)) throw new Error("The input object is not of Satellite class");
    if (!areArgumentsValidValues(solarSail)) throw new Error(`Input only "on" or "off" values for the satellite solarsail state`);

    satellite.state.solarSail = solarSail;
    return this
  }
  setSatelliteBroadcasting(satellite, broadcasting) {
    if (!Validator.checkIfInstanceOf(satellite, Satellite)) throw new Error("The input object is not of Satellite class");
    if (!areArgumentsValidValues(broadcasting)) throw new Error(`Input only "on" or "off" values for the satellite broadcasting state`);

    satellite.state.broadcasting = broadcasting;
    return this
  }
  createGroupOfSatellites(satelliteList = []) {
    if (!Array.isArray(satelliteList)) throw new Error("The input must consist of an array of at least one Satellite class object")
    if (satelliteList.some(sat => satelliteList.indexOf(sat) !== satelliteList.lastIndexOf(sat))) throw new Error('The array must not contain repeated elements')
    const result = new GroupOfSatellites();
    satelliteList.forEach(satellite => result.addSatellite(satellite))
    return result
  }

}

class Overlord extends Operator {
  constructor(name, surname) {
    super(name, surname);
  }
  // Ma mieć: imie, nazwisko, uuid
  // Ma umożliwiać:
  // - to samo co zwykły operator
  // - może wyłączyć poszczególne satelity, wybrane grupy lub cały system (wszystkie dostępne satelity)
  turnOffSatellite(satellite) {
    if (!Validator.checkIfInstanceOf(satellite, Satellite)) throw new Error("The input object is not of Satellite class");
    satellite.state.turned = "off"
  }
  turnOffGroupOfSatellites(satGroup) {
    if (!Validator.checkIfInstanceOf(satGroup, GroupOfSatellites)) throw new Error("the input object is not of GroupOfSatellites class")
    satGroup.satellites.forEach(sat => sat.state.turned = "off")
  }
  turnOffAllSatellites() {
    if (!Array.isArray(allSatellites)) throw new Error("The array containing all satellites is invalid")
    allSatellites.forEach(sat => sat.state.turned = "off")
  }
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
  static checkIfNumberInRange(number, min, max) {
    if (isNaN(number) || isNaN(min) || isNaN(max) || !isFinite(number) || !isFinite(min) || !isFinite(max)) throw new Error("Every input value must be a finite number")
    if (number === null || min === null || max === null) throw new Error("The input must contain the number, min and max range values");
    if (min > max) throw new Error("The min value has to be lower than the max");

    if (number > max || number < min) return false
    else return true
  }
}
class Utils {
  static uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }
}

const areArgumentsValidValues = function () {
  const argumentsArr = [...arguments];
  let argumentsResult = argumentsArr.map(argument => {
    if (argument === "on" || argument === "off") return true;
  })
  const result = argumentsResult.every((argumentResult) => {
    return argumentResult === true;
  })
  return result
}

const allSatellites = []
let satelita1 = new Satellite()
let satelita2 = new Satellite()
satelita2.height = 10
let grupaSatelit = new GroupOfSatellites()
grupaSatelit.addSatellite(satelita1)
grupaSatelit.addSatellite(satelita2)
let operator1 = new Operator("Andrzej", "Nowak")
let operator2 = new Overlord("Janusz", "Kowalski")
// console.table(grupaSatelit.satellites)