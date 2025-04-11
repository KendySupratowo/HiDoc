const Controller = require("../controllers/controller");
const router = require('express').Router()

router.get('/', Controller.profile)
router.get('/add', Controller.getAddProfile);
router.post('/add', Controller.postAddProfile);
router.get('/edit', Controller.getEditProfile);
router.post('/edit', Controller.postEditProfile);

module.exports = router