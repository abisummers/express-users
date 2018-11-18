const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.gmail_email,
    pass: process.env.gmail_password
  },
  debug: true
});

function sendSignupMail(userDoc) {
  const { fullName, email } = userDoc;

  return transport.sendMail({
    from: "Express Users <express.users@example.com>",
    to: `${fullName} <${email}>`,
    subject: "Thank you for joining us!",
    text: `Welcome ${fullName}. Thank you for joining Express Users`,
    html: `
    <h1 style="color: orange"> Welcome ${fullName} to Express Users </h1>
    <p>Thank you for joining us</p>`
  });
}

module.exports = { sendSignupMail };
