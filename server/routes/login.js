const express = require('express');
const jwt = require('jsonwebtoken');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

const { Pool } = require('pg');

const fs = require('fs');

const http = require('http');

const logger = require('../config/log');
const ruta = ' [login.js] ';


/****************************************************************************
 * Login
 ****************************************************************************/
app.post('/login', (req, res) => {

    let etiquetaLOG = ruta + ' METODO: Login';
    logger.info(etiquetaLOG);

    let body = req.body;
    let token;
    let usuarioDat;
    let resultado = false;
    let mensaje = '';


    let modUsuario = {
        idUsuario: {
            type: Number
        },
        usuario: {
            type: String
        },
        nombre: {
            type: String
        },
        contraseña: {
            type: String
        },
        idRol: {
            type: Number
        },
        rol: {
            type: String
        },
        idPerito: {
            type: Number
        },
        valuadorIndependiente: {
            type: Boolean
        },
        idSociedad: {
            type: Number
        },
        sociedad: {
            type: String
        },
        estatusUsuario: {
            type: Boolean
        },

    };

    modUsuario.usuario = body.usuarioEmail;
    modUsuario.contraseña = body.contraseña;

    logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${body.usuarioEmail}`);

    validarContrasenia(modUsuario.usuario, modUsuario.contraseña)
        .then(result => {
            usuarioDat = result;

            resultado = usuarioDat.ok;
            mensaje = usuarioDat.mensaje;

            if (usuarioDat.ok) {

                modUsuario.idUsuario = usuarioDat.usuario.idUsuario;
                modUsuario.contraseña = '';
                modUsuario.nombre = usuarioDat.usuario.nombre;

                modUsuario.estatusUsuario = usuarioDat.usuario.estatusUsuario;
                modUsuario.idRol = usuarioDat.usuario.idRol;
                modUsuario.rol = usuarioDat.usuario.rol;

                modUsuario.idPerito = usuarioDat.usuario.idPerito;
                modUsuario.valuadorIndependiente = usuarioDat.usuario.valuadorIndependiente;
                modUsuario.idSociedad = usuarioDat.usuario.idSociedad;
                modUsuario.sociedad = usuarioDat.usuario.sociedad;

                //Se obtiene el token
                token = jwt.sign({
                    usuario: modUsuario
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                logger.info(ruta + 'ok: ' + resultado + ', mensaje: ' + mensaje);

                res.json({
                    ok: resultado,
                    mensaje,
                    usuario: modUsuario,
                    token
                });

            } else {
                logger.error(ruta + 'ERROR: ' + mensaje);
                res.json({
                    ok: resultado,
                    mensaje
                });
            }
        }, (err) => {
            logger.error(ruta + 'ERROR: ' + err);
            res.json({
                ok: false,
                mensaje: err
            });

        })

    .catch((err) => {
        logger.error(ruta + 'ERROR: ' + err);
        res.json({
            ok: false,
            mensaje: err
        });

    });
});

/****************************************************************************
 * Cambio contraseña  
 ****************************************************************************/
app.post('/cambioContrasenia', (req, res) => {

    let etiquetaLOG = ruta + ' METODO: cambioContrasenia';
    logger.info(etiquetaLOG);

    let body = req.body;
    let usuarioDat;
    let resultadoAccion;
    let resultado = false;
    let mensaje = '';

    let modUsuario = {
        usuario: {
            type: String
        },
        contraseña: {
            type: String
        },
        nuevaContraseña: {
            type: String
        },
    };

    modUsuario.usuario = body.usuarioEmail;
    modUsuario.contraseña = body.contraseña;

    logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${body.usuarioEmail}`);

    //Se valida contraseña actual
    validarContrasenia(modUsuario.usuario, modUsuario.contraseña)
        .then(result => {
            usuarioDat = result;

            //modUsuario.nuevaContraseña = bcrypt.hashSync(body.nuevaContraseña, 10);
            modUsuario.nuevaContraseña = body.nuevaContraseña;
            resultado = usuarioDat.ok;
            mensaje = usuarioDat.mensaje;

            if (usuarioDat.ok) {
                //Se ejecuta el cambio de contraseña
                BdCambiarContraseña(usuarioDat.usuario.idUsuario, modUsuario.nuevaContraseña)
                    .then(result => {
                        resultadoAccion = result;

                        resultado = resultadoAccion.resultado;
                        mensaje = resultadoAccion.mensaje;

                        logger.info(ruta + 'ok: ' + resultado + ', mensaje: ' + mensaje);

                        res.json({
                            ok: resultado,
                            mensaje
                        });

                    }, (err) => {
                        logger.error(ruta + 'ERROR: ' + err);
                        res.json({
                            ok: false,
                            mensaje: err
                        });

                    })

                .catch((err) => {
                    logger.error(ruta + 'ERROR: ' + err);
                    res.json({
                        ok: false,
                        mensaje: err
                    });

                });

            } else {
                logger.error(ruta + 'ERROR: ' + mensaje);
                res.json({
                    ok: resultado,
                    mensaje
                });
            }

        }, (err) => {
            logger.error(ruta + 'ERROR: ' + err);
            res.json({
                ok: false,
                mensaje: err
            });

        })

    .catch((err) => {
        logger.error(ruta + 'ERROR: ' + err);
        res.json({
            ok: false,
            mensaje: err
        });

    });
});

/****************************************************************************
 * Reestablecer contraseña --  Solicitud
 ****************************************************************************/
app.post('/solicitudRestContrasenia', (req, res) => {
    let etiquetaLOG = ruta + ' METODO: solicitudRestContrasenia';
    logger.info(etiquetaLOG);

    let body = req.body;
    let token;
    let usuarioDat;
    let resultado = false;
    let mensaje = '';

    let modUsuario = {
        idUsuario: {
            type: Number
        },
        usuario: {
            type: String
        }
    };

    let usuario = body.usuarioEmail;

    BdObtenerUsuario(usuario)
        .then(result => {
            usuarioDat = result[0];

            resultado = usuarioDat.resultado;
            mensaje = usuarioDat.mensaje;

            if (resultado) {
                //Se obtiene token para Restablecer la contraseña

                modUsuario.idUsuario = usuarioDat.idusuario;
                modUsuario.usuario = usuario;

                token = jwt.sign({
                    usuario: modUsuario
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                //Se envía el correo
                let html = htmlCorreo + '<a href="' + dirRestablece + token + '" >' + dirRestablece + token + '</a>';

                //content: fs.createReadStream('.\\server\\images\\LogoOneProject.png'),

                const path = require('path');

                const imgPath = path.join(__dirname, '../images/LogoOneProject.png');

                transporter.sendMail({
                    from: fromCorreo,
                    to: usuario,
                    subject: subjectCorreo,
                    html: html,
                    attachments: [{
                        encoding: 'base64',
                        content: fs.createReadStream(imgPath),
                        cid: 'imagenLogo'
                    }]
                }, function(err, info) {
                    if (err) {
                        logger.error(ruta + 'ERROR: ' + err);
                        res.json({
                            ok: false,
                            mensaje: 'Error al enviar correo ' + err
                        });
                    } else {
                        transporter.close();
                        logger.info(ruta + 'ok: true, mensaje: Se envío correctamente el correo Restablecer');
                        res.json({
                            ok: true,
                            mensaje: 'Se envío correctamente el correo Restablacer'
                        });
                    }
                });
            } else {
                logger.error(ruta + 'ERROR: ' + mensaje);
                res.json({
                    ok: false,
                    mensaje
                });
            }

        }, (err) => {
            logger.error(ruta + 'ERROR: ' + err);
            res.json({
                ok: false,
                mensaje: err
            });

        })

    .catch((err) => {
        logger.error(ruta + 'ERROR: ' + err);
        res.json({
            ok: false,
            mensaje: err
        });

    });

});
/****************************************************************************
 * Reestablecer contraseña --  Asignar nueva contraseña
 ****************************************************************************/
app.post('/restablecerContrasenia', verificaToken, (req, res) => {

    let etiquetaLOG = ruta + ' METODO: restablecerContrasenia';
    logger.info(etiquetaLOG);

    let body = req.body;
    let usuarioDat = req.usuario;
    let resultadoAccion;
    let resultado = false;
    let mensaje = '';

    let modUsuario = {
        idUsuario: {
            type: Number
        },
        usuario: {
            type: String
        },
        nuevaContraseña: {
            type: String
        }
    };

    modUsuario.usuario = body.usuarioEmail;
    modUsuario.nuevaContraseña = body.nuevaContraseña;
    //modUsuario.nuevaContraseña = bcrypt.hashSync(body.nuevaContraseña, 10);

    //Se valida la información del token con la del body

    if (usuarioDat.usuario == modUsuario.usuario) {

        //Se ejecuta el cambio de contraseña
        BdCambiarContraseña(usuarioDat.idUsuario, modUsuario.nuevaContraseña)
            .then(result => {
                resultadoAccion = result;

                resultado = resultadoAccion.resultado;
                mensaje = resultadoAccion.mensaje;

                logger.info(ruta + 'ok: ' + resultado + 'mensaje: ' + mensaje);

                res.json({
                    ok: resultado,
                    mensaje
                });

            }, (err) => {
                logger.error(ruta + err);
                res.json({
                    ok: false,
                    mensaje: err
                });

            })

        .catch((err) => {
            logger.error(ruta + err);
            res.json({
                ok: false,
                mensaje: err
            });

        });

    } else {
        let mensajeError = 'ERROR: Error al validar la clave asignada para restablecer la contraseña';
        logger.error(ruta + mensajeError);
        res.json({
            ok: false,
            mensaje: mensajeError
        });
    }
});


/***********************************************************************************************
 * validarContrasenia -- Indica si es valida la contraseña para login o cambio de contraseña
 **********************************************************************************************/
function validarContrasenia(usuario, contrasenia) {
    let etiquetaLOG = ruta + ' METODO: validarContrasenia';
    logger.info(etiquetaLOG);

    return new Promise(function(resolve, reject) {
        let contraseniaValida;
        let token;
        let usuarioDat;
        let resultado = false;
        let mensaje = '';

        let modUsuario = {
            idUsuario: {
                type: Number
            },
            usuario: {
                type: String
            },
            nombre: {
                type: String
            },
            contraseña: {
                type: String
            },
            idRol: {
                type: Number
            },
            rol: {
                type: String
            },
            idPerito: {
                type: Number
            },
            valuadorIndependiente: {
                type: Boolean
            },
            idSociedad: {
                type: Number
            },
            sociedad: {
                type: String
            },
            estatusUsuario: {
                type: Boolean
            },

        };

        modUsuario.usuario = usuario;
        modUsuario.contraseña = contrasenia;

        BdObtenerUsuario(modUsuario.usuario)
            .then(result => {
                usuarioDat = result[0];

                resultado = usuarioDat.resultado;
                mensaje = usuarioDat.mensaje;

                if (usuarioDat.resultado) {

                    modUsuario.idUsuario = usuarioDat.idusuario;
                    modUsuario.contraseña = usuarioDat.contrasenia;
                    modUsuario.nombre = usuarioDat.nombreusuario;

                    modUsuario.estatusUsuario = usuarioDat.estatususuario;

                    modUsuario.idPerito = usuarioDat.idperito;
                    modUsuario.valuadorIndependiente = usuarioDat.valuadorindependiente;
                    modUsuario.idSociedad = usuarioDat.idsociedad;
                    modUsuario.sociedad = usuarioDat.sociedad;

                    modUsuario.idRol = usuarioDat.idrol;
                    modUsuario.rol = usuarioDat.rol;

                    //Se valida la contraseña

                    if (contrasenia != modUsuario.contraseña) {
                        resultado = false;
                        mensaje = 'Verifique la contraseña';
                    }
                    /*

                                        //Se valida la contraseña
                                        contraseniaValida = 'bcrypt.compareSync(modUsuario.contraseña, usuarioDat.Contrasenia)';

                                        if (contraseniaValida) {


                                        } else {
                                            resultado = false;
                                            mensaje = 'Verifique la contraseña';
                                        }
                                        */

                }

                let resul = {
                    ok: resultado,
                    mensaje,
                    usuario: modUsuario,
                    token
                }

                logger.info(etiquetaLOG + ', ok: ' + resultado + ', mensaje: ' + mensaje);

                resolve(resul);

            }, (err) => {
                logger.error(ruta + err);

                return reject({
                    ok: false,
                    mensaje: err
                });

            })

        .catch((err) => {
            logger.error(ruta + err);
            return reject({
                ok: false,
                mensaje: err
            });

        });
    })

    .catch((err) => {
        logger.error(ruta + err);
        throw (`Se presentó un error en validarContrasenia: ${err.Error}`);
    });
}
/****************************************************************************
/***    L L A M A D O S   A    B A S E     D E    D A T O S    **************
/****************************************************************************

/****************************************************************************
 * BD BdObtenerUsuario
 ****************************************************************************/
function BdObtenerUsuario(Usuario) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ Usuario }] METODO: BdObtenerUsuario `;
    logger.info(etiquetaLOG);

    const client = new Pool(configD);

    return new Promise(function(resolve, reject) {
            client.query(`SELECT * FROM fConsultaUsuarioAcceso ('${Usuario}');`)
                .then(response => {
                    client.end()
                    resolve(response.rows);
                })
                .catch(err => {
                    client.end()
                    reject(`Se presentó un error en fConsultaUsuarioAcceso: ${err}`);
                })
        })
        .catch((err) => {
            client.end()
            throw (`Se presentó un error en BdObtenerUsuario: ${err}`);
        });
}

/****************************************************************************
 * BD BdCambiarContraseña 
 ****************************************************************************/
function BdCambiarContraseña(idUsuario, nuevaContraseña) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ idUsuario }] METODO: BdCambiarContraseña `;
    logger.info(etiquetaLOG);

    const client = new Pool(configD);

    return new Promise(function(resolve, reject) {
        client.query(`SELECT * FROM fUsuarioCambioContrasenia (${idUsuario}, '${nuevaContraseña}');`)
            .then(response => {
                client.end()
                resolve(response.rows[0]);
            })
            .catch(err => {
                client.end()
                reject(`Se presentó un error en fUsuarioCambioContrasenia: ${err}`);
            })
    })

    .catch((err) => {
        client.end()
        throw (`Se presentó un error en BdCambiarContraseña: ${err}`);
    });
}


module.exports = app;