'use strict'
let alarms = []

function getAlarms (req, res) {
  res.json(alarms)
}

module.exports = {
  getAlarms
}
