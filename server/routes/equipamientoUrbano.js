const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

const { Pool } = require('pg');

const logger = require('../config/log');
const validar = require('../utilerias/generales');
const ruta = ' [equipamientoUrbano.js] ';
//--------------------------------------------------------------------------/
//   Equipamiento Urbano 
//--------------------------------------------------------------------------/

/****************************************************************************
 * Listas para el módulo Equipamiento Urbano
 ****************************************************************************/
app.get('/listaEquipamientoUrbano', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: listaEquipamientoUrbano';
        logger.info(etiquetaLOG);

        let pCatalogo = req.query.Catalogo;
        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let numReg = 0;

        let datoNoValido = '';
        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pCatalogo}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Catalogo', pCatalogo);

        if (datoNoValido == '') {

            BdListaEquipamientoUrbano(pCatalogo, pUsuarioOperacion)
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
 * Registro
 ****************************************************************************/
app.post('/equipaUrbano', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: equipaUrbano';

        logger.info(etiquetaLOG);

        let body = req.body;

        let pFolio = body.Folio;

        pIdSuministroTelefonico =  body.IdSuministroTelefonico;
        pIdAcometidaInmueble =  body.IdAcometidaInmueble;
        pIdSenalizacionVias =  body.IdSenalizacionVias;
        pIdNomenclaturaCalle =  body.IdNomenclaturaCalle;

        pDistanciaTranporteUrbano =  body.DistanciaTransporteUrbano;
        pFrecuenciaTransporteUrbano =  body.FrecuenciaTransporteUrbano;
        pDistanciaTransporteSuburbano =  body.DistanciaTransporteSuburbano;
        pFrecuenciaTransporteSuburbano =  body.FrecuenciaTransporteSuburbano;

        pIdRecoleccionBasura =  body.IdRecoleccionBasura;
        pTemplo =  body.Templo;
        pMercados =  body.Mercados;
        pPlazasPublicas =  body.PlazasPublicas;
        pParquesJardines =  body.ParquesJardines;
        pEscuelas =  body.Escuelas;
        pHospitales =  body.Hospitales;
        pBancos =  body.Bancos;
        pEstacionTransporte =  body.EstacionTransporte;

        let pUsuarioOperacion = req.usuario.idUsuario;

        let datoNoValido = '';

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA -->  ${pFolio}, ${pIdSuministroTelefonico}, ${pIdAcometidaInmueble}, ${pIdSenalizacionVias}, ${pIdNomenclaturaCalle}, ${pDistanciaTranporteUrbano}, ${pFrecuenciaTransporteUrbano}, ${pDistanciaTransporteSuburbano}, ${pFrecuenciaTransporteSuburbano}, ${pIdRecoleccionBasura}, ${pTemplo}, ${pMercados}, ${pPlazasPublicas}, ${pParquesJardines}, ${pEscuelas}, ${pHospitales}, ${pBancos}, ${pEstacionTransporte}, ${pUsuarioOperacion}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);

        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'N', 'Id Suministro Telefonico ', pIdSuministroTelefonico);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'N', 'Id Acometida Inmueble', pIdAcometidaInmueble);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'N', 'Id Senalizacion Vias ', pIdSenalizacionVias);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'N', 'Id Nomenclatura Calle', pIdNomenclaturaCalle);
        //  Decimal
        datoNoValido  =  datoNoValido  +  validar.datoValido(false, 'N', 'Distancia Tranporte Urbano', pDistanciaTranporteUrbano);
        datoNoValido  =  datoNoValido  +  validar.datoValido(false, 'N', 'Frecuencia Transporte Urbano', pFrecuenciaTransporteUrbano);
        datoNoValido  =  datoNoValido  +  validar.datoValido(false, 'N', 'Distancia Transporte Suburbano', pDistanciaTransporteSuburbano);
        datoNoValido  =  datoNoValido  +  validar.datoValido(false, 'N', 'Frecuencia Transporte Suburbano', pFrecuenciaTransporteSuburbano);
        // Smallint
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'N', 'Id Recoleccion Basura', pIdRecoleccionBasura);
        // Boolean
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'B', 'Templo', pTemplo);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'B', 'Mercados', pMercados);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'B', 'Plazas Publicas', pPlazasPublicas);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'B', 'Parques Jardines', pParquesJardines);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'B', 'Escuelas', pEscuelas);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'B', 'Hospitales', pHospitales);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'B', 'Bancos', pBancos);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'B', 'Estacion Transporte', pEstacionTransporte);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Usuario', pUsuarioOperacion);

        if (datoNoValido == '') {

            BdEquipamientoUrbano(

                    pFolio.trim(),

                    pIdSuministroTelefonico,
                    pIdAcometidaInmueble,
                    pIdSenalizacionVias,
                    pIdNomenclaturaCalle,

                    (pDistanciaTranporteUrbano == 'NULL' || pDistanciaTranporteUrbano == 'null' || pDistanciaTranporteUrbano == '') ? null : pDistanciaTranporteUrbano,
                    (pFrecuenciaTransporteUrbano == 'NULL' || pFrecuenciaTransporteUrbano == 'null' || pFrecuenciaTransporteUrbano == '') ? null : pFrecuenciaTransporteUrbano,
                    (pDistanciaTransporteSuburbano == 'NULL' || pDistanciaTransporteSuburbano == 'null' || pDistanciaTransporteSuburbano == '') ? null : pDistanciaTransporteSuburbano,
                    (pFrecuenciaTransporteSuburbano == 'NULL' || pFrecuenciaTransporteSuburbano == 'null' || pFrecuenciaTransporteSuburbano == '') ? null : pFrecuenciaTransporteSuburbano,

                    pIdRecoleccionBasura,
                    pTemplo,
                    pMercados,
                    pPlazasPublicas,
                    pParquesJardines,
                    pEscuelas,
                    pHospitales,
                    pBancos,
                    pEstacionTransporte,

                    pUsuarioOperacion

                )
                .then(result => {

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${JSON.stringify(result[0].resultado)}, mensaje = ${JSON.stringify(result[0].mensaje)}, codigo = ${(result[0].resultado) ? codRespuesta.exito : codRespuesta.error}`);
                    res.json({
                        ok: result[0].resultado,
                        mensaje: result[0].mensaje,
                        nivelEquipamientoF: result[0].nivelequipamientof,
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
app.get('/consultaEquipamientoUrbano', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaEquipamientoUrbano';
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
            BdConsultaEquipamientoUrbano(pFolio.trim(), pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;
                    resultadoDat = result;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el folio indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    if (numReg > 0) {
                        var elemRes = {

                            idSuministroTelefonico: resultadoDat[0].idsuministrotelefonico,
                            idAcometidaInmueble: resultadoDat[0].idacometidainmueble,
                            idSenalizacionVias: resultadoDat[0].idsenalizacionvias,
                            idNomenclaturaCalle: resultadoDat[0].idnomenclaturacalle,
                            distanciaTranporteUrbano: resultadoDat[0].distanciatranporteurbano,
                            frecuenciaTransporteUrbano: resultadoDat[0].frecuenciatransporteurbano,
                            distanciaTransporteSuburbano: resultadoDat[0].distanciatransportesuburbano,
                            frecuenciaTransporteSuburbano: resultadoDat[0].frecuenciatransportesuburbano,
                            idRecoleccionBasura: resultadoDat[0].idrecoleccionbasura,
                            templo: resultadoDat[0].templo,
                            mercados: resultadoDat[0].mercados,
                            plazasPublicas: resultadoDat[0].plazaspublicas,
                            parquesJardines: resultadoDat[0].parquesjardines,
                            escuelas: resultadoDat[0].escuelas,
                            hospitales: resultadoDat[0].hospitales,
                            bancos: resultadoDat[0].bancos,
                            estacionTransporte: resultadoDat[0].estaciontransporte,
                            nivelEquipamientoF: resultadoDat[0].nivelequipamientof
                        }
                    }

                    res.json({
                        ok: (numReg > 0) ? true : false,
                        mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información',
                        equipamientoUrbano: (numReg > 0) ? elemRes : [],
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
/**************   Llenado de combos   ******************************************/
function BdListaEquipamientoUrbano(pCatalogo, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdListaEquipamientoUrbano `;
    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fCatEquipamientoUrbano('${pCatalogo}');`;

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
        throw (`Se presentó un error en BdListaEquipamientoUrbano: ${err}`);
    }
}

/**************   R e g i s t r o   ******************************************/
function BdEquipamientoUrbano(pFolio,
    pIdSuministroTelefonico, pIdAcometidaInmueble, pIdSenalizacionVias, pIdNomenclaturaCalle, pDistanciaTranporteUrbano,
    pFrecuenciaTransporteUrbano, pDistanciaTransporteSuburbano, pFrecuenciaTransporteSuburbano,
    pIdRecoleccionBasura,
    pTemplo, pMercados, pPlazasPublicas, pParquesJardines, pEscuelas, pHospitales, pBancos, pEstacionTransporte,
    pUsuarioOperacion) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdEquipamientoUrbano `;

    try {
        logger.info(etiquetaLOG);

        const client = new Pool(configD);

        logger.info(etiquetaLOG + 'SELECT * FROM fEquipamientoUrbano(pFolio, pIdSuministroTelefonico, pIdAcometidaInmueble, pIdSenalizacionVias, pIdNomenclaturaCalle, pDistanciaTranporteUrbano, pFrecuenciaTransporteUrbano, pDistanciaTransporteSuburbano, pFrecuenciaTransporteSuburbano, pIdRecoleccionBasura, pTemplo, pMercados, pPlazasPublicas, pParquesJardines, pEscuelas, pHospitales, pBancos, pEstacionTransporte, pUsuarioOperacion);');

        let sQuery = 'SELECT * FROM fEquipamientoUrbano( \'' + pFolio + '\', ' +

            '(' + pIdSuministroTelefonico + '::smallint),' +
            '(' + pIdAcometidaInmueble + '::smallint),' +
            '(' + pIdSenalizacionVias + '::smallint),' +
            '(' + pIdNomenclaturaCalle + '::smallint),' +

            '(' + pDistanciaTranporteUrbano + '::decimal),' +
            '(' + pFrecuenciaTransporteUrbano + '::decimal),' +
            '(' + pDistanciaTransporteSuburbano + '::decimal),' +
            '(' + pFrecuenciaTransporteSuburbano + '::decimal),' +

            '(' + pIdRecoleccionBasura + '::smallint),' +

            pTemplo + ',' +
            pMercados + ',' +
            pPlazasPublicas + ',' +
            pParquesJardines + ',' +
            pEscuelas + ',' +
            pHospitales + ',' +
            pBancos + ',' +
            pEstacionTransporte + ',' +

            pUsuarioOperacion + ');';

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
        throw (`Se presentó un error en BdEquipamientoUrbano: ${err}`);
    }
}

/**************   C o n s u l t a   ******************************************/
function BdConsultaEquipamientoUrbano(pFolio, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdConsultaEquipamientoUrbano `;
    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultaEquipamientoUrbano('${pFolio}');`;

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
        throw (`Se presentó un error en BdConsultaEquipamientoUrbano: ${err}`);
    }
}

module.exports = app;