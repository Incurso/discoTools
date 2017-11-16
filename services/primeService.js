'use strict'

const { URL } = require('url')
const { encryption, remoteAPI } = require('../utils')

let alarms = {}

function resetAlarms () {
  alarms = {
    critical: {
      alarmCount: 0,
      alarms: []
    },
    major: {
      alarmCount: 0,
      alarms: []
    },
    minor: {
      alarmCount: 0,
      alarms: []
    },
    unknown: {
      alarmCount: 0,
      alarms: []
    }
  }
}

function fetchData () {
  const url = new URL(process.env.URL_PRIME)

  const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname + url.search,
    method: 'GET',
    auth: process.env.AD_USER + ':' + encryption.decrypt(process.env.AD_PASS),
    headers: {
      accept: 'application/json'
    }
  }

  remoteAPI.getJSON(url, options)
  .then((data) => {
    resetAlarms()
    
    for (let i in data.queryResponse.entity) {
      let alarm = parseAlarm(data.queryResponse.entity[i].alarmsDTO)
      let severity = alarm.severity.description.toLowerCase()

      alarms[severity].alarms.push(alarm)
      alarms[severity].alarmCount++
    }

    setTimeout(() => { fetchData() }, 1000)
  })
  .catch((error) => {
    console.log({
      source: 'prime',
      error: error.message
    })
    setTimeout(() => { fetchData() }, 10000)
  })

}

function parseAlarm (alarm) {
  // Regular expressions to extract MAC and IP address
  let macRegex = /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/
  let ipRegex = /(\b\d{1,3}\.){3}\d{1,3}\b/

  // Apply regex
  let macAddress = macRegex.exec(alarm.source)
  let ipAddress = ipRegex.exec(alarm.source)
  let deviceName = alarm.deviceName

  // No ip address in source
  ipAddress = ipAddress === null ? ipRegex.exec(deviceName) : ipAddress

  // No mac address in source
  macAddress = macAddress === null ? /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.exec(deviceName) : macAddress

  // Cleanup deviceName
  deviceName = macAddress !== null ? alarm.deviceName.replace(macAddress[0], '') : alarm.deviceName
  deviceName = ipAddress !== null ? deviceName.replace(ipAddress[0], '') : deviceName
  deviceName = deviceName.replace(/^:/, '').replace(/[,:]$/, '').split(':')[0]

  let alarmState = {
    description: alarm.severity
  }

  /**
   * Warning IDs
   * 0 = Normal
   * 1 = Minor
   * 2 = Major/Warning
   * 3 = Unknown
   * 4 = Critical
   */
  switch (alarm.severity) {
    case 'NORMAL':
      alarmState.id = 0
      break
    case 'MINOR':
      alarmState.id = 1
      break
    case 'MAJOR':
      alarmState.id = 2
      break
    case 'CRITICAL':
      alarmState.id = 4
      break
    default:
      alarmState.id = 3
      alarmState.description = 'UNKNOWN'
      break
  }

  alarm = {
    alarmSource: 'prime',
    deviceName: deviceName,
    deviceMAC: macAddress !== null ? macAddress[0] : macAddress,
    deviceIP: ipAddress !== null ? ipAddress[0] : ipAddress,
    severity: alarmState,
    message: alarm.message,
    condition: alarm.condition.value,
    category: alarm.category.value,
    alarmFoundAt: Math.round(new Date(alarm.alarmFoundAt).getTime() / 1000), // Convert ISO8601 Date to Unix date
    lastUpdatedAt: Math.round(new Date(alarm.lastUpdatedAt).getTime() / 1000) // Convert ISO8601 Date to Unix date
  }

  return alarm
}

fetchData()

module.exports = {
  alarms: function (params) {
    /*
    return new Promise(function (resolve, reject) {
      resolve(alarms)
    })
    */
    return alarms
  }
}
