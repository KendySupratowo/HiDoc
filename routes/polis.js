const Controller = require("../controllers/controller");
const router = require('express').Router()

router.get('/', Controller.polis)

module.exports = router