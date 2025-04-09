const { Poli } = require('../models')

class Controller {
    static home(req, res) {
        res.render('home')
    }

    static async polis(req, res) {
        try {
            let data = await Poli.findAll()
            res.render('layanan', { data })
        } catch (error) {
            res.send(error)
        }
    }
}
module.exports = Controller