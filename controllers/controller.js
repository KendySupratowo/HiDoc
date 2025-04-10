const { User, Profile, Disease, Symptom, Poli } = require('../models')
const bcrypt = require('bcryptjs');
class Controller {
    static landingPage(req, res) {
        res.render('landingPage')
    }

    static getRegis(req, res) {
        res.render('register')
    }

    static async postRegis(req, res) {
        try {
            const { username, email, password, role } = req.body;
            await User.create({
                username,
                email,
                password,
                role
            });
            res.redirect('/login')
        } catch (error) {
            res.send(error)
        }
    }

    static getLogin(req, res) {
        const { error } = req.query
        res.render('login', { error })
    }

    static async postLogin(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ where: { username } });

            if (user) {
                const isValidPassword = bcrypt.compareSync(password, user.password)

                if (isValidPassword) {
                    req.session.userId = user.id
                    req.session.username = user.username
                    return res.redirect('/home')
                } else {
                    const error = 'Invalid Username/Password!'
                    return res.redirect(`/login?error=${error}`)
                }
            } else {
                const error = 'Invalid Username/Password!'
                return res.redirect(`/login?error=${error}`)
            }
            res.redirect('/login')
        } catch (error) {
            res.send(error)
        }
    }

    static getLogout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }

    static home(req, res) {
        res.render('home', { user: req.session })
    }

    static async layanan(req, res) {
        try {
            let data = await Poli.findAll()
            res.render('layanan', { data, user: req.session })
        } catch (error) {
            res.send(error)
        }
    }

    static async profile(req, res) {
        try {
            const userId = req.session.userId;

            const user = await User.findByPk(userId, {
                include: Profile
            });

            // Kalau belum punya profile, arahkan ke form tambah
            if (!user.Profile) {
                return res.redirect('/profile/add');
            }

            // Kalau sudah punya profile, tampilkan
            res.render('profile', { user });
        } catch (error) {
            res.send(error);
        }
    }

    // Form tambah profil
    static getAddProfile(req, res) {
        res.render('addProfile', { errors: [] });
    }

    // Simpan profil ke DB
    static async postAddProfile(req, res) {
        try {
            const { name, age, gender } = req.body;
            await Profile.create({
                name,
                age,
                UserId: req.session.userId
            });
            res.redirect('/profile');
        } catch (error) {
            let errorMessages = [];
            if (error.name === 'SequelizeValidationError') {
                errorMessages = error.errors.map(e => e.message);
            } else {
                errorMessages.push("Terjadi kesalahan");
            }
            res.render('addProfile', { errors: errorMessages });
        }
    }

    static async diseaseSymptom(req, res) {
        try {
            let diseases = await Disease.findAll({
                include: {
                    model: Symptom,
                    through: { attributes: [] }
                }
            });

            res.render('diseaseSymptom', { diseases });
        } catch (error) {
            res.send(error);
        }
    }

    static async checkup(req, res) {
        try {

        } catch (error) {
            res.send(error)
        }
    }

    static async consultation(req, res) {
        try {
            l
        } catch (error) {
            res.send(error)
        }
    }
}
module.exports = Controller