const express = require('express');
const jwt = require('jsonwebtoken');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

const { Pool } = require('pg');

const http = require('http');

const logger = require('../config/log');
const validar = require('../utilerias/generales');
const ruta = ' [avaluo.js] ';

/****************************************************************************/
// Peritos por sociedad ACTIVOS
/****************************************************************************/
app.get('/listaPeritosSociedad', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: listaPeritosSociedad';
        logger.info(etiquetaLOG);

        let pIdSociedad = req.query.IdSociedad;
        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let numReg = 0;

        if (pIdSociedad == undefined || pIdSociedad == '' || pIdSociedad == 0) { pIdSociedad = null; }


        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pIdSociedad}`);

        BdConsultaPerito(0, pIdSociedad, '', true, '', pUsuarioOperacion)
            .then(result => {
                numReg = result.length;

                logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                res.json({
                    ok: (numReg > 0) ? true : false,
                    mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información',
                    peritos: (numReg > 0) ? result : [],
                    codigo: (numReg > 0) ? codRespuesta.exito : codRespuesta.noDatos
                });

            }, (err) => {
                logger.info(`${etiquetaLOG} RESPUESTA: ok = false, mensaje = ${err}`);
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
 * Registro Avaluo
 ****************************************************************************/
app.post('/registroAvaluo', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: registroAvaluo';
        logger.info(etiquetaLOG);

        let body = req.body;

        let pOperacion = 'I';
        let pFolio = body.Folio;
        let pIdTipoAvaluo = body.Tipo;
        let pFechaAvaluo = body.Fecha;
        let pIdSociedad = body.Sociedad;
        let pIdPerito = body.Perito;
        let pIdEstatusAvaluo = 0;

        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pOperacion}, ${pFolio},  ${pIdTipoAvaluo}, ${pFechaAvaluo}, ${pIdSociedad}, ${pIdPerito}, ${pIdEstatusAvaluo}, ${pUsuarioOperacion}`);

        BdAvaluo(pOperacion, pFolio, pIdTipoAvaluo, pFechaAvaluo, pIdSociedad, pIdPerito, pIdEstatusAvaluo, pUsuarioOperacion)
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
 * Lista Sociedad
 ****************************************************************************/
app.get('/consultaSociedad', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaSociedad';
        logger.info(etiquetaLOG);

        let pIdSociedad = req.query.Sociedad;
        let pNombre = req.query.Nombre;
        let pEstatus = req.query.Estatus;

        let numReg = 0;

        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        if (pIdSociedad == undefined &
            pNombre == undefined &
            pEstatus == undefined) {
            res.json({
                ok: false,
                mensaje: 'No se han indicado parámetros válidos'
            });
        } else {

            if (pIdSociedad == undefined) { pIdSociedad = 0; }
            if (pNombre == undefined) { pNombre = ''; }
            if (pEstatus == 0) { pEstatus = false; }
            if (pEstatus == 1) { pEstatus = true; }
            // Si el Estatus no está definido entonces se indica null
            if (pEstatus == undefined || pEstatus == '') { pEstatus = null; }

            logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pIdSociedad}, ${pNombre}, ${pEstatus}`);

            BdConsultaSociedad(pIdSociedad, pNombre, pEstatus, pUsuarioOperacion)
                .then(result => {
                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el filtro indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);
                    numReg = result.length;

                    res.json({
                        ok: (numReg > 0) ? true : false,
                        mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información con el filtro indicado',
                        sociedades: (numReg > 0) ? result : [],
                        codigo: (numReg > 0) ? codRespuesta.exito : codRespuesta.noDatos
                    });


                }, (err) => {
                    logger.info(`${etiquetaLOG} RESPUESTA: ok = false, mensaje = ${err}`);
                    res.json({
                        ok: false,
                        mensaje: err,
                        codigo: codRespuesta.error
                    });

                })

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
 * Lista Perito
 ****************************************************************************/
// Peritos activos independientes
app.get('/consultaPeritosInd', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaPeritosInd';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let pIdPerito = req.query.Perito;
        let pIdSociedad = req.query.Sociedad;
        let pNombre = req.query.Nombre;
        let pEstatus = req.query.Estatus;
        let pEspecialidad = req.query.Especialidad;

        let numReg = 0;

        if (pIdPerito == undefined &
            pIdSociedad == undefined &
            pNombre == undefined &
            pEstatus == undefined &
            pEspecialidad == undefined) {
            res.json({
                ok: false,
                mensaje: 'No se han indicado parámetros válidos'
            });
        } else {
            if (pIdPerito == undefined || pIdPerito == '') { pIdPerito = 0; }
            if (pIdSociedad == undefined || pIdSociedad == '') { pIdSociedad = 0; }
            if (pNombre == undefined) { pNombre = ''; }
            if (pEstatus == 0) { pEstatus = false; }
            if (pEstatus == 1) { pEstatus = true; }
            // Si el Estatus no está definido entonces se indica null
            if (pEstatus == undefined || pEstatus == '') { pEstatus = null; }

            if (pEspecialidad == undefined) { pEspecialidad = ''; }

            logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pIdPerito}, ${pIdSociedad}, ${pNombre}, ${pEstatus}, ${pEspecialidad}`);
            BdConsultaPerito(pIdPerito, pIdSociedad, pNombre, pEstatus, pEspecialidad, pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el filtro indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    res.json({
                        ok: (numReg > 0) ? true : false,
                        mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información con el filtro indicado',
                        peritos: (numReg > 0) ? result : [],
                        codigo: (numReg > 0) ? codRespuesta.exito : codRespuesta.noDatos
                    });

                }, (err) => {
                    logger.info(`${etiquetaLOG} RESPUESTA: ok = false, mensaje = ${err}`);
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
 * Consulta Perito
 ****************************************************************************/

app.get('/consultaPerito', verificaToken, (req, res) => {

    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaPerito';
        logger.info(etiquetaLOG);
        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let pIdPerito = req.query.Perito;
        let pIdSociedad = req.query.Sociedad;
        let pNombre = req.query.Nombre;
        let pEstatus = req.query.Estatus;
        let pEspecialidad = req.query.Especialidad;

        let numReg = 0;
        let resultado = false;

        let resultadoDat;

        if (pIdPerito == undefined &
            pIdSociedad == undefined &
            pNombre == undefined &
            pEstatus == undefined &
            pEspecialidad == undefined) {
            res.json({
                ok: false,
                mensaje: 'No se han indicado parámetros válidos'
            });
        } else {
            if (pIdPerito == undefined || pIdPerito == '') { pIdPerito = 0; }
            if (pIdSociedad == undefined || pIdSociedad == '') { pIdSociedad = 0; }
            if (pNombre == undefined) { pNombre = ''; }
            if (pEstatus == 0) { pEstatus = false; }
            if (pEstatus == 1) { pEstatus = true; }
            // Si el Estatus no está definido entonces se indica null
            if (pEstatus == undefined || pEstatus == '') { pEstatus = null; }

            if (pEspecialidad == undefined) { pEspecialidad = ''; }

            logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pIdPerito}, ${pIdSociedad}, ${pNombre}, ${pEstatus}, ${pEspecialidad}`);

            BdConsultaPerito(pIdPerito, pIdSociedad, pNombre, pEstatus, pEspecialidad, pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el filtro indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    res.json({
                        ok: (numReg > 0) ? true : false,
                        mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información con el filtro indicado',
                        peritos: (numReg > 0) ? result : [],
                        codigo: (numReg > 0) ? codRespuesta.exito : codRespuesta.noDatos
                    });

                }, (err) => {
                    logger.info(`${etiquetaLOG} RESPUESTA: ok = false, mensaje = ${err}`);
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
/***    L L A M A D O S   A    B A S E     D E    D A T O S    **************
/****************************************************************************/
/********************  A V A L U O   **********************************/
function BdAvaluo(pOperacion, pFolio, pIdTipoAvaluo, pFechaAvaluo, pIdSociedad, pIdPerito, pIdEstatusAvaluo, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdAvaluo `;
    try {
        logger.info(etiquetaLOG);

        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fAvaluo ('${pOperacion}','${pFolio}',${pIdTipoAvaluo},'${pFechaAvaluo}',${pIdSociedad},${pIdPerito},${pIdEstatusAvaluo},${pUsuarioOperacion});`;

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
                    logger.info(etiquetaLOG + 'ERROR: ' + err.message + ' CODIGO_BD(' + err.code + ')');
                    reject(err.message + ' CODIGO_BD(' + err.code + ')');
                })
        });
    } catch (err) {
        logger.error(`${ ruta } ERROR: ${ err } `);
        throw (`Se presentó un error en BdAvaluo: ${err}`);
    }
}
/**************  S O C I E D A D  *******************************************/
function BdConsultaSociedad(pIdSociedad, pNombre, pEstatus, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdConsultaSociedad `;
    try {
        logger.info(etiquetaLOG);

        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultaSociedad (${pIdSociedad},'${pNombre}',${pEstatus});`;

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
                    logger.info(etiquetaLOG + 'ERROR: ' + err.message + ' CODIGO_BD(' + err.code + ')');
                    reject(err.message + ' CODIGO_BD(' + err.code + ')');
                })
        })
    } catch (err) {
        logger.error(`${ ruta } ERROR: ${ err } `);
        throw (`Se presentó un error en BdConsultaSociedad: ${err}`);
    }
}
/**************  P E R I T O  *******************************************/
function BdConsultaPerito(pIdPerito, pIdSociedad, pNombre, pEstatus, pEspecialidad, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdConsultaPerito `;
    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultaPeritos (${pIdPerito},${pIdSociedad},'${pNombre}',${pEstatus},'${pEspecialidad}');`;

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
                    logger.info(etiquetaLOG + 'ERROR: ' + err.message + ' CODIGO_BD(' + err.code + ')');
                    reject(err.message + ' CODIGO_BD(' + err.code + ')');
                })
        });
    } catch (err) {
        logger.error(`${ ruta } ERROR: ${ err } `);
        throw (`Se presentó un error en BdConsultaSociedad: ${err}`);
    }
}
module.exports = app;