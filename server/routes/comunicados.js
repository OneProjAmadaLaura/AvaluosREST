const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

const { Pool } = require('pg');

const logger = require('../config/log');
const validar = require('../utilerias/generales');
const { exceptions } = require('../config/log');
const ruta = ' [comunicados.js] ';
//--------------------------------------------------------------------------/
//   Comunicados
//--------------------------------------------------------------------------/

/****************************************************************************
 * Registro, edición de Comunicados, la sociedad depende del usuario firmado
 ****************************************************************************/
app.post('/comunicadosSociedad', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: comunicadosSociedad';

        logger.info(etiquetaLOG);

        let body = req.body;

        let pIdComunicado = body.IdComunicado;

        let pTitulo = body.Titulo;
        let pComunicado = body.Comunicado;
        let pEstatus = body.Estatus;

        let pUsuarioOperacion = req.usuario.idUsuario;
        let pIdSociedad = req.usuario.idSociedad;
        let datoNoValido = '';

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA -->  ${pIdComunicado}, ${pIdSociedad}, ${pTitulo}, ${pComunicado}, ${pEstatus}, ${pUsuarioOperacion}`);
        console.log(req.usuario);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'R', 'Id Comunicado', pIdComunicado);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'S', 'Titúlo', pTitulo);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'S', 'Comunicado',  pComunicado);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'B', 'Estatus',  pEstatus);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Usuario', pUsuarioOperacion);

        if (datoNoValido == '') {

            BdComunicadosSociedad(
                    pIdComunicado,
                    pIdSociedad,
                    pTitulo,
                    pComunicado,
                    pEstatus,
                    pUsuarioOperacion
                )
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

                })
                .catch((err) => {

                    logger.error(ruta + 'ERROR: ' + err);
                    res.json({
                        ok: false,
                        mensaje: err.message,
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
 * Consulta comunicadosSociedad - Consulta para Edición
 ****************************************************************************/
app.get('/consultaComunicadosSociedad', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaComunicadosSociedad';
        logger.info(etiquetaLOG);

        // Del token
        let pIdRol = req.usuario.idRol;
        let pIdSociedad = req.usuario.idSociedad;
        let pUsuarioOperacion = req.usuario.idUsuario;
        let pUsuario = req.usuario.usuario;

        let numReg = 0;
        let resultadoDat;
        let tablaResultado = [];

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pUsuario}`);

        BdConsultaComunicadosSociedad(pIdRol, pIdSociedad, pUsuarioOperacion)
            .then(result => {
                numReg = result.length;
                resultadoDat = result;

                logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el folio indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                if (numReg > 0) {

                    for (var i = 0, l = numReg; i < l; i++) {
                        var elemRes = {

                            idComunicado: resultadoDat[i].idcomunicado,
                            titulo: resultadoDat[i].titulo,
                            comunicado: resultadoDat[i].comunicado,
                            estatus: resultadoDat[i].estatus
                        }
                        tablaResultado.push(elemRes);
                    }

                }

                res.json({
                    ok: (numReg > 0) ? true : false,
                    mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información',
                    comunicados: (numReg > 0) ? tablaResultado : [],
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
 * Consulta comunicadosSociedad - Consulta para pantalla de Inicio
 ****************************************************************************/
app.get('/consultaComunicadosInicio', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaInmuebleConstruc';
        logger.info(etiquetaLOG);

        let pIdSociedad = req.usuario.idSociedad;
        let pUsuarioOperacion = req.usuario.idUsuario;
        let pUsuario = req.usuario.usuario;

        let numReg = 0;
        let resultadoDat;
        let tablaResultado = [];

        let datoNoValido = '';
        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pUsuario}`);

        if (datoNoValido == '') {
            BdConsultaComunicadosInicio(pIdSociedad, pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;
                    resultadoDat = result;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el folio indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    if (numReg > 0) {

                        for (var i = 0, l = numReg; i < l; i++) {
                            var elemRes = {

                                idComunicado: resultadoDat[i].idcomunicado,
                                titulo: resultadoDat[i].titulo,
                                comunicado: resultadoDat[i].comunicado
                            }
                            tablaResultado.push(elemRes);
                        }

                    }

                    res.json({
                        ok: (numReg > 0) ? true : false,
                        mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información',
                        comunicados: (numReg > 0) ? tablaResultado : [],
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
            logger.error(etiquetaLOG + ' ' + datoNoValido);
            res.json({
                ok: false,
                mensaje: datoNoValido.substring(1),
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
/****************************************************************************/
/**************   R e g i s t r o  InmuebleConstrucciones  ******************************************/

function BdComunicadosSociedad(pIdComunicado, pIdSociedad, pTitulo,
    pComunicado, pEstatus, pUsuarioOperacion) {

    let etiquetaLOG = ruta + '[Usuario: ' + pUsuarioOperacion + '] METODO: BdComunicadosSociedad ';

    try {
        logger.info(etiquetaLOG);

        const client = new Pool(configD);

        logger.info(etiquetaLOG + 'SELECT * FROM fComunicadosSociedad (pIdComunicado, pIdSociedad, pTitulo, pComunicado, pEstatus, pUsuarioOperacion);');

        let sQuery = 'SELECT * FROM fComunicadosSociedad(' +
            pIdComunicado + ', ' +
            pIdSociedad + ', ' +
            ' \'' + pTitulo + '\', ' +
            ' \'' + pComunicado + '\', ' +
            '(' + pEstatus + '::boolean),' +
            pUsuarioOperacion + ');';

        logger.info(`${ etiquetaLOG }` + sQuery);

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
        throw (`Se presentó un error en BdInmuebleConstrucciones: ${err}`);
    }
}

/**************   C o n s u l t a  Edición  ******************************************/
function BdConsultaComunicadosSociedad(pIdRol, pIdSociedad, pUsuarioOperacion) {
    let etiquetaLOG = ruta + '[Usuario: ' + pUsuarioOperacion + '] METODO: BdConsultaComunicadosSociedad ';

    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultaComunicadosSociedad (${pIdRol}, ${pIdSociedad});`;

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
        throw (`Se presentó un error en BdConsultaComunicadosSociedad: ${err}`);
    }
}
/**************   C o n s u l t a  Inicio  ******************************************/
function BdConsultaComunicadosInicio(pIdSociedad, pUsuarioOperacion) {
    let etiquetaLOG = ruta + '[Usuario: ' + pUsuarioOperacion + '] METODO: BdConsultaComunicadosInicio ';

    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultaComunicadosInicio (${pIdSociedad});`;

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
        throw (`Se presentó un error en BdConsultaComunicadosInicio: ${err}`);
    }
}

module.exports = app;