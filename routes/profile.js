const Controller = require("../controllers/controller");
const router = require('express').Router()

router.get('/', Controller.profile)
router.get('/add', Controller.getAddProfile);
router.post('/add', Controller.postAddProfile);

module.exports = router