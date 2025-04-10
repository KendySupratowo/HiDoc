const Controller = require("../controllers/controller");
const router = require('express').Router()

router.get('/', Controller.getRegis)
router.post('/', Controller.postRegis)

module.exports = router