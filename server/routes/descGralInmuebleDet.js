const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

const { Pool } = require('pg');

const logger = require('../config/log');
const validar = require('../utilerias/generales');

const ruta = ' [descGralInmuebleDet.js] ';
//--------------------------------------------------------------------------/
//   DescGeneralInmueble Información general
//--------------------------------------------------------------------------/

/****************************************************************************
 * Registro
 ****************************************************************************/
app.post('/descGeneralInmueble', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: DescGeneralInmueble';

        logger.info(etiquetaLOG);

        let body = req.body;

        let pFolio = body.Folio;

        let pUsoActual = body.UsoActual;
        let pNumeroNiveles = body.NumeroNiveles;
        let pEstadoConservacion = body.EstadoConservacion;
        let pCalidadProyecto = body.CalidadProyecto;
        let pUnidadesRentableSuscep = body.UnidadesRentableSuscep;
        let pPorcSuperfUltRespecAnt = body.PorcSuperfUltRespecAnt;
        let pIdIndiceSatZonaAvanceObra = body.AvanceObra;
        let pImportTotValorCatastralF = body.ImportTotValorCatastralF;

        let pUsuarioOperacion = req.usuario.idUsuario;

        let datoNoValido = '';

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA -->  ${pFolio}, ${pUsoActual}, ${pNumeroNiveles}, ${pEstadoConservacion}, ${pCalidadProyecto}, ${pUnidadesRentableSuscep}, ${pPorcSuperfUltRespecAnt}, ${pIdIndiceSatZonaAvanceObra}, ${pImportTotValorCatastralF}, ${pUsuarioOperacion}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Uso Actual', pUsoActual);

        datoNoValido = datoNoValido + validar.datoValido(false, 'N', 'Número Niveles', pNumeroNiveles);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Estado Conservación', pEstadoConservacion);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Calidad Proyecto', pCalidadProyecto);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Unidades Rentables', pUnidadesRentableSuscep);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Porcentaje Superficie', pPorcSuperfUltRespecAnt);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Avance Obra', pIdIndiceSatZonaAvanceObra);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Usuario', pUsuarioOperacion);

        console.log('pNumeroNiveles');
        console.log(pNumeroNiveles);
        if (datoNoValido == '') {

            BdDescGeneralInmueble(
                    '\'' + pFolio.trim() + '\'',
                    '\'' + pUsoActual.trim() + '\'',
                    (pNumeroNiveles == undefined) ? null : pNumeroNiveles,

                    (pEstadoConservacion == undefined) ? null : '\'' + pEstadoConservacion.trim() + '\'',
                    (pCalidadProyecto == undefined) ? null : '\'' + pCalidadProyecto.trim() + '\'',
                    (pUnidadesRentableSuscep == undefined) ? null : '\'' + pUnidadesRentableSuscep.trim() + '\'',

                    pPorcSuperfUltRespecAnt,
                    pIdIndiceSatZonaAvanceObra,

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
app.get('/consultaDescGeneralInmueble', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaDescGeneralInmueble';
        logger.info(etiquetaLOG);

        let pFolio = req.query.Folio;
        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let numReg = 0;
        let resultadoDat;

        let datoNoValido = '';
        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pFolio}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);

        if (datoNoValido == '') {
            BdConsultaDescGeneralInmueble(pFolio.trim(), pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;
                    resultadoDat = result;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el folio indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    if (numReg > 0) {
                        var elemRes = {
                            usoActual: resultadoDat[0].usoactual,
                            numeroNiveles: resultadoDat[0].numeroniveles,
                            estadoConservacion: resultadoDat[0].estadoconservacion,
                            calidadProyecto: resultadoDat[0].calidadproyecto,
                            unidadesRentableSuscep: resultadoDat[0].unidadesrentablesuscep,
                            porcSuperfUltRespecAnt: resultadoDat[0].porcsuperfultrespecant,
                            AvanceObra: resultadoDat[0].idindicesatzonaavanceobra,
                            importTotValorCatastralF: resultadoDat[0].importtotvalorcatastralf

                        }
                    }

                    res.json({
                        ok: (numReg > 0) ? true : false,
                        mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información',
                        descripcionGral: (numReg > 0) ? elemRes : [],
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
function BdDescGeneralInmueble(pFolio, pUsoActual, pNumeroNiveles, pEstadoConservacion,
    pCalidadProyecto, pUnidadesRentableSuscep, pPorcSuperfUltRespecAnt,
    pIdIndiceSatZonaAvanceObra, pUsuarioOperacion) {

    let etiquetaLOG = ruta + '[Usuario: ' + pUsuarioOperacion + '] METODO: BdDescGeneralInmueble ';

    try {
        logger.info(etiquetaLOG);

        const client = new Pool(configD);

        logger.info(etiquetaLOG + 'SELECT * FROM fDescGeneralInmueble (pFolio, pUsoActual, pNumeroNiveles, pEstadoConservacion, pCalidadProyecto, pUnidadesRentableSuscep, pPorcSuperfUltRespecAnt, pIdIndiceSatZonaAvanceObra, pUsuarioOperacion);');
        let sQuery = `SELECT * FROM fDescGeneralInmueble (${pFolio}, ${pUsoActual}, (${pNumeroNiveles}::smallint), ${pEstadoConservacion}, ${pCalidadProyecto}, ${pUnidadesRentableSuscep}, (${pPorcSuperfUltRespecAnt}::decimal), (${pIdIndiceSatZonaAvanceObra}::smallint), ${pUsuarioOperacion});`;

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
        throw (`Se presentó un error en BdDescGeneralInmueble: ${err}`);
    }
}
/**************   C o n s u l t a   ******************************************/
function BdConsultaDescGeneralInmueble(pFolio, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta } [Usuario: ${ pUsuarioOperacion }] METODO: BdConsultaDescGeneralInmueble `;
    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultaDescGeneralInmueble('${pFolio}');`;

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
        throw (`Se presentó un error en BdConsultaDescGeneralInmueble: ${err}`);
    }
}

module.exports = app;