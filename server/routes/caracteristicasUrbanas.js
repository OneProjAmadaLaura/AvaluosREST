const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

const { Pool } = require('pg');

const logger = require('../config/log');
const validar = require('../utilerias/generales');
const ruta = ' [caracteristicasUrbanas.js] ';
//--------------------------------------------------------------------------/
//   Caracteristicas Urbanas
//--------------------------------------------------------------------------/

/****************************************************************************
 * Listas para el módulo Caracteristicas Urbanas 
 ****************************************************************************/
app.get('/listaCaracUrbanas', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: listaCaracUrbanas';
        logger.info(etiquetaLOG);

        let pCatalogo = req.query.Catalogo;
        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let numReg = 0;
        let listaDat;
        let listaCat = [];

        let datoNoValido = '';
        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pCatalogo}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Catalogo', pCatalogo);

        if (datoNoValido == '') {

            BdListaCaractUrbanas(pCatalogo, pUsuarioOperacion)
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
                        /**************************************************** */

                        if (pCatalogo == 'CLASIFICACIONZONA' || pCatalogo == 'ESTCLASIFICACIONZONA' || pCatalogo == 'DENCIDADPOBLACION') {
                            for (var i = 0, l = listaDat.length; i < l; i++) {
                                var elemento = {
                                    clave: listaDat[i].clave,
                                    descripcion: listaDat[i].descripcion
                                }
                                listaCat.push(elemento);
                            }

                        } else if (pCatalogo == 'INDICESATURAZONA') {

                            for (var i = 0, l = listaDat.length; i < l; i++) {
                                var elemento = {
                                    clave: listaDat[i].clave,
                                    valor: listaDat[i].valor
                                }
                                listaCat.push(elemento);
                            }

                        } else if (pCatalogo == 'NIVELSOCIOECONO') {

                            for (var i = 0, l = listaDat.length; i < l; i++) {
                                var elemento = {
                                    clave: listaDat[i].clave,
                                    descripcion: listaDat[i].descripcion,
                                    detalle: listaDat[i].detalle
                                }
                                listaCat.push(elemento);
                            }

                        } else if (pCatalogo == 'USOSUELO' || pCatalogo == 'DENCIDADVIVIENDA') {

                            for (var i = 0, l = listaDat.length; i < l; i++) {
                                var elemento = {
                                    clave: listaDat[i].descripcion,
                                    descripcion: listaDat[i].detalle
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
app.post('/caractUrbanas', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: caractUrbanas';

        logger.info(etiquetaLOG);

        let body = req.body;

        let pFolio = body.Folio;

        pIdClasificacionZona = body.IdClasificacionZona;
        pIdEstatusClasificacionZona = body.IdEstatusClasificacionZona;
        pTipoConstruccion = body.TipoConstruccion;
        pIdIndiceSaturacionZona = body.IdIndiceSaturacionZona;
        pIndiceSaturacionZonaValor = body.IndiceSaturacionZonaValor;
        pIdNivelSocioEconomico = body.IdNivelSocioEconomico;
        pIdDensidadPoblacion = body.IdDensidadPoblacion;
        pContaminacionAmbientalZona = body.ContaminacionAmbientalZona;
        pIdUsoSuelo = body.IdUsoSuelo;
        pNumeroMaximoNivelesConstruir = body.NumeroMaximoNivelesConstruir;
        pPorcentajeAreaLibre = body.PorcentajeAreaLibre;
        pIdDensidadVivienda = body.IdDensidadVivienda;
        pSuperficieLoteMinimo = body.SuperficieLoteMinimo;
        pSuperficieLoteTipo = body.SuperficieLoteTipo;
        pViasAccesoEImportancia = body.ViasAccesoEImportancia;

        let pUsuarioOperacion = req.usuario.idUsuario;

        let datoNoValido = '';

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA -->  ${pFolio}, ${pIdClasificacionZona}, ${pIdEstatusClasificacionZona}, ${pTipoConstruccion}, ${pIdIndiceSaturacionZona}, ${pIndiceSaturacionZonaValor}, ${pIdNivelSocioEconomico}, ${pIdDensidadPoblacion}, ${pContaminacionAmbientalZona}, ${pIdUsoSuelo}, ${pNumeroMaximoNivelesConstruir}, ${pPorcentajeAreaLibre }, ${pIdDensidadVivienda}, ${pSuperficieLoteMinimo }, ${pSuperficieLoteTipo }, ${pViasAccesoEImportancia}, ${pUsuarioOperacion}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Id Clasificacion Zona', pIdClasificacionZona);
        datoNoValido = datoNoValido + validar.datoValido(false, 'N', 'Id Estatus Clasificacion Zona', pIdEstatusClasificacionZona);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Tipo Construccion', pTipoConstruccion);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Id Indice Saturacion Zona', pIdIndiceSaturacionZona);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Indice Saturacion Zona Valor', pIndiceSaturacionZonaValor);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Id Nivel Socio Economico', pIdNivelSocioEconomico);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Id Densidad Poblacion', pIdDensidadPoblacion);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Contaminacion Ambiental Zona', pContaminacionAmbientalZona);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Id Uso Suelo', pIdUsoSuelo);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Numero Maximo Niveles Construir', pNumeroMaximoNivelesConstruir);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Porcentaje Area Libre', pPorcentajeAreaLibre);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Id Densidad Vivienda', pIdDensidadVivienda);
        datoNoValido = datoNoValido + validar.datoValido(false, 'N', 'Superficie Lote Minimo', pSuperficieLoteMinimo);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Superficie Lote Tipo', pSuperficieLoteTipo);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Vias Acceso E Importancia', pViasAccesoEImportancia);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Usuario', pUsuarioOperacion);

        if (datoNoValido == '') {

            BdCaracUrbanas(

                    pFolio.trim(),

                    pIdClasificacionZona,
                    (pIdEstatusClasificacionZona  ==  'NULL' || pIdEstatusClasificacionZona  ==  'null' || pIdEstatusClasificacionZona == '')  ?  null  : pIdEstatusClasificacionZona,
                    pTipoConstruccion,
                    pIdIndiceSaturacionZona,
                    pIndiceSaturacionZonaValor,
                    pIdNivelSocioEconomico,
                    pIdDensidadPoblacion,
                    pContaminacionAmbientalZona,
                    pIdUsoSuelo,
                    pNumeroMaximoNivelesConstruir,
                    pPorcentajeAreaLibre,
                    (pIdDensidadVivienda.toUpperCase()  ==  'NULL')  ?  null  : pIdDensidadVivienda,
                    (pSuperficieLoteMinimo ==  'NULL' || pSuperficieLoteMinimo == 'null' || pSuperficieLoteMinimo == '')  ?  null  : pSuperficieLoteMinimo,

                    pSuperficieLoteTipo,
                    pViasAccesoEImportancia.trim(),

                    pUsuarioOperacion

                )
                .then(result => {

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${JSON.stringify(result[0].resultado)}, mensaje = ${JSON.stringify(result[0].mensaje)}, codigo = ${(result[0].resultado) ? codRespuesta.exito : codRespuesta.error}`);
                    res.json({
                        ok: result[0].resultado,
                        mensaje: result[0].mensaje,
                        claveUsoSueloF: result[0].vclaveusosuelof,
                        descripUsoSueloF: result[0].vdescripusosuelof,
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
app.get('/consultaCaractUrbanas', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaCaractUrbanas';
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
            BdConsultaCaracUrbanas(pFolio.trim(), pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;
                    resultadoDat = result;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el folio indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    if (numReg > 0) {
                        var elemRes = {

                            idClasificacionZona: resultadoDat[0].idclasificacionzona,
                            idEstatusClasificacionZona: resultadoDat[0].idestatusclasificacionzona,
                            tipoConstruccion: resultadoDat[0].tipoconstruccion,
                            idIndiceSaturacionZona: resultadoDat[0].idindicesaturacionzona,
                            idNivelSocioEconomico: resultadoDat[0].idnivelsocioeconomico,
                            idDensidadPoblacion: resultadoDat[0].iddensidadpoblacion,
                            contaminacionAmbientalZona: resultadoDat[0].contaminacionambientalzona,
                            idUsoSuelo: resultadoDat[0].idusosuelo,
                            numeroMaximoNivelesConstruir: resultadoDat[0].numeromaximonivelesconstruir,
                            porcentajeAreaLibre: resultadoDat[0].porcentajearealibre,
                            idDensidadVivienda: resultadoDat[0].iddensidadvivienda,
                            superficieLoteMinimo: resultadoDat[0].superficieloteminimo,
                            superficieLoteTipo: resultadoDat[0].superficielotetipo,
                            viasAccesoEImportancia: resultadoDat[0].viasaccesoeimportancia,
                            claveUsoSueloF: resultadoDat[0].claveusosuelof,
                            descripUsoSueloF: resultadoDat[0].descripusosuelof,
                            coeficienteDeUsoDelSueloF: resultadoDat[0].coeficientedeusodelsuelof

                        }
                    }

                    res.json({
                        ok: (numReg > 0) ? true : false,
                        mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información',
                        caractUrbanas: (numReg > 0) ? elemRes : [],
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
function BdListaCaractUrbanas(pCatalogo, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdListaCaracUrbanas `;
    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fCatCaractUrbanas('${pCatalogo}');`;

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
        throw (`Se presentó un error en BdListaCaractUrbanas: ${err}`);
    }
}

/**************   R e g i s t r o   ******************************************/
function BdCaracUrbanas(pFolio, pIdClasificacionZona, pIdEstatusClasificacionZona, pTipoConstruccion, pIdIndiceSaturacionZona,
    pIndiceSaturacionZonaValor, pIdNivelSocioEconomico, pIdDensidadPoblacion, pContaminacionAmbientalZona, pIdUsoSuelo,
    pNumeroMaximoNivelesConstruir, pPorcentajeAreaLibre, pIdDensidadVivienda, pSuperficieLoteMinimo, pSuperficieLoteTipo,
    pViasAccesoEImportancia, pUsuarioOperacion) {

    let etiquetaLOG = `${ruta} [Usuario: ${ pUsuarioOperacion }] METODO: BdCaracUrbanas `;

    try {
        logger.info(etiquetaLOG);

        const client = new Pool(configD);

        logger.info(etiquetaLOG + 'SELECT * FROM fCaractUrbanas(pFolio, pIdClasificacionZona,pIdEstatusClasificacionZona,pTipoConstruccion,pIdIndiceSaturacionZona,pIndiceSaturacionZonaValor,pIdNivelSocioEconomico,pIdDensidadPoblacion,pContaminacionAmbientalZona,pIdUsoSuelo,pNumeroMaximoNivelesConstruir,pPorcentajeAreaLibre,pIdDensidadVivienda,pSuperficieLoteMinimo,pSuperficieLoteTipo,pViasAccesoEImportancia, pUsuarioOperacion);');

        let sQuery = 'SELECT * FROM fCaractUrbanas( \'' + pFolio + '\', ' +
            '(' + pIdClasificacionZona + '::smallint),' +
            '(' + pIdEstatusClasificacionZona + '::smallint),' +
            '\'' + pTipoConstruccion + '\',' +
            '(' + pIdIndiceSaturacionZona + '::smallint),' +
            '(' + pIndiceSaturacionZonaValor + '::decimal),' +

            '(' + pIdNivelSocioEconomico + '::smallint),' +
            '(' + pIdDensidadPoblacion + '::smallint),' +

            '\'' + pContaminacionAmbientalZona + '\',' +

            '\'' + pIdUsoSuelo + '\',' +

            '(' + pNumeroMaximoNivelesConstruir + '::smallint),' +
            '(' + pPorcentajeAreaLibre + '::decimal),' +

            '\'' + pIdDensidadVivienda + '\',' +
            '(' + pSuperficieLoteMinimo + '::smallint),' +
            '(' + pSuperficieLoteTipo + '::smallint),' +

            '\'' + pViasAccesoEImportancia + '\',' +

            pUsuarioOperacion + ');';

        logger.info(`${etiquetaLOG} ${sQuery} `);
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
        throw (`Se presentó un error en BdCaracUrbanas: ${err}`);
    }
}

/**************   C o n s u l t a   ******************************************/
function BdConsultaCaracUrbanas(pFolio, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdConsultaCaracUrbanas `;
    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);


        let sQuery = `SELECT * FROM fConsultaCaractUrbanas('${pFolio}');`;

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
        throw (`Se presentó un error en BdConsultaCaracUrbanas: ${err}`);
    }
}

module.exports = app;