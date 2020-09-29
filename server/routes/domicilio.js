const express = require('express');
const jwt = require('jsonwebtoken');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

const { Pool } = require('pg');

const http = require('http');

const logger = require('../config/log');

const ruta = ' [domicilio.js] ';
//--------------------------------------------------------------------------/
//   Domicilio
//--------------------------------------------------------------------------/

/****************************************************************************
 * CP
 ****************************************************************************/
app.get('/consultaCP', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaCP';
        logger.info(etiquetaLOG);

        let pCP = req.query.CP;
        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let numReg = 0;
        let resultadoDat;
        let asentamientos = [];

        let datoNoValido = '';
        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pCP}`);

        if (pCP == undefined || pCP == '') {
            datoNoValido = 'CP';
        } else if (pCP.trim() == '') {
            datoNoValido = 'CP';
        }

        if (datoNoValido == '') {
            BdConsultaCP(pCP.trim(), pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;
                    resultadoDat = result;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    for (var i = 0, l = resultadoDat.length; i < l; i++) {
                        var elemento = {
                            idasentamiento: resultadoDat[i].idasentamiento,
                            asentamiento: resultadoDat[i].asentamiento
                        }
                        asentamientos.push(elemento);
                    }

                    if (numReg > 0) {
                        var elemRes = {
                            identidad: resultadoDat[0].identidad,
                            entidad: resultadoDat[0].entidad,
                            idmunicipio: resultadoDat[0].idmunicipio,
                            municipio: resultadoDat[0].municipio,
                            listaasentamientos: asentamientos
                        }
                    }

                    res.json({
                        ok: (numReg > 0) ? true : false,
                        mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información',
                        datosCP: (numReg > 0) ? elemRes : [],
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
            logger.error(etiquetaLOG + ' ERROR: La ' + datoNoValido + ' indicada no es válida');
            res.json({
                ok: false,
                mensaje: 'La ' + datoNoValido + ' indicada no es válida',
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

/**************   C o n s u l t a    (Municipio)   ******************/

function BdConsultaCP(pCP, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdConsultaCP `;
    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultaCP('${pCP}');`;

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
        throw (`Se presentó un error en BdConsultaCP: ${err}`);
    }
}

module.exports = app;