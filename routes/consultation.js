const Controller = require("../controllers/controller");
const router = require('express').Router()

router.get('/', Controller.consultation)
router.get('/:id', Controller.meet)


module.exports = router