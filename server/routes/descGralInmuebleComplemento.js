const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

const { Pool } = require('pg');

const logger = require('../config/log');
const validar = require('../utilerias/generales');

const ruta = ' [descGralInmuebleComplemento.js] ';
//--------------------------------------------------------------------------/
//   DescGeneralInmueble complemento de la tabla de construcción
//--------------------------------------------------------------------------/

/****************************************************************************
 * Registro
 ****************************************************************************/
app.post('/descGeneralInmuebleComple', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: descGeneralInmuebleComple';

        logger.info(etiquetaLOG);

        let body = req.body;

        let pIdInmConstruccion = body.IdInmConstruccion;
        let pValorUniRepoNuevo = body.ValorUniRepoNuevo;
        let pLosaConcreto = body.LosaConcreto;

        let pUsuarioOperacion = req.usuario.idUsuario;

        let datoNoValido = '';

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA -->  ${pIdInmConstruccion}, ${pValorUniRepoNuevo}, ${pLosaConcreto}, ${pUsuarioOperacion}`);

        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'N', 'Id Inmueble Construccion',  pIdInmConstruccion);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Valor Unitario Reposición Nuevo', pValorUniRepoNuevo);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Uso Actual', pLosaConcreto);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Usuario', pUsuarioOperacion);

        if (datoNoValido == '') {
            if (pLosaConcreto != undefined) {
                if (pLosaConcreto.length > 1) {
                    pLosaConcreto = null;
                }

            } else
                pLosaConcreto = null;

            BdDescGeneralInmuebleComple( 
                    pIdInmConstruccion,
                    pValorUniRepoNuevo,
                    (pLosaConcreto == null) ? pLosaConcreto : '\'' + pLosaConcreto + '\'',

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
app.get('/consultaDescGeneralInmuebleComple', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaDescGeneralInmuebleComple';
        logger.info(etiquetaLOG);

        let pFolio = req.query.Folio;
        let pTipoConstruccion = req.query.TipoConstruccion;
        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let numReg = 0;
        let resultadoDat;
        let tablaResultado = [];

        let edadPonderada = 0;
        let vidaUtilPonderada = 0;
        let vidaUtilPonderadaRema = 0;


        let datoNoValido = '';
        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pFolio}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Tipo Construcción', pTipoConstruccion);

        if (datoNoValido == '') {
            BdConsultaDescGeneralInmuebleComple(pFolio.trim(), pTipoConstruccion, pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;
                    resultadoDat = result;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el folio indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    if (numReg > 0) {

                        edadPonderada = resultadoDat[0].edadponderada;
                        vidaUtilPonderada = resultadoDat[0].vidautilponderada;
                        vidaUtilPonderadaRema = resultadoDat[0].vidautilponderadarema;


                        for (var i = 0, l = numReg; i < l; i++) {
                            var elemRes = {
                                idInmConstruccion: resultadoDat[i].idinmconstruccion,
                                tipoConstruccion: resultadoDat[i].tipoconstruccion,
                                idUsoConstruccion: resultadoDat[i].idusoconstruccion,
                                idRangoNivelTGDF: resultadoDat[i].idrangoniveltgdf,
                                claseF: resultadoDat[i].clasef,
                                clasifica1F: resultadoDat[i].clasifica1f,
                                clasifica2F: resultadoDat[i].clasifica2f,
                                clasifica3F: resultadoDat[i].clasifica3f,
                                edadF: resultadoDat[i].edadf,
                                conservaEdoCve: resultadoDat[i].conservaedocve,
                                conservaEdoDesc: resultadoDat[i].conservaedodesc,
                                conservaEdoFact: resultadoDat[i].conservaedofact,
                                vp: resultadoDat[i].vp,
                                fedICRRedF: resultadoDat[i].fedicrredf,
                                fedICRNoRedF: resultadoDat[i].fedicrnoredf,
                                vurF: resultadoDat[i].vurf,
                                depEdadF: resultadoDat[i].depedadf,
                                vucCatastralF: resultadoDat[i].vuccatastralf,
                                valorUniRepoNuevo: resultadoDat[i].valorunireponuevo,
                                losaConcreto: resultadoDat[i].losaconcreto,

                            }
                            tablaResultado.push(elemRes);
                        }
                    }

                    res.json({
                        ok: (numReg > 0) ? true : false,
                        mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información',
                        edadPonderada,
                        vidaUtilPonderada,
                        vidaUtilPonderadaRema,
                        descripcionGralComple: (numReg > 0) ? tablaResultado : [],
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
/***************************************************************************/
/********************   R e g i s t r o   **********************************/
function BdDescGeneralInmuebleComple(pIdInmConstruccion, pValorUniRepoNuevo, pLosaConcreto,
    pUsuarioOperacion) {

    let etiquetaLOG = ruta + '[Usuario: ' + pUsuarioOperacion + '] METODO: BdDescGeneralInmuebleComple ';

    try {
        logger.info(etiquetaLOG);

        const client = new Pool(configD);

        logger.info(etiquetaLOG + 'SELECT * FROM fInmConstrucComplemento (pIdInmConstruccion, pValorUniRepoNuevo, pLosaConcreto, pUsuarioOperacion);');
        let sQuery = `SELECT * FROM fInmConstrucComplemento (${pIdInmConstruccion}, (${pValorUniRepoNuevo}::decimal), (${pLosaConcreto}::char), ${pUsuarioOperacion});`;

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
        throw (`Se presentó un error en BdDescGeneralInmuebleComple: ${err}`);
    }
}
/**************   C o n s u l t a   ******************************************/
function BdConsultaDescGeneralInmuebleComple(pFolio, pTipoConstruccion, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta } [Usuario: ${ pUsuarioOperacion }] METODO: BdConsultaDescGeneralInmuebleComple `;
    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultaInmConstrucComplemento('${pFolio}','${pTipoConstruccion}');`;

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
        throw (`Se presentó un error en BdConsultaDescGeneralInmuebleComple: ${err}`);
    }
}

module.exports = app;