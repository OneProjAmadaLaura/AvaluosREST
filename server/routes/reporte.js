const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

const { Pool } = require('pg');

const logger = require('../config/log');
const validar = require('../utilerias/generales');
const { exceptions } = require('../config/log');
const ruta = ' [reporte.js] ';
//--------------------------------------------------------------------------/
//   Reportes
//--------------------------------------------------------------------------/
/****************************************************************************
 * Seguimiento
 ****************************************************************************/
app.get('/reporteSeguimiento', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: reporteSeguimiento';
        logger.info(etiquetaLOG);

        // Del token
        let pIdRol = req.usuario.idRol;
        let pIdSociedad = req.usuario.idSociedad;
        let pIdPerito = req.usuario.idPerito;
        let pUsuarioOperacion = req.usuario.idUsuario;
        let pUsuario = req.usuario.usuario;

        let numReg = 0;
        let resultadoDat;
        let tablaResultado = [];

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pUsuario}`);

        BdReporteSeguimiento(pIdPerito, pIdRol, pIdSociedad, pUsuarioOperacion)
            .then(result => {
                numReg = result.length;
                resultadoDat = result;

                logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el folio indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                if (numReg > 0) {

                    for (var i = 0, l = numReg; i < l; i++) {
                        var elemRes = {

                            idSociedad: resultadoDat[i].idsociedad,
                            sociedad: resultadoDat[i].sociedad,
                            idPerito: resultadoDat[i].idperito,
                            perito: resultadoDat[i].perito,
                            idTipoAvaluo: resultadoDat[i].idtipoavaluo,
                            tipoAvaluo: resultadoDat[i].tipoavaluo,
                            idEstatusAvaluo: resultadoDat[i].idestatusavaluo,
                            estatusAvaluo: resultadoDat[i].estatusavaluo,
                            registros: resultadoDat[i].registros
                        }
                        tablaResultado.push(elemRes);
                    }

                }

                res.json({
                    ok: (numReg > 0) ? true : false,
                    mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información',
                    inmuebleConstrucciones: (numReg > 0) ? tablaResultado : [],
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
/***    L L A M A D O S   A    B A S E     D E    D A T O S    **************
/****************************************************************************/
/**************   C o n s u l t a  Edición  ******************************************/
function BdReporteSeguimiento(pIdPerito, pIdRol, pIdSociedad, pUsuarioOperacion) {
    let etiquetaLOG = ruta + '[Usuario: ' + pUsuarioOperacion + '] METODO: BdReporteSeguimiento ';

    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultaSeguimiento (${pIdPerito}, ${pIdRol}, ${pIdSociedad});`;

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
        throw (`Se presentó un error en BdReporteSeguimiento: ${err}`);
    }
}

module.exports = app;