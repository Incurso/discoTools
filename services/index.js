'use strict'

const nagiosService = require('./nagiosService')
const primeService = require('./primeService')

module.exports = {
  nagios: nagiosService,
  prime: primeService
}