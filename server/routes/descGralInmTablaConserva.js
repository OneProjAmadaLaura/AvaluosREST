const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

const { Pool } = require('pg');

const logger = require('../config/log');
const validar = require('../utilerias/generales');
const ruta = ' [descGralInmTablaConserva.js] ';
//--------------------------------------------------------------------------/
//   Descripción General del Inmueble
//--------------------------------------------------------------------------/

/****************************************************************************
 * Registro TablaConservacion
 ****************************************************************************/
app.post('/tablaConservacion', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: tablaConservacion';

        logger.info(etiquetaLOG);

        let body = req.body;

        let pFolio = body.Folio;
        let pIdInmConstruccion = body.IdInmConstruccion;

        let pIdClaseConstruccion = body.IdClaseConstruccion;

        let pIdPartidaPorcentaje = body.IdPartidaPorcentaje;

        let pIdPartidaConserva = body.IdPartidaConserva;

        let pUsuarioOperacion = req.usuario.idUsuario;

        let datoNoValido = '';

        let DatResultado = [];

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA -->  ${pFolio}, ${pIdInmConstruccion}, ${pIdClaseConstruccion}, ${pIdPartidaPorcentaje},${pIdPartidaConserva}, ${pUsuarioOperacion}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'N', 'Id Inmueble Construccion',  pIdInmConstruccion);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Id Clase Construccion', pIdClaseConstruccion);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Id Partida Porcentaje', pIdPartidaPorcentaje);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Id Partida Conserva', pIdPartidaConserva);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Usuario', pUsuarioOperacion);

        if (datoNoValido == '') {

            BdTablaConservacion(

                    pFolio,  
                    pIdInmConstruccion,
                    pIdClaseConstruccion,
                    pIdPartidaPorcentaje,
                    pIdPartidaConserva,

                    pUsuarioOperacion

                )
                .then(result => {

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${JSON.stringify(result[0].resultado)}, mensaje = ${JSON.stringify(result[0].mensaje)}, codigo = ${(result[0].resultado) ? codRespuesta.exito : codRespuesta.error}`);

                    if (result[0].resultado) {
                        var elemento = {
                            puntosPartida: result[0].puntospartida,
                            manttRequerido: result[0].manttrequerido,
                            indiceConservacion: result[0].factor,
                            vidaMinimaAnios: result[0].indiceconservacion,
                            puntosAjustados: result[0].puntosajustados
                        }
                        DatResultado.push(elemento);

                    }

                    res.json({
                        ok: result[0].resultado,
                        mensaje: result[0].mensaje,
                        codigo: (result[0].resultado) ? codRespuesta.exito : codRespuesta.error,
                        datos: DatResultado
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
 * Consulta Tabla Conservacion
 ****************************************************************************/
app.get('/consultaTablaConservacion', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaTablaConservacion';
        logger.info(etiquetaLOG);

        let pFolio = req.query.Folio;
        let pIdInmConstruccion = req.query.IdInmConstruccion;
        let pClase = req.query.Clase;
        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let numReg = 0;
        let resultadoDat;
        let folio;
        let clase;
        let tablaResultado = [];

        let datoNoValido = '';
        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pFolio}, ${pIdInmConstruccion}, ${pClase}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Id Inmueble Construccion',  pIdInmConstruccion);

        if (pClase == undefined) {
            // Quiere decir que está consultando inicialmente la información solo del Folio
            pClase = '0';
        }

        if (datoNoValido == '') {
            BdConsultaTablaConservacion(pFolio, pIdInmConstruccion, pClase, pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;
                    resultadoDat = result;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el folio indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    if (numReg > 0) {

                        folio = resultadoDat[0].folio;
                        clase = resultadoDat[0].idclaseconstruccion;

                        for (var i = 0, l = numReg; i < l; i++) {
                            var elemRes = {

                                idPartidaPorcentaje: resultadoDat[i].idpartidaporcentaje,
                                descripcionPartidaPorcentaje: resultadoDat[i].descripcionpartidaporcentaje,
                                puntosPartida: resultadoDat[i].puntospartida,
                                idPartidaConserva: resultadoDat[i].idpartidaconserva,
                                manttRequerido: resultadoDat[i].manttrequerido,

                                indiceConservacion: resultadoDat[i].factor,

                                vidaMinimaAnios: resultadoDat[i].indiceconservacion,
                                puntosAjustados: resultadoDat[i].puntosajustados
                            }
                            tablaResultado.push(elemRes);
                        }
                    }

                    res.json({
                        ok: (numReg > 0 && folio != '') ? true : false,
                        mensaje: (numReg > 0 && folio != '') ? 'Consulta exitosa' : 'No se encontró información',
                        claseConstruccion: (numReg > 0 && folio != '') ? clase : '',
                        tabla: (numReg > 0) ? tablaResultado : [],
                        codigo: (numReg > 0 && folio != '') ? codRespuesta.exito : codRespuesta.noDatos
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

/**************   R e g i s t r o  InmuebleEstadoGeneral  ******************************************/
function BdTablaConservacion(pFolio,
    pIdInmConstruccion,
    pIdClaseConstruccion,
    pIdPartidaPorcentaje,
    pIdPartidaConserva,

    pUsuarioOperacion) {

    let etiquetaLOG = ruta + '[Usuario: ' + pUsuarioOperacion + '] METODO: BdTablaConservacion ';

    try {
        logger.info(etiquetaLOG);

        const client = new Pool(configD);

        logger.info(etiquetaLOG + 'SELECT * FROM fTablaConservacionN(pFolio, pIdInmConstruccion, pIdClaseConstruccion, pIdPartidaPorcentaje,  pIdPartidaConserva, pUsuarioOperacion);');

        let sQuery = 'SELECT * FROM fTablaConservacionN( \'' + pFolio + '\', ' +
            pIdInmConstruccion + ', ' +
            ' \'' + pIdClaseConstruccion + '\',' +
            '(' + pIdPartidaPorcentaje + '::smallint),' +
            '(' + pIdPartidaConserva + '::smallint),' +

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
        throw (`Se presentó un error en BdTablaConservacion: ${err}`);
    }
}

/**************   C o n s u l t a  TablaConservacion  ******************************************/
function BdConsultaTablaConservacion(pFolio, pIdInmConstruccion, pClase, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdConsultaTablaConservacion `;

    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        logger.info(`${ etiquetaLOG } SELECT * FROM fConsultaTablaConservacionN(pFolio, pIdInmConstruccion, pClase);`);

        let sQuery = 'SELECT * FROM fConsultaTablaConservacionN( \'' + pFolio + '\',' + pIdInmConstruccion + ', \'' + pClase + '\');';

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
        throw (`Se presentó un error en BdConsultaTablaConservacion: ${err}`);
    }
}

module.exports = app;