const Controller = require('../controllers/controller')
const router = require('express').Router()
const routerPolis = require('./polis')

router.use('/polis', routerPolis)

router.get('/', Controller.home)

module.exports = router