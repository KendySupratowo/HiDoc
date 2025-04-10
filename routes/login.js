const Controller = require("../controllers/controller");
const router = require('express').Router()

router.get('/', Controller.getLogin)
router.post('/', Controller.postLogin)

module.exports = router