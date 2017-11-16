'use strict'

const express = require('express')
const controllers = require('../controllers')
const monitors = require('../controllers/monitors')

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

  controller.alarms()
  .then(function (d) {
    res.json(d)
  })
  .catch(function (e) {
    res.json(e)
  })
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

  controller.alarms()
  .then(function (d) {
    res.json(d)
  })
  .catch(function (e) {
    res.json(e)
  })
})

module.exports = router
