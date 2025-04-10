const Controller = require('../controllers/controller')
const router = require('express').Router()

const routerRegis = require('./register')
const routerLogin = require('./login')
const routerProfile = require('./profile')

router.get('/', Controller.landingPage)
router.use('/register', routerRegis)
router.use('/login', routerLogin)

router.use(function (req, res, next) {
    if (!req.session.userId) {
        const error = 'Please Login First!'
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
})

router.use('/profile', routerProfile)

router.get('/logout', Controller.getLogout)
router.get('/home', Controller.home)
router.get('/layanan', Controller.layanan)
router.get('/diseaseSymptom', Controller.diseaseSymptom)
router.get('/checkup', Controller.checkup)
router.get('/consultation', Controller.consultation)



module.exports = router