const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'soporte.tiendas@crec.com.gt',
        pass: 'Stiendas*2018'
    }
});

var enviar_correo = (texto, destinatario) => {
    const mailOptions = {
        from: 'soporte.tiendas@crec.com.gt',
        to: destinatario,
        subject: 'Solicitud de agregar dirección a Garantias',
        text: texto
    }
    transporter.sendMail(mailOptions, (err, inf) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Correo enviado!');
        }
    })
}

module.exports = enviar_correo;