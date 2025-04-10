const { formatRupiah } = require('../helpers/helper');
const { User, Profile, Disease, Symptom, Poli, Checkup, Medicine, CheckupSymptom } = require('../models')
const bcrypt = require('bcryptjs');
const sendMail = require('../helpers/mailer');
class Controller {
    static landingPage(req, res) {
        res.render('landingPage')
    }

    static getRegis(req, res) {
        const { error } = req.query
        res.render('register', { error })
    }

    static async postRegis(req, res) {
        try {
            const { username, email, password } = req.body;
            let user = await User.create({
                username,
                email,
                password
            });
            await sendMail(
                user.email,
                "Selamat Datang di HiDoc!",
                `<h1>Halo ${user.username} 👋</h1>
                <p>Terima kasih telah mendaftar di HiDoc. Semoga sehat selalu!</p>`
            );
            res.redirect('/login?msg=Register berhasil! Silakan login.')
        } catch (error) {
            if (error.name === "SequelizeValidationError" || error.name === 'SequelizeUniqueConstraintError') {
                let msg = error.errors.map(el => el.message)
                res.redirect(`/register?error=${msg}`)
            } else {
                res.send(error)
            }
        }
    }

    static getLogin(req, res) {
        const { error, msg } = req.query
        res.render('login', { error, msg })
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

    static async consultation(req, res) {
        try {
            let data = await Poli.findAll()
            res.render('consultation', { data, user: req.session })
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

    static async postAddProfile(req, res) {
        try {
            const { name, age, gender } = req.body;
            await Profile.create({
                name,
                age,
                gender,
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

    static async getEditProfile(req, res) {
        try {
            const userId = req.session.userId; // pastikan user login
            const profile = await Profile.findOne({ where: { UserId: userId } });

            if (!profile) return res.redirect('/profile'); // fallback jika profile belum ada

            res.render('editProfile', { profile });
        } catch (err) {
            res.send(err);
        }
    }


    // Simpan profil ke DB
    static async postEditProfile(req, res) {
        try {
            const { fullName, age, gender } = req.body;
            const userId = req.session.userId;

            const profile = await Profile.findOne({ where: { UserId: userId } });

            if (profile) {
                await profile.update({ fullName, age, gender });
            }

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
            const { search, sort, poli } = req.query;

            let queryOptions = {
                include: [
                    { model: Symptom, through: { attributes: [] } },
                    { model: Poli }
                ],
                where: {}
            };

            if (search) {
                queryOptions.where.diseaseName = {
                    [Op.iLike]: `%${search}%`
                };
            }

            if (sort) {
                queryOptions.order = [['level', sort]];
            }

            let diseases = await Disease.findAll(queryOptions);
            res.render('diseaseSymptom', {
                diseases,
                search,
                sort,
                poli
            });
        } catch (error) {
            res.send(error);
        }
    }

    static async getAddDiagnose(req, res) {
        try {
            const symptoms = await Symptom.findAll();
            res.render('addDiagnose', { symptoms });
        } catch (err) {
            res.send(err);
        }
    }

    static async postAddDiagnose(req, res) {
        try {
            const { symptomIds } = req.body;
            const userId = req.session.userId;
            console.log("REQ.BODY =>", req.body);
            if (!symptomIds) throw new Error("Pilih setidaknya satu gejala.");

            const symptoms = await Symptom.findAll({
                where: { id: symptomIds },
                include: Disease
            });

            const diseaseCount = {};
            symptoms.forEach(symptom => {
                symptom.Diseases.forEach(disease => {
                    if (!diseaseCount[disease.id]) {
                        diseaseCount[disease.id] = { count: 0, disease };
                    }
                    diseaseCount[disease.id].count++;
                });
            });

            const mostLikely = Object.values(diseaseCount).sort((a, b) => b.count - a.count)[0];

            const checkup = await Checkup.create({ UserId: userId, DiseaseId: mostLikely.disease.id });
            await checkup.addSymptoms(symptomIds);

            res.redirect(`/diagnose/result/${checkup.id}`);
        } catch (err) {
            res.send(err);
        }
    }

    static async diagnoseResult(req, res) {
        try {
            const { checkupId } = req.params;

            const checkup = await Checkup.findByPk(checkupId, {
                include: [Symptom]
            });
            let disease = null;

            if (checkup) {
                const symptoms = await checkup.getSymptoms({ include: [Disease] });

                const diseaseCounts = {};
                for (const symptom of symptoms) {
                    for (const disease of symptom.Diseases || []) {
                        diseaseCounts[disease.id] = (diseaseCounts[disease.id] || 0) + 1;
                    }
                }

                // Cari disease dengan gejala terbanyak
                const mostLikelyDiseaseId = Object.entries(diseaseCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

                if (mostLikelyDiseaseId) {
                    disease = await Disease.findByPk(mostLikelyDiseaseId, {
                        include: [Poli, Medicine]
                    });
                }
            }
            res.render('diagnoseResult', { checkup, disease, formatRupiah });

        } catch (error) {
            res.send(error);
        }
    }

    static async checkupHistory(req, res) {
        try {
            const { userId } = req.session;
            const { msg } = req.query
            const checkups = await Checkup.getUserCheckupHistory(userId);
            res.render('checkupHistory', { checkups, msg });
        } catch (error) {
            res.send(error);
        }
    }

    static async deleteCheckup(req, res) {
        try {
            const { id } = req.params;

            // Hapus relasi di tabel pivot
            await CheckupSymptom.destroy({
                where: {
                    CheckupId: id
                }
            });

            // hapus data Checkup
            await Checkup.destroy({
                where: {
                    id
                }
            });

            res.redirect('/diagnose/history?msg=Riwayat Checkup Berhasil dihapus!');
        } catch (error) {
            console.error(error);
            res.send(error);
        }
    }

}
module.exports = Controller