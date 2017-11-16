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
  const url = new URL(process.env.URL_NAGIOS)

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

    // Parse hosts down
    for (let i in data.hosts) {
      let alarm = parseAlarm(data.hosts[i])
      let severity = alarm.severity.description.toLowerCase()

      alarms[severity].alarms.push(alarm)
      alarms[severity].alarmCount++

      //alarms.push(parseAlarm(data.hosts[i]))
    }

    // Parse services down
    for (let i in data.services) {
      let alarm = parseAlarm(data.services[i])
      let severity = alarm.severity.description.toLowerCase()

      alarms[severity].alarms.push(alarm)
      alarms[severity].alarmCount++

      //alarms.push(parseAlarm(data.services[i]))
    }

    setTimeout(() => { fetchData() }, 1000)
  })
  .catch((error) => {
    console.log({
      source: 'nagios',
      error: error.message
    })
    setTimeout(() => { fetchData() }, 10000)
  })
}

function parseAlarm (alarm) {
  let condition = alarm.perf_data.length > 0 ? alarm.perf_data.split(' ') : []
  
    if (condition.length > 0) {
      for (let i in condition) {
        let item = condition[i].split(';')
  
        condition[i] = {
          name: item[0].split('=')[0],
          value: item[0].split('=')[1],
          warningLevel: item[1],
          criticalLecel: item[2]
        }
      }
    }
  
    let alarmState = {
      id: alarm.host_address !== undefined ? alarm.state : 2 // Set host down to critical
    }
  
    /**
     * Warning IDs
     * 0 = Normal
     * 1 = Minor
     * 2 = Major/Warning
     * 3 = Unknown
     * 4 = Critical
     */
    switch (alarmState.id) {
      case 0:
        alarmState.id = 0
        alarmState.description = 'NORMAL'
        break
      case 1:
        alarmState.id = 2
        alarmState.description = 'MAJOR'
        break
      case 2:
        alarmState.id = 4
        alarmState.description = 'CRITICAL'
        break
      default:
        alarmState.id = 3
        alarmState.description = 'UNKNOWN'
        break
    }
  
    alarm = {
      alarmSource: 'nagios',
      deviceName: alarm.host_name || alarm.name,
      deviceMAC: null,
      deviceIP: alarm.host_address || alarm.address,
      severity: alarmState,
      message: alarm.plugin_output,
      condition: condition,
      category: alarm.groups,
      alarmFoundAt: alarm.last_state_change,
      lastUpdatedAt: alarm.last_check
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
