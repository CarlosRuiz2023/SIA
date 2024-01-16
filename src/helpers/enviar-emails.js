// IMPORTACIÓN DEL MÓDULO 'NODEMAILER' PARA EL ENVIO DE CORREOS.
const nodemailer = require("nodemailer");
// Configuración del transporter para Gmail
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "charlyxbox360nuevo@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

transporter.verify().then(() => {
  console.log("Ready for send emails");
});

module.exports = {
  transporter,
};
