const Controller = require("../controllers/controller");
const router = require('express').Router()

router.get('/', Controller.getAddDiagnose);
router.post('/', Controller.postAddDiagnose);
router.get('/result/:checkupId', Controller.diagnoseResult);
router.get('/history', Controller.checkupHistory);
router.get('/:id/delete', Controller.deleteCheckup);

module.exports = router