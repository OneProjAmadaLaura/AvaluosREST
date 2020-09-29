const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

const { Pool } = require('pg');

const logger = require('../config/log');
const validar = require('../utilerias/generales');
const ruta = ' [inmueble.js] ';
//--------------------------------------------------------------------------/
//   Inmueble
//--------------------------------------------------------------------------/

/****************************************************************************
 * Listas para el módulo Inmueble 
 ****************************************************************************/
app.get('/listaInmueble', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: listaInmueble';
        logger.info(etiquetaLOG);

        let pCatalogo = req.query.Catalogo;
        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let pTipoAvaluo = req.query.TipoAvaluo;

        let numReg = 0;
        let listaDat;
        let listaCat = [];

        let datoNoValido = '';
        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pCatalogo}, ${pTipoAvaluo}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Catalogo', pCatalogo);

        if (pTipoAvaluo == undefined || pTipoAvaluo == '') {
            pTipoAvaluo = 0;
        }

        if (datoNoValido == '') {

            BdListaInmueble(pCatalogo, pTipoAvaluo, pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;

                    if (numReg == 0) {
                        res.json({
                            ok: false,
                            mensaje: 'No se encontró información de la lista indicada',
                            lista: []
                        });

                    } else {

                        listaDat = result;

                        if (pCatalogo == 'REGIMENPROPIEDAD' || pCatalogo == 'OBJETOAVALUO' || pCatalogo == 'PROPOSITOAVALUO') {
                            for (var i = 0, l = listaDat.length; i < l; i++) {
                                var elemento = {
                                    clave: listaDat[i].clave,
                                    descripcion: listaDat[i].descripcion
                                }
                                listaCat.push(elemento);
                            }

                        } else if (pCatalogo == 'USOCONSTRUCCION' || pCatalogo == 'CLASECONSTRUCCION') {

                            for (var i = 0, l = listaDat.length; i < l; i++) {
                                var elemento = {
                                    clave: listaDat[i].clavestr,
                                    descripcion: listaDat[i].descripcion
                                }
                                listaCat.push(elemento);
                            }
                        }

                        res.json({
                            ok: (numReg > 0) ? true : false,
                            mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información',
                            lista: (numReg > 0) ? listaCat : [],
                            codigo: (numReg > 0) ? codRespuesta.exito : codRespuesta.noDatos
                        });

                    }

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
app.post('/inmueble', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: inmueble';

        logger.info(etiquetaLOG);

        let body = req.body;

        let pFolio = body.Folio;

        let pCalle  =  body.Calle;
        let pExterior  =  body.Exterior;
        let pInterior  =  body.Interior;
        let pManzana  =  body.Manzana;
        let pLote  =  body.Lote;
        let pEdificio  =  body.Edificio;
        let pCP  =  body.CP;
        let pIdEntidad  =  body.IdEntidad;
        let pIdMunicipio  =  body.IdMunicipio;
        let pIdAsentamiento  =  body.IdAsentamiento;
        let pRegionPredial  =  body.RegionPredial;
        let pManzanaPredial  =  body.ManzanaPredial;
        let pLotePredial  =  body.LotePredial;
        let pLocalidadPredial  =  body.LocalidadPredial;
        let pDigitoVerificador  =  body.DigitoVerificador;
        let pCuentaAgua  =  body.CuentaAgua;
        let pDescInmuebleEvaluar  =  body.DescInmuebleEvaluar;
        let pIdUsoConstruccion  =  body.IdUsoConstruccion;
        let pIdClaseConstruccion  =  body.IdClaseConstruccion;
        let pIdRegimenPropiedad  =  body.IdRegimenPropiedad;
        let pPorcentajeIndiviso  =  body.PorcentajeIndiviso;
        let pIdObjetoAvaluo  =  body.IdObjetoAvaluo;
        let pIdPropositoAvaluo  =  body.IdPropositoAvaluo;
        let pAreaCatastral  =  body.AreaCatastral;
        let pValorCatastral  =  body.ValorCatastral;
        let pCorredorEnclave  =  body.CorredorEnclave;
        let pValorCorredorEnclave  =  body.ValorCorredorEnclave;
        let pCorredorOEnclave  =  body.CorredorOEnclave;
        let pValorCorredorOEnclave  =  body.ValorCorredorOEnclave;

        let pLatitud = body.Latitud;
        let pLongitud = body.Longitud;
        let pAltitud = body.Altitud;

        let pUsuarioOperacion = req.usuario.idUsuario;

        let datoNoValido = '';

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA -->  ${pFolio}, ${pCalle}, ${pExterior}, ${pInterior}, ${pManzana}, ${pLote}, ${pEdificio}, ${pIdAsentamiento}, ${pCP}, ${pIdEntidad}, ${pIdMunicipio}, ${pRegionPredial}, ${pManzanaPredial}, ${pLotePredial}, ${pLocalidadPredial}, ${pDigitoVerificador}, ${pCuentaAgua}, ${pDescInmuebleEvaluar}, ${pIdUsoConstruccion}, ${pIdClaseConstruccion}, ${pIdRegimenPropiedad}, ${pPorcentajeIndiviso}, ${pIdObjetoAvaluo}, ${pIdPropositoAvaluo}, ${pAreaCatastral}, ${pValorCatastral}, ${pCorredorEnclave}, ${pValorCorredorEnclave}, ${pCorredorOEnclave}, ${pValorCorredorOEnclave}, ${pLatitud}, ${pLongitud}, ${pAltitud}, ${pUsuarioOperacion}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Calle', pCalle);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Exterior', pExterior);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Interior', pInterior);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Manzana', pManzana);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Lote', pLote);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Edificio', pEdificio);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'CP', pIdAsentamiento);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'IdEntidad', pCP);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'IdMunicipio', pIdEntidad);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'IdAsentamiento', pIdMunicipio);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'RegionPredial', pRegionPredial);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'ManzanaPredial', pManzanaPredial);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'LotePredial', pLotePredial);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'LocalidadPredial', pLocalidadPredial);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'DigitoVerificador', pDigitoVerificador);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'CuentaAgua', pCuentaAgua);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Descrip.InmuebleEvaluar', pDescInmuebleEvaluar);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'IdUsoConstruccion', pIdUsoConstruccion);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'IdClaseConstruccion', pIdClaseConstruccion);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'IdRegimenPropiedad', pIdRegimenPropiedad);
        datoNoValido = datoNoValido + validar.datoValido(false, 'N', 'PorcentajeIndiviso', pPorcentajeIndiviso);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'IdObjetoAvaluo', pIdObjetoAvaluo);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'IdPropositoAvaluo', pIdPropositoAvaluo);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'AreaCatastral', pAreaCatastral);
        datoNoValido = datoNoValido + validar.datoValido(false, 'N', 'ValorCatastral', pValorCatastral);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'CorredorEnclave', pCorredorEnclave);
        datoNoValido = datoNoValido + validar.datoValido(false, 'N', 'ValorCorredorEnclave', pValorCorredorEnclave);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'CorredorOEnclave', pCorredorOEnclave);
        datoNoValido = datoNoValido + validar.datoValido(false, 'N', 'ValorCorredorOEnclave', pValorCorredorOEnclave);

        datoNoValido = datoNoValido + validar.datoValido(false, 'N', 'Latitud', pLatitud);
        datoNoValido = datoNoValido + validar.datoValido(false, 'N', 'Longitud', pLongitud);
        datoNoValido = datoNoValido + validar.datoValido(false, 'N', 'Altitud', pAltitud);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Usuario', pUsuarioOperacion);

        if (datoNoValido == '') {

            BdInmueble(

                    pFolio.trim(),
                    pCalle.trim(),
                    pExterior.trim(),
                    pInterior.trim(),
                    (pManzana.toUpperCase()  ==  'NULL')  ?  null  :   pManzana.trim(),
                    (pLote.toUpperCase()  ==  'NULL')  ?  null  :   pLote.trim(),
                    (pEdificio.toUpperCase()  ==  'NULL')  ?  null  :   pEdificio.trim(),
                    pIdAsentamiento.trim(),
                    pCP.trim(),
                    pIdEntidad.trim(),
                    pIdMunicipio.trim(),
                    pRegionPredial.trim(),
                    pManzanaPredial.trim(),
                    pLotePredial.trim(),
                    pLocalidadPredial.trim(),
                    pDigitoVerificador.trim(),
                    pCuentaAgua.trim(),
                    (pDescInmuebleEvaluar.toUpperCase()  ==  'NULL')  ?  null  :   pDescInmuebleEvaluar.trim(),
                    pIdUsoConstruccion.trim(),
                    pIdClaseConstruccion.trim(),
                    pIdRegimenPropiedad.toString(),
                    (pPorcentajeIndiviso  ==  '')  ?  null  : pPorcentajeIndiviso,
                    pIdObjetoAvaluo,
                    pIdPropositoAvaluo,
                    (pAreaCatastral.toUpperCase()  ==  'NULL')  ?  null  :   pAreaCatastral.trim(),
                    (pValorCatastral  ==  '')  ?  null  :  pValorCatastral,
                    (pCorredorEnclave.toUpperCase()  ==  'NULL')  ?  null  :   pCorredorEnclave.trim(),
                    (pValorCorredorEnclave  ==  '')  ?  null  :  pValorCorredorEnclave,
                    (pCorredorOEnclave.toUpperCase()  ==  'NULL')  ?  null  :   pCorredorOEnclave.trim(),
                    (pValorCorredorOEnclave  ==  '')  ?  null  :  pValorCorredorOEnclave,
                    (pLatitud ==  '')  ?  null  : pLatitud,
                    (pLongitud ==  '')  ?  null  : pLongitud,
                    (pAltitud ==  '')  ?  null  : pAltitud,

                    pUsuarioOperacion

                )
                .then(result => {

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${JSON.stringify(result[0].resultado)}, mensaje = ${JSON.stringify(result[0].mensaje)}, codigo = ${(result[0].resultado) ? codRespuesta.exito : codRespuesta.error}`);
                    res.json({
                        ok: result[0].resultado,
                        mensaje: result[0].mensaje,
                        anioEjercicioFiscal: result[0].vanioejerciciofiscalf,
                        aniosDiferenciaF: result[0].vaniosdiferenciaf,
                        areaValor: result[0].vareavalorf,
                        corredorEnclave: result[0].vcorredorenclavef,
                        areaValoranio: result[0].vareavaloraniof,
                        valorCorredorEnclaveAnio: result[0].vvalorcorredorenclaveaniof,
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
app.get('/consultaInmueble', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaInmueble';
        logger.info(etiquetaLOG);

        let pFolio = req.query.Folio;
        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let numReg = 0;
        let resultadoDat;
        let asentamientos = [];

        let datoNoValido = '';
        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pFolio}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);

        if (datoNoValido == '') {
            BdConsultaInmueble(pFolio.trim(), pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;
                    resultadoDat = result;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el folio indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    for (var i = 0, l = resultadoDat.length; i < l; i++) {
                        var elemento = {
                            idasentamiento: resultadoDat[i].idasentamientoc,
                            asentamiento: resultadoDat[i].asentamientoc,
                            seleccionado: (resultadoDat[i].idasentamientoc == resultadoDat[i].idasentamiento) ? true : false
                        }
                        asentamientos.push(elemento);
                    }

                    if (numReg > 0) {
                        var elemRes = {
                            calle: resultadoDat[0].calle,
                            exterior: resultadoDat[0].exterior,
                            interior: resultadoDat[0].interior,
                            manzana: resultadoDat[0].manzana,
                            lote: resultadoDat[0].lote,
                            edificio: resultadoDat[0].edificio,
                            cp: resultadoDat[0].cp,
                            idEntidad: resultadoDat[0].identidad,
                            entidad: resultadoDat[0].entidad,
                            idMunicipio: resultadoDat[0].idmunicipio,
                            municipio: resultadoDat[0].municipio,
                            regionPredial: resultadoDat[0].regionpredial,
                            manzanaPredial: resultadoDat[0].manzanapredial,
                            lotePredial: resultadoDat[0].lotepredial,
                            localidadPredial: resultadoDat[0].localidadpredial,
                            digitoVerificador: resultadoDat[0].digitoverificador,
                            cuentaAgua: resultadoDat[0].cuentaagua,
                            descInmuebleEvaluar: resultadoDat[0].descinmuebleevaluar,
                            idUsoConstruccion: resultadoDat[0].idusoconstruccion,
                            idClaseConstruccion: resultadoDat[0].idclaseconstruccion,
                            idRegimenPropiedad: resultadoDat[0].idregimenpropiedad,
                            porcentajeIndiviso: resultadoDat[0].porcentajeindiviso,
                            idObjetoAvaluo: resultadoDat[0].idobjetoavaluo,
                            idPropositoAvaluo: resultadoDat[0].idpropositoavaluo,
                            areaCatastral: resultadoDat[0].areacatastral,
                            valorCatastral: resultadoDat[0].valorcatastral,
                            corredorEnclave: resultadoDat[0].corredorenclave,
                            valorCorredorEnclave: resultadoDat[0].valorcorredorenclave,
                            corredorOEnclave: resultadoDat[0].corredoroenclave,
                            valorCorredorOEnclave: resultadoDat[0].valorcorredoroenclave,

                            anioEjercicioFiscalf: resultadoDat[0].anioejerciciofiscalf,
                            aniosDiferenciaF: resultadoDat[0].aniosdiferenciaf,
                            areaValorf: resultadoDat[0].areavalorf,
                            corredorEnclavef: resultadoDat[0].corredorenclavef,
                            areaValorAniof: resultadoDat[0].areavaloraniof,
                            valorCorredorEnclaveAniof: resultadoDat[0].valorcorredorenclaveaniof,

                            latitud: resultadoDat[0].latitud,
                            longitud: resultadoDat[0].longitud,
                            altitud: resultadoDat[0].altitud,

                            listaasentamientos: asentamientos
                        }
                    }

                    res.json({
                        ok: (numReg > 0) ? true : false,
                        mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información',
                        inmueble: (numReg > 0) ? elemRes : [],
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
/********************   Listas para combos   **********************************/

function BdListaInmueble(pCatalogo, pTipoAvaluo, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdListaInmueble `;
    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fCatInmueble('${pCatalogo}', CAST(${pTipoAvaluo} AS SMALLINT));`;

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
        throw (`Se presentó un error en BdListaInmueble: ${err}`);
    }
}

/********************   R e g i s t r o   **********************************/
function BdInmueble(pFolio, pCalle, pNoExterior, pInterior, pManzana, pLote, pEdificio, pIdAsentamiento, pCP,
    pIdEntidad, pIdMunicipio, pRegionPredial, pManzanaPredial, pLotePredial, pLocalidadPredial, pDigitoVerificador,
    pCuentaAgua, pDescInmuebleEvaluar, pIdUsoConstruccion, pIdClaseConstruccion, pIdRegimenPropiedad, pPorcentajeIndiviso,
    pIdObjetoAvaluo, pIdPropositoAvaluo, pAreaCatastral, pValorCatastral, pCorredorEnclave, pValorCorredorEnclave,
    pCorredorOEnclave, pValorCorredorOEnclave, pLatitud, pLongitud, pAltitud, pUsuarioOperacion) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdInmueble `;

    try {
        logger.info(etiquetaLOG);

        const client = new Pool(configD);

        logger.info(etiquetaLOG + 'SELECT * FROM fInmueble(pFolio, pCalle, pExterior, pInterior, pManzana, pLote, pEdificio, pIdAsentamiento, pCP, pIdEntidad, pIdMunicipio, pRegionPredial, pManzanaPredial, pLotePredial, pLocalidadPredial, pDigitoVerificador, pCuentaAgua, pDescInmuebleEvaluar, pIdUsoConstruccion, pIdClaseConstruccion, pIdRegimenPropiedad, pPorcentajeIndiviso, pIdObjetoAvaluo, pIdPropositoAvaluo, pAreaCatastral, pValorCatastral, pCorredorEnclave, pValorCorredorEnclave, pCorredorOEnclave, pValorCorredorOEnclave, pUsuarioOperacion);');

        let sQuery = 'SELECT * FROM fInmueble( \'' + pFolio + '\', \'' + pCalle + '\','  + '\'' + pNoExterior + '\',' +
            '\'' + pInterior + '\',' +
            '\'' + pManzana + '\',' +
            '\'' + pLote + '\',' +
            '\'' + pEdificio + '\',' +
            '\'' + pIdAsentamiento + '\',' +
            '\'' + pCP + '\',' +
            '\'' + pIdEntidad + '\',' +
            '\'' + pIdMunicipio + '\',' +
            '\'' + pRegionPredial + '\',' +
            '\'' + pManzanaPredial + '\',' +
            '\'' + pLotePredial + '\',' +
            '\'' + pLocalidadPredial + '\',' +
            '\'' + pDigitoVerificador + '\',' +
            '\'' + pCuentaAgua + '\',' +
            '\'' + pDescInmuebleEvaluar + '\',' +
            '\'' + pIdUsoConstruccion + '\',' +
            '\'' + pIdClaseConstruccion + '\',' +
            '(' + pIdRegimenPropiedad + '::smallint),' +
            '(' + pPorcentajeIndiviso + '::decimal),' +
            '(' + pIdObjetoAvaluo + '::smallint),' +
            '(' + pIdPropositoAvaluo + '::smallint),' +
            '\'' + pAreaCatastral + '\',' +
            '(' + pValorCatastral + '::decimal),' +

            '\'' + pCorredorEnclave + '\',' +
            '(' + pValorCorredorEnclave + '::decimal),' +

            '\'' + pCorredorOEnclave + '\',' +
            '(' + pValorCorredorOEnclave + '::decimal),' +

            '(' + pLatitud + '::decimal),' +
            '(' + pLongitud + '::decimal),' +
            '(' + pAltitud + '::smallint),' + pUsuarioOperacion + ');';

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
        throw (`Se presentó un error en BdInmueble: ${err}`);
    }
}

/**************   C o n s u l t a   ******************************************/
function BdConsultaInmueble(pFolio, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdConsultaInmueble `;
    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultaInmueble('${pFolio}');`;

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
        throw (`Se presentó un error en BdConsultaInmueble: ${err}`);
    }
}

module.exports = app;