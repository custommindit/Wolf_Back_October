const nodemailer = require('nodemailer');

const sendMail = (req, res, next) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ehabatef205@gmail.com',
            pass: 'sfrkmthwtbkxqsfm'
        }
    });

    const mailOptions = {
        from: 'ehabatef205@gmail.com', // sender address
        to: req.body.email, // list of receivers
        subject: 'Email from custom mind', // Subject line
        text: 'Hello, Amin this first email from custom mind company for test send email', // plain text body
        // You can also use html: '<b>Hello, this is a test email!</b>' for HTML emails
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.json({
                error
            });
        } else {
            res.json({ message: `Email sent successfully ${info.response}` });
        }
    });

}

module.exports = {
    sendMail
}