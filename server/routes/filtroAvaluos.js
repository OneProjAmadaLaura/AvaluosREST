const express = require('express');
const jwt = require('jsonwebtoken');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

const { Pool } = require('pg');

const http = require('http');

const logger = require('../config/log');
const validar = require('../utilerias/generales');
const ruta = ' [filtroAvaluos.js] ';

/****************************************************************************
 * Consulta de avalúos por usuario
 ****************************************************************************/
app.get('/consultaAvaluos', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaAvaluos';
        logger.info(etiquetaLOG);

        // Del token
        let usuario = req.usuario.idUsuario;

        let numReg = 0;

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${usuario}`);

        BdConsultarAvaluos(usuario)
            .then(result => {
                numReg = result.length;

                logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                res.json({
                    ok: (numReg > 0) ? true : false,
                    mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información',
                    lista: (numReg > 0) ? result : [],
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
        logger.error(ruta + 'ERROR: ' + err);
        res.json({
            ok: false,
            mensaje: err.message,
            codigo: codRespuesta.error
        });

    }
});

/****************************************************************************
 * Filto avalúos 
 ****************************************************************************/
app.get('/filtroAvaluos', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: filtroAvaluos';
        logger.info(etiquetaLOG);

        let folio = req.query.Folio;
        let fechaIni = req.query.FechaIni;
        let fechaFin = req.query.FechaFin;
        let tipoAvaluo = req.query.TipoAvaluo;
        let solicitante = req.query.Solicitante;
        let estatus = req.query.Estatus;

        let numReg = 0;

        if (folio == undefined &
            fechaIni == undefined &
            fechaFin == undefined &
            tipoAvaluo == undefined &
            solicitante == undefined &
            estatus == undefined) {
            res.json({
                ok: false,
                mensaje: 'No se han indicado parámetros válidos'
            });
        } else {

            if (folio == undefined) { folio = ''; }
            if (fechaIni == undefined) { fechaIni = ''; }
            if (fechaFin == undefined) { fechaFin = ''; }
            if (tipoAvaluo == undefined) { tipoAvaluo = 0; }
            if (solicitante == undefined) { solicitante = ''; }
            if (estatus == undefined) { estatus = 0; }

            logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${folio}, ${fechaIni}, ${fechaFin}, ${tipoAvaluo}, ${solicitante}, ${estatus}`);

            BdFiltarAvaluos(folio, fechaIni, fechaFin, tipoAvaluo, solicitante, estatus)
                .then(result => {
                    numReg = result.length;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el filtro indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    res.json({

                        ok: (numReg > 0) ? true : false,
                        mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información con el filtro indicado',
                        avaluos: (numReg > 0) ? result : [],
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
 * Listas para filtrar avalúos 
 ****************************************************************************/
app.get('/listaFiltroAvaluos', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: listaFiltroAvaluos';
        logger.info(etiquetaLOG);

        let pCatalogo = req.query.Catalogo;

        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let numReg = 0;

        let datoNoValido = '';
        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pCatalogo}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Catalogo', pCatalogo);

        if (datoNoValido == '') {

            BdListaFiltroAvaluos(pCatalogo, pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información de la lista indicada'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    res.json({
                        ok: (numReg > 0) ? true : false,
                        mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información de la lista indicada',
                        lista: (numReg > 0) ? result : [],
                        codigo: (numReg > 0) ? codRespuesta.exito : codRespuesta.noDatos
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
            logger.error(etiquetaLOG + ' ' + datoNoValido);
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
 * Consulta del avance del registro del avalúo  -- fConsultaAvanceAvaluo
 ****************************************************************************/
app.get('/consultaAvanceAvaluo', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaAvanceAvaluo';
        logger.info(etiquetaLOG);

        let pFolio = req.query.Folio;

        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let numReg = 0;

        let datoNoValido = '';
        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pFolio}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);

        if (datoNoValido == '') {

            BdConsultaAvanceAvaluo(pFolio, pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;
                    resultadoDat = result;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información de la lista indicada'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    if (numReg > 0) {
                        var elemRes = {

                            visita: resultadoDat[0].visita,
                            antecedentes: resultadoDat[0].antecedentes,
                            caracteristicasUrbanas: resultadoDat[0].caracteristicasurbanas,
                            terreno: resultadoDat[0].terreno,
                            descripcionGralInmueble: resultadoDat[0].descripgralinmueble,
                            elementosConstruccion: resultadoDat[0].elementosconstruccion,
                            consideracionPreviasAvaluo: resultadoDat[0].consideracionpreviasavaluo,
                            avaluoFisicoDirecto: resultadoDat[0].avaluofisicodirecto,
                            valorCapitalizacionRentas: resultadoDat[0].valorcapitalizacionrentas,
                            anexoFotografico: resultadoDat[0].anexofotografico
                        }
                    }

                    res.json({
                        ok: (numReg > 0) ? true : false,
                        mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información de la lista indicada',
                        lista: (numReg > 0) ? elemRes : [],
                        codigo: (numReg > 0) ? codRespuesta.exito : codRespuesta.noDatos
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
            logger.error(etiquetaLOG + ' ' + datoNoValido);
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
/***    L L A M A D O S   A    B A S E     D E    D A T O S    **************
/****************************************************************************/
/**************   Filtro   ******************************************/
function BdFiltarAvaluos(folio, fechaIni, fechaFin, tipoAvaluo, solicitante, estatus, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdFiltarAvaluos `;
    try {

        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultaFolios ('${folio}','${fechaIni}','${fechaFin}',${tipoAvaluo},'${solicitante}',${estatus});`;

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
                    logger.error(etiquetaLOG + 'ERROR: ' + err.message + ' CODIGO_BD(' + err.code + ')');
                    reject(`Se presentó un error en fConsultaFolios: ${err}`);
                })
        })

    } catch (err) {
        logger.error(`${ ruta } ERROR: ${ err } `);
        throw (`Se presentó un error en BdFiltarAvaluos: ${err}`);
    }
}
/**************   Listas filtro   ******************************************/
function BdListaFiltroAvaluos(catalogo, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdListaFiltroAvaluos `;
    try {

        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fCatFiltroAvaluos ('${catalogo}');`;

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
                    logger.error(etiquetaLOG + 'ERROR: ' + err.message + ' CODIGO_BD(' + err.code + ')');
                    reject(`Se presentó un error en fCatFiltroAvaluos: ${err}`);
                })
        })

    } catch (err) {
        logger.error(`${ ruta } ERROR: ${ err } `);
        throw (`Se presentó un error en BdListaFiltroAvaluos: ${err}`);
    }
}
/**************   Consulta   ******************************************/
function BdConsultarAvaluos(usuario) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ usuario }] METODO: BdConsultarAvaluos `;
    try {

        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultaAvaluos (${usuario});`;

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
                    logger.error(etiquetaLOG + 'ERROR: ' + err.message + ' CODIGO_BD(' + err.code + ')');
                    reject(`Se presentó un error en fConsultaAvaluos: ${err}`);
                })
        })

    } catch (err) {
        logger.error(`${ ruta } ERROR: ${ err } `);
        throw (`Se presentó un error en BdConsultarAvaluos: ${err}`);
    }
}

/**************  Consulta Avance Avaluo    ******************************************/
function BdConsultaAvanceAvaluo(pFolio, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdConsultaAvanceAvaluo `;
    try {

        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultaAvanceAvaluo ('${pFolio}');`;

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
                    logger.error(etiquetaLOG + 'ERROR: ' + err.message + ' CODIGO_BD(' + err.code + ')');
                    reject(`Se presentó un error en fConsultaAvanceAvaluo: ${err}`);
                })
        })

    } catch (err) {
        logger.error(`${ ruta } ERROR: ${ err } `);
        throw (`Se presentó un error en BdConsultaAvanceAvaluo: ${err}`);
    }
}

module.exports = app;