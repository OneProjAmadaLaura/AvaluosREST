const nodemailer = require('nodemailer');

//==========
// Puerto
//==========
process.env.PORT = process.env.PORT || 2020;

//==============================
// Cadena de conexión a Datos
//==============================
/*
configD = {
        user: 'postgres',
        host: '192.168.1.27',
        database: 'avaluos',
        password: 'progre$o',
        port: 5432
    }
    */

configD = {
    user: 'postgres',
    host: 'localhost',
    database: 'AvaluosDiagrama',
    password: 'AdminSql',
    port: 5432
}

//=================
// Tiempo expira
//=================
process.env.CADUCIDAD_TOKEN = 8 * 60 * 60 * 1000;

//==========
// SEED
//==========
process.env.SEED = '53m1ll4T0k3n';

//==========
// Correo
//==========
transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    auth: {
        user: 'simon@oneproject.com',
        pass: 'bxykfvwsbjrgvhnf'
    }
});

fromCorreo = 'simon@oneproject.com';

dirRestablece = 'http://192.168.1.26:4200/ChangeLoginComponent?token=';

subjectCorreo = 'Sistema de Avalúos - Restablecer contraseña ';

htmlCorreo = '<img src="cid:imagenLogo" width="30%" height="20%" /><br/><br/> <div style="text-align:center;font-family:Arial Unicode MS"><h1>Avalúos</h1><br/><br/><br/><h2>Restablecer contraseña</h2><br/><br/><p>Para cambiar tu contraseña, da clic en el vínculo de abajo, o copia y pega en la barra de direcciones de tu navegador.</p><br/><br/><br/>';

//===================================================
// Códigos de respuesta de los servicios solicitados
//===================================================
codRespuesta = {
    exito: 'AV200',
    noDatos: 'AV201',
    error: 'AV400'
}