'use strict'

const express = require('express')
const controllers = require('../controllers')

let router = express.Router()

router.get('/', function (req, res, next) {
  res.json({
    confirmation: 'success',
    message: ''
  })
})

router.get('/:resource', function (req, res, next) {
  const resource = req.params.resource

  const controller = controllers[resource]
  if (controller == null) {
    res.status(404)
    res.json({
      confirmation: 'fail',
      message: 'Invalid Resource'
    })
    return
  }

  /*
  controller.alarms()
  .then(function (d) {
    res.json(d)
  })
  .catch(function (e) {
    res.json(e)
  })
  */
  res.json(controller.alarms())
})

router.get('/:resource/:node', function (req, res, next) {
  const resource = req.params.resource
  const node = req.params.node
  let controller

  if (controllers[resource] != null) {
    controller = controllers[resource][node]
  }

  if (controller == null) {
    res.status(404)
    res.json({
      confirmation: 'fail',
      message: 'Invalid Resource'
    })
    return
  }

  /*
  controller.alarms()
  .then(function (data) {
    res.json(data)
  })
  .catch(function (error) {
    res.json(error)
  })
  */
  res.json(controller.alarms())
})

module.exports = router
