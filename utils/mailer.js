const nodeMailer = require("nodemailer");

const option = {
    host: "smtp.iran.liara.ir",
    port: 587,
    auth: {
        user: "thre",
        pass: "cc83943e-1051-4918-a6e3-59e353cf63a0",
    },
    tls: true
}

exports.sendEmail = (email, fullname, subject, message) => {
    const transporter = nodeMailer.createTransport(option);
    transporter.sendMail({
        from: "noreply@pedaint.co",
        to: email,
        subject: subject,
        html: `<h1> سلام ${fullname}</h1>
            <p>${message}</p>`,
    }).then(() => console.log('OK, Email has been sent.'))
        .catch(console.error);
};
