const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail", // bisa juga pakai 'yahoo', 'hotmail', dsb
    auth: {
        user: 'missyuel15@gmail.com',      // email pengirim
        pass: 'firlhadjcanvjukq'      // password / app password
    }
});

function sendMail(to, subject, html) {
    const mailOptions = {
        from: '"HiDoc" <missyuel15@gmail.com>',
        to,
        subject,
        html
    };

    return transporter.sendMail(mailOptions);
}

module.exports = sendMail;
