const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

const { Pool } = require('pg');

const logger = require('../config/log');
const validar = require('../utilerias/generales');
const ruta = ' [descGralInmCalcMatriz.js] ';
//--------------------------------------------------------------------------/
//   Descripción General del Inmueble
//--------------------------------------------------------------------------/
/****************************************************************************
 * Registro Calculo Matriz
 ****************************************************************************/
app.post('/CalculoMatriz', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: CalculoMatriz';

        logger.info(etiquetaLOG);

        let body = req.body;

        let pIdInmConstruccion = body.IdInmConstruccion;
        let pIdMatriz = body.IdMatriz;
        let pValores = body.Valores;
        let pUsuarioOperacion = req.usuario.idUsuario;

        let datoNoValido = '';

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA -->  ${pIdInmConstruccion}, ${pIdMatriz}, ${pValores}, ${pUsuarioOperacion}`);

        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'N', 'Id Inmueble Construccion',  pIdInmConstruccion);

        datoNoValido = datoNoValido + validar.datoValido(true, 'R', 'Id Matriz', pIdMatriz);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Valores', pValores);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Usuario', pUsuarioOperacion);

        if (datoNoValido == '') {

            BdCalculoMatriz(

                    pIdInmConstruccion,
                    pIdMatriz,
                    pValores,

                    pUsuarioOperacion

                )
                .then(result => {

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${JSON.stringify(result[0].resultado)}, mensaje = ${JSON.stringify(result[0].mensaje)}, codigo = ${(result[0].resultado) ? codRespuesta.exito : codRespuesta.error}`);
                    console.log(result[0]);
                    res.json({
                        ok: result[0].resultado,
                        mensaje: result[0].mensaje,
                        clase: result[0].clase,
                        puntos: result[0].puntos,
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
 * Consulta Catálogo de matrices
 ****************************************************************************/
app.get('/listaMatrices', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaMatrices';
        logger.info(etiquetaLOG);

        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let tablaResultado = [];

        BdConsultaMatrices(pUsuarioOperacion)
            .then(result => {
                numReg = result.length;
                resultadoDat = result;

                logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el folio indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                if (numReg > 0) {

                    for (var i = 0, l = numReg; i < l; i++) {
                        var elemRes = {

                            clave: resultadoDat[i].clave,
                            descripcion: resultadoDat[i].descripcion
                        }
                        tablaResultado.push(elemRes);
                    }
                }

                res.json({
                    ok: (numReg > 0) ? true : false,
                    mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información',
                    lista: (numReg > 0) ? tablaResultado : [],
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
 * Consulta CalculoMatriz
 ****************************************************************************/
app.get('/consultaCalculoMatriz', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaCalculoMatriz';
        logger.info(etiquetaLOG);

        let pIdInmConstruccion = req.query.IdInmConstruccion;
        let pIdMatriz = req.query.IdMatriz;
        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let numReg = 0;
        let resultadoDat;

        let idMatriz;
        let matriz;

        let secciones = [];
        let subSecciones = [];

        let datoNoValido = '';
        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pIdInmConstruccion}, ${pIdMatriz}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Id Inmueble Construccion',  pIdInmConstruccion);

        if (pIdMatriz == undefined) {
            // Quiere decir que está consultando un registro que ya tiene registrada una matriz
            pIdMatriz = 0;
        }

        let arrMatriz = [];
        if (datoNoValido == '') {
            BdConsultaCalculoMatriz(pIdInmConstruccion, pIdMatriz, pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;
                    resultadoDat = result;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el folio indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    if (numReg > 0) {

                        idMatriz = resultadoDat[0].idmatriz;
                        matriz = resultadoDat[0].matriz;

                        idSeccion = 0;
                        seccion = '';

                        idSubSeccion = 0;
                        subSeccion = '';
                        // Se agrupa la información

                        for (var i = 0, l = numReg; i < l; i++) {

                            if (idSeccion != resultadoDat[i].idseccion) {

                                var elemSec = {
                                    idSeccion: resultadoDat[i].idseccion,
                                    seccion: resultadoDat[i].seccion
                                }

                                var elemSubSec = {
                                    idSeccion: resultadoDat[i].idseccion,
                                    idSubSeccion: resultadoDat[i].idsubseccion,
                                    subSeccion: resultadoDat[i].subseccion
                                }

                                secciones.push(elemSec);
                                subSecciones.push(elemSubSec);

                                idSeccion = resultadoDat[i].idseccion;
                                idSubSeccion = resultadoDat[i].idsubseccion;

                            } else {

                                if (idSubSeccion != resultadoDat[i].idsubseccion) {
                                    var elemSubSec = {
                                        idSeccion: resultadoDat[i].idseccion,
                                        idSubSeccion: resultadoDat[i].idsubseccion,
                                        subSeccion: resultadoDat[i].subseccion
                                    }
                                    subSecciones.push(elemSubSec);
                                    idSubSeccion = resultadoDat[i].idsubseccion;
                                }

                            }

                        }

                        // Se acomoda la información

                        let sub = [];

                        for (var i = 0, lenSecciones = secciones.length; i < lenSecciones; i++) {

                            for (var j = 0, lenSub = subSecciones.length; j < lenSub; j++) {

                                if (subSecciones[j].idSeccion == secciones[i].idSeccion) {

                                    //

                                    let detalle = [];
                                    for (var k = 0, lenDetalle = numReg; k < lenDetalle; k++) {


                                        if (
                                            subSecciones[j].idSeccion == resultadoDat[k].idseccion &&
                                            subSecciones[j].idSubSeccion == resultadoDat[k].idsubseccion
                                        ) {

                                            var elemDetalle = {
                                                clase: resultadoDat[k].clase,
                                                descripcion: resultadoDat[k].descripcion,
                                                puntos: resultadoDat[k].puntos,
                                                seccionado: (resultadoDat[k].seleccionado > 0) ? true : false
                                            }

                                            detalle.push(elemDetalle);

                                        }

                                    }

                                    var elemSub = {
                                        idSubSeccion: subSecciones[j].idSubSeccion,
                                        subSeccion: subSecciones[j].subSeccion,
                                        detalle: detalle
                                    }

                                    sub.push(elemSub);

                                    // Se forza la salida
                                    //break;

                                }

                            }

                            var elemMatriz = {
                                idSeccion: secciones[i].idSeccion,
                                seccion: secciones[i].seccion,
                                idSubSeccion: sub

                            }
                            arrMatriz.push(elemMatriz);

                            sub = [];

                        }

                    }

                    res.json({
                        ok: (numReg > 0) ? true : false,
                        mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información',
                        idMatriz: (numReg > 0) ? idMatriz : '',
                        matriz: (numReg > 0) ? matriz : '',
                        secciones: arrMatriz,
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
                .catch(err => {
                    logger.error(etiquetaLOG + ' ERROR: ' + err.message);
                    res.json({
                        ok: false,
                        mensaje: err.message,
                        codigo: codRespuesta.error
                    });

                });
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
function BdCalculoMatriz(
    pIdInmConstruccion,
    pIdMatriz,
    pValores,
    pUsuarioOperacion) {

    let etiquetaLOG = ruta + '[Usuario: ' + pUsuarioOperacion + '] METODO: BdCalculoMatriz ';

    try {
        logger.info(etiquetaLOG);

        const client = new Pool(configD);

        logger.info(etiquetaLOG + 'SELECT * FROM fInmConstrucMatriz( pIdInmConstruccion, pIdMatriz, pValores, pUsuarioOperacion);');

        let sQuery = 'SELECT * FROM fInmConstrucMatriz( ' +
            pIdInmConstruccion + ', ' +
            '(' + pIdMatriz + '::smallint),' +
            ' \'' + pValores + '\',' +

            pUsuarioOperacion + ');';

        logger.info(sQuery);
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
        throw (`Se presentó un error en BdCalculoMatriz: ${err}`);
    }
}

/**************   C o n s u l t a  TablaConservacion  ******************************************/
function BdConsultaMatrices(pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdConsultaMatrices `;

    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = 'SELECT * FROM fCatMatrices();';

        logger.info(`${etiquetaLOG} ${sQuery} `);

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
        throw (`Se presentó un error en BdConsultaMatrices: ${err}`);
    }
}

/**************   C o n s u l t a  TablaConservacion  ******************************************/
function BdConsultaCalculoMatriz(pIdInmConstruccion, pMatriz, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdConsultaCalculoMatriz `;

    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        logger.info(`${ etiquetaLOG } SELECT * FROM fConsultaInmConstrucMatriz(pIdInmConstruccion, pMatriz);`);

        let sQuery = 'SELECT * FROM fConsultaInmConstrucMatriz( ' + pIdInmConstruccion + ', (' + pMatriz + '::smallint));';

        logger.info(`${etiquetaLOG} ${sQuery} `);

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
        throw (`Se presentó un error en BdConsultaCalculoMatriz: ${err}`);
    }
}

module.exports = app;