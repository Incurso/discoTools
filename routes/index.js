const express = require('express')
const controllers = require('../controllers')
const router = express.Router()

function formatDuration (time) {
  let timeDays = Math.floor(time / 24 / 3600)
  let timeHours = Math.floor((time - (timeDays * 24 * 3600)) / 3600)
  let timeMinutes = Math.floor((time - (timeDays * 24 * 3600 + timeHours * 3600)) / 60)
  let timeSeconds = Math.floor(time - (timeDays * 24 * 3600 + timeHours * 3600 + timeMinutes * 60))

  timeSeconds = timeSeconds < 10 ? '0' + timeSeconds : timeSeconds
  timeMinutes = timeMinutes < 10 ? '0' + timeMinutes : timeMinutes
  timeDays = timeDays > 0 ? timeDays : ''

  return timeDays + ' ' + timeHours + ':' + timeMinutes + ':' + timeSeconds
}

/* GET home page. */
router.get('/', function (req, res, next) {
  const list = ['Critical', 'Major', 'Minor', 'Unknown']
  let alarms = controllers.monitors.alarms()

  res.render('index', { title: 'Express', list: list, alarms: alarms })
})

module.exports = router
