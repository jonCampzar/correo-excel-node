require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors());


app.post('/enviar-excel', async (req, res) => {
    const { archivo, correo } = req.body;

    if (!archivo || !correo) {
        return res.status(400).send('Faltan datos');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.CORREO_GMAIL,
            pass: process.env.APP_PASSWORD
        }
    });

    const fechaActual = new Date().toISOString().split('T')[0]; // Formato: YYYY-MM-DD
    const mailOptions = {
        from: process.env.CORREO_GMAIL,
        to: correo,
        subject: 'Archivo Excel generado desde tu app',
        text: 'Hola preciosa, adjunto el archivo Excel generado desde la app.',
        attachments: [{
            filename: `preliminar_${fechaActual}.xlsx`,
            content: Buffer.from(archivo, 'base64'),
            encoding: 'base64'
        }]
    };

    try {
        await transporter.sendMail(mailOptions);
        res.send('Correo enviado exitosamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al enviar el correo');
    }
});

app.get('/', (req, res) => {
    res.send("Servidor activo para enviar Excel por correo.");
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});