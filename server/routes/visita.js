const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

const { Pool } = require('pg');

const logger = require('../config/log');
const validar = require('../utilerias/generales');
const ruta = ' [visita.js] ';
//--------------------------------------------------------------------------/
//   Visita
//--------------------------------------------------------------------------/

/****************************************************************************
 * Registro
 ****************************************************************************/
app.post('/visita', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: visita';

        logger.info(etiquetaLOG);

        let body = req.body;

        let pFolio = body.Folio;

        let pNombreContacto  =  body.NombreContacto;
        let pPaternoContacto  =  body.PaternoContacto;
        let pMaternoContacto  =  body.MaternoContacto;
        let pCorreoElectronico  =  body.CorreoElectronico;
        let pTelefonoFijo  =  body.TelefonoFijo;
        let pExtTelefono  =  body.ExtTelefono;
        let pTelefonoMovil  =  body.TelefonoMovil;
        let pFechaVisita  =  body.FechaVisita;
        let pHoraVisita  =  body.HoraVisita;
        let pObservaciones  =  body.Observaciones;

        let pUsuarioOperacion = req.usuario.idUsuario;

        let datoNoValido = '';

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA -->  ${pFolio}, ${pNombreContacto}, ${pPaternoContacto}, ${pMaternoContacto}, ${pCorreoElectronico}, ${pTelefonoFijo}, ${pExtTelefono}, ${pTelefonoMovil}, ${pFechaVisita}, ${pHoraVisita}, ${pObservaciones}, ${pUsuarioOperacion}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Nombre contacto', pNombreContacto);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Paterno contacto', pPaternoContacto);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Materno contacto', pMaternoContacto);

        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Correo electrónico', pCorreoElectronico);

        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Telefono Fijo', pTelefonoFijo);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Ext Telefono', pExtTelefono);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Telefono Movil', pTelefonoMovil);

        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Fecha', pFechaVisita);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Hora', pHoraVisita);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Observaciones', pObservaciones);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Usuario', pUsuarioOperacion);

        if (datoNoValido == '') {

            BdVisita(
                    '\'' + pFolio.trim() + '\'',
                    '\'' + pNombreContacto.trim() + '\'',
                    '\'' + pPaternoContacto.trim() + '\'',
                    (pMaternoContacto.toUpperCase() == 'NULL') ? null : '\'' + pMaternoContacto.trim() + '\'',

                    (pCorreoElectronico.toUpperCase() == 'NULL') ? null : '\'' + pCorreoElectronico.trim() + '\'',

                    (pTelefonoFijo.toUpperCase() == 'NULL') ? null : '\'' + pTelefonoFijo.trim() + '\'',
                    (pExtTelefono.toUpperCase() == 'NULL') ? null : '\'' + pExtTelefono.trim() + '\'',
                    (pTelefonoMovil.toUpperCase() == 'NULL') ? null : '\'' + pTelefonoMovil.trim() + '\'',

                    (pFechaVisita.toUpperCase() == 'NULL') ? null : '\'' + pFechaVisita.trim() + '\'',
                    (pHoraVisita.toUpperCase() == 'NULL') ? null : '\'' + pHoraVisita.trim() + '\'',
                    (pObservaciones.toUpperCase() == 'NULL') ? null : '\'' + pObservaciones.trim() + '\'',
                    pUsuarioOperacion)
                .then(result => {

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${JSON.stringify(result[0].resultado)}, mensaje = ${JSON.stringify(result[0].mensaje)}, codigo = ${(result[0].resultado) ? codRespuesta.exito : codRespuesta.error}`);
                    res.json({
                        ok: result[0].resultado,
                        mensaje: result[0].mensaje,
                        codigo: (result[0].resultado) ? codRespuesta.exito : codRespuesta.error
                    });

                }, (err) => {
                    logger.error(`${etiquetaLOG} RESPUESTA: ok = false, mensaje = ${err}`);
                    res.json({
                        ok: false,
                        mensaje: err,
                        codigo: codRespuesta.error
                    });

                });

        } else {
            logger.error(etiquetaLOG + ' ' + datoNoValido.substring(1));
            res.json({
                ok: false,
                mensaje: datoNoValido.substring(1),
                codigo: codRespuesta.error
            });

        }
    } catch (err) {
        logger.error(ruta + 'ERROR: ' + err);
        res.json({
            ok: false,
            mensaje: err.message,
            codigo: codRespuesta.error
        });

    }
});

/****************************************************************************
 * Consulta
 ****************************************************************************/
app.get('/consultaVisita', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaVisita';
        logger.info(etiquetaLOG);

        let pFolio = req.query.Folio;
        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let numReg = 0;
        let resultadoDat;

        let datoNoValido = '';
        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pFolio}`);

        if (pFolio == undefined || pFolio == '') {
            datoNoValido = 'folio';
        } else if (pFolio.trim() == '') {
            datoNoValido = 'folio';
        }

        if (datoNoValido == '') {
            BdConsultaVisita(pFolio.trim(), pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;
                    resultadoDat = result;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el folio indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    res.json({
                        ok: (numReg > 0) ? true : false,
                        mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información con el folio indicado',
                        visita: resultadoDat,
                        codigo: (numReg > 0) ? codRespuesta.exito : codRespuesta.noDatos
                    });

                }, (err) => {
                    logger.error(`${etiquetaLOG} RESPUESTA: ok = false, mensaje = ${err}`);
                    res.json({
                        ok: false,
                        mensaje: err,
                        codigo: codRespuesta.error
                    });
                })
        } else {
            logger.error(etiquetaLOG + ' ERROR: El ' + datoNoValido + ' indicado no es válido');
            res.json({
                ok: false,
                mensaje: 'El ' + datoNoValido + ' indicado no es válido',
                codigo: codRespuesta.error
            });
        }
    } catch (err) {
        logger.error(`${ruta} ERROR: ${err}`);
        res.json({
            ok: false,
            mensaje: err.message,
            codigo: codRespuesta.error
        });
    }
});

/****************************************************************************
/***    L L A M A D O S   A    B A S E     D E    D A T O S    **************
/***************************************************************************/
/********************   R e g i s t r o   **********************************/
function BdVisita(pFolio, pNombreContacto, pPaternoContacto, pMaternoContacto, pCorreoElectronico,
    pTelefonoFijo, pExtTelefono, pTelefonoMovil, pFechaVisita, pHoraVisita, pObservaciones, pUsuarioOperacion) {

    let etiquetaLOG = ruta + '[Usuario: ' + pUsuarioOperacion + '] METODO: BdVisita ';

    try {
        logger.info(etiquetaLOG);

        const client = new Pool(configD);

        logger.info(etiquetaLOG + 'SELECT * FROM fVisita (pFolio, pNombreContacto, pPaternoContacto, pMaternoContacto, pCorreoElectronico, pTelefonoFijo, pExtTelefono, pTelefonoMovil, pFechaVisita, pHoraVisita, pObservaciones, pUsuarioOperacion);');

        let sQuery = `SELECT * FROM fVisita (${pFolio}, ${pNombreContacto}, ${pPaternoContacto}, ${pMaternoContacto}, ${pCorreoElectronico}, ${pTelefonoFijo}, ${pExtTelefono}, ${pTelefonoMovil}, ${pFechaVisita}, ${pHoraVisita}, ${pObservaciones}, ${pUsuarioOperacion});`;

        logger.info(`${ etiquetaLOG } ${sQuery} `);

        return new Promise(function(resolve, reject) {
            client.query(sQuery)
                .then(response => {
                    client.end()
                    logger.info(etiquetaLOG + 'RESULTADO: ' + JSON.stringify(response.rows));
                    resolve(response.rows);
                })
                .catch(err => {
                    client.end()
                    logger.error(etiquetaLOG + 'ERROR: ' + err + ' CODIGO_BD(' + err.code + ')');
                    reject(err.message + ' CODIGO_BD(' + err.code + ')');
                })
        });
    } catch (err) {
        logger.error(`${ ruta } ERROR: ${ err }`);
        throw (`Se presentó un error en BdVisita: ${err}`);
    }
}
/**************   C o n s u l t a   ******************************************/
function BdConsultaVisita(pFolio, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdConsultaVisita `;
    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultaVisita('${pFolio}');`;
        logger.info(`${ etiquetaLOG } ${sQuery} `);
        return new Promise(function(resolve, reject) {
            client.query(sQuery)
                .then(response => {
                    client.end();
                    logger.info(etiquetaLOG + 'RESULTADO: ' + JSON.stringify(response.rows));
                    resolve(response.rows);
                })
                .catch(err => {
                    client.end()
                    logger.error(etiquetaLOG + 'ERROR: ' + err.message + ' CODIGO_BD(' + err.code + ')');
                    reject(err.message + ' CODIGO_BD(' + err.code + ')');
                })
        });
    } catch (err) {
        logger.error(`${ ruta } ERROR: ${ err } `);
        throw (`Se presentó un error en BdConsultaVisita: ${err}`);
    }
}

module.exports = app;