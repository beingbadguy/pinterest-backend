import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: "authorisedaman@gmail.com",
    pass: "rbhpqxhpspniydco",
  },
});

async function sendMail(to, subject, text, html) {
  const info = await transporter.sendMail({
    from: '"Pinterest 📷" <authorisedaman@gmail.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  });
}

export default sendMail;
