const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

const { Pool } = require('pg');

const logger = require('../config/log');
const validar = require('../utilerias/generales');
const ruta = ' [terreno.js] ';

//--------------------------------------------------------------------------/
//   Terreno
//--------------------------------------------------------------------------/

/****************************************************************************
 * Listas para el módulo Terreno
 ****************************************************************************/
app.get('/listaTerreno', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: listaTerreno';
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

            BdListaTerreno(pCatalogo, pUsuarioOperacion)
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

                        if (pCatalogo == 'ENTIDAD') {

                            for (var i = 0, l = listaDat.length; i < l; i++) {
                                var elemento = {
                                    clave: listaDat[i].cve,
                                    descripcion: listaDat[i].descripcion
                                }
                                listaCat.push(elemento);
                            }

                        } else {

                            for (var i = 0, l = listaDat.length; i < l; i++) {
                                var elemento = {
                                    clave: listaDat[i].clave,
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
 * Registro TERRENO
 ****************************************************************************/
app.post('/terreno', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: terreno';

        logger.info(etiquetaLOG);

        let body = req.body;

        let pFolio = body.Folio;

        pCalleFrentePuntoCard = body.CalleFrentePuntoCard;
        pEntreCalle = body.EntreCalle;
        pEntreCallePuntoCard = body.EntreCallePuntoCard;
        pCalleY = body.CalleY;
        pCalleYPuntoCard = body.CalleYPuntoCard;
        pCalleManzana = body.CalleManzana;
        pCalleManzanaPuntoCard = body.CalleManzanaPuntoCard;
        pSuperficieTotalTerreno = body.SuperficieTotalTerreno;
        pDescripcionSuperficie = body.DescripcionSuperficie;
        pIdTipoFuenteInformacion = body.IdTipoFuenteInformacion;
        pOrientacion1 = body.Orientacion1;
        pMedida1 = body.Medida1;
        pDetalleColindante1 = body.DetalleColindante1;
        pOrientacion2 = body.Orientacion2;
        pMedida2 = body.Medida2;
        pDetalleColindante2 = body.DetalleColindante2;
        pOrientacion3 = body.Orientacion3;
        pMedida3 = body.Medida3;
        pDetalleColindante3 = body.DetalleColindante3;
        pOrientacion4 = body.Orientacion4;
        pMedida4 = body.Medida4;
        pDetalleColindante4 = body.DetalleColindante4;

        let pUsuarioOperacion = req.usuario.idUsuario;

        let datoNoValido = '';

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA -->  ${pFolio}, ${pCalleFrentePuntoCard}, ${pEntreCalle}, ${pEntreCallePuntoCard}, ${pCalleY}, ${pCalleYPuntoCard}, ${pCalleManzana}, ${pCalleManzanaPuntoCard}, ${pSuperficieTotalTerreno}, ${pDescripcionSuperficie}, ${pIdTipoFuenteInformacion}, ${pOrientacion1}, ${pMedida1}, ${pDetalleColindante1}, ${pOrientacion2}, ${pMedida2}, ${pDetalleColindante2}, ${pOrientacion3}, ${pMedida3}, ${pDetalleColindante3}, ${pOrientacion4}, ${pMedida4}, ${pDetalleColindante4}, ${pUsuarioOperacion}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Calle Frente Punto Card', pCalleFrentePuntoCard);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Entre Calle', pEntreCalle);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Entre Calle Punto Card', pEntreCallePuntoCard);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Calle Y', pCalleY);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Calle Y Punto Card', pCalleYPuntoCard);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Calle Manzana', pCalleManzana);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Calle Manzana Punto Card', pCalleManzanaPuntoCard);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Superficie Total Terreno', pSuperficieTotalTerreno);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Descripcion Superficie', pDescripcionSuperficie);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Tipo Fuente Informacion', pIdTipoFuenteInformacion);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Orientacion1', pOrientacion1);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Medida1', pMedida1);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Detalle Colindante1', pDetalleColindante1);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Orientacion2', pOrientacion2);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Medida2', pMedida2);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Detalle Colindante2', pDetalleColindante2);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Orientacion3', pOrientacion3);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Medida3', pMedida3);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Detalle Colindante3', pDetalleColindante3);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Orientacion4', pOrientacion4);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Medida4', pMedida4);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Detalle Colindante4', pDetalleColindante4);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Usuario', pUsuarioOperacion);

        if (datoNoValido == '') {

            BdTerreno(

                    pFolio.trim(),

                    pCalleFrentePuntoCard,
                    pEntreCalle,
                    (pEntreCallePuntoCard == 'NULL' || pEntreCallePuntoCard == 'null' || pEntreCallePuntoCard == '') ? null : pEntreCallePuntoCard,
                    pCalleY,
                    (pCalleYPuntoCard == 'NULL' || pCalleYPuntoCard == 'null' || pCalleYPuntoCard == '') ? null : pCalleYPuntoCard,
                    pCalleManzana,
                    (pCalleManzanaPuntoCard == 'NULL' || pCalleManzanaPuntoCard == 'null' || pCalleManzanaPuntoCard == '') ? null : pCalleManzanaPuntoCard,
                    pSuperficieTotalTerreno,
                    (pDescripcionSuperficie == 'NULL' || pDescripcionSuperficie == 'null' || pDescripcionSuperficie == '') ? null : pDescripcionSuperficie,
                    pIdTipoFuenteInformacion,

                    pOrientacion1,
                    (pMedida1 == 'NULL' || pMedida1 == 'null' || pMedida1 == '') ? null : pMedida1,
                    (pDetalleColindante1 == 'NULL' || pDetalleColindante1 == 'null' || pDetalleColindante1 == '') ? null : pDetalleColindante1,

                    (pOrientacion2 == 'NULL' || pOrientacion2 == 'null' || pOrientacion2 == '' || pOrientacion2 == 0) ? null : pOrientacion2,
                    (pMedida2 == 'NULL' || pMedida2 == 'null' || pMedida2 == '') ? null : pMedida2,
                    (pDetalleColindante2 == 'NULL' || pDetalleColindante2 == 'null' || pDetalleColindante2 == '') ? null : pDetalleColindante2,

                    (pOrientacion3 == 'NULL' || pOrientacion3 == 'null' || pOrientacion3 == '' || pOrientacion3 == 0) ? null : pOrientacion3,
                    (pMedida3 == 'NULL' || pMedida3 == 'null' || pMedida3 == '' || pMedida3 == 0) ? null : pMedida3,
                    (pDetalleColindante3 == 'NULL' || pDetalleColindante3 == 'null' || pDetalleColindante3 == '') ? null : pDetalleColindante3,

                    (pOrientacion4 == 'NULL' || pOrientacion4 == 'null' || pOrientacion4 == '' || pOrientacion4 == 0) ? null : pOrientacion4,
                    (pMedida4 == 'NULL' || pMedida4 == 'null' || pMedida4 == '' || pMedida4 == 0) ? null : pMedida4,
                    (pDetalleColindante4 == 'NULL' || pDetalleColindante4 == 'null' || pDetalleColindante4 == '') ? null : pDetalleColindante4,

                    pUsuarioOperacion

                )
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
 * Consulta TERRENO
 ****************************************************************************/
app.get('/consultaTerreno', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaTerreno';
        logger.info(etiquetaLOG);

        let pFolio = req.query.Folio;
        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let numReg = 0;
        let resultadoDat;
        let folio;

        let datoNoValido = '';
        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pFolio}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);

        if (datoNoValido == '') {
            BdConsultaTerreno(pFolio.trim(), pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;
                    resultadoDat = result;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el folio indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    if (numReg > 0) {

                        folio = resultadoDat[0].folio;

                        var elemRes = {

                            calleFrenteF: resultadoDat[0].callefrentef,
                            calleFrentePuntoCard: resultadoDat[0].callefrentepuntocard,
                            entreCalle: resultadoDat[0].entrecalle,
                            entreCallePuntoCard: resultadoDat[0].entrecallepuntocard,
                            calleY: resultadoDat[0].calley,
                            calleYPuntoCard: resultadoDat[0].calleypuntocard,
                            calleManzana: resultadoDat[0].callemanzana,
                            calleManzanaPuntoCard: resultadoDat[0].callemanzanapuntocard,
                            superficieTotalTerreno: resultadoDat[0].superficietotalterreno,
                            descripcionSuperficie: resultadoDat[0].descripcionsuperficie,
                            idTipoFuenteInformacion: resultadoDat[0].idtipofuenteinformacion,
                            orientacion1: resultadoDat[0].orientacion1,
                            medida1: resultadoDat[0].medida1,
                            detalleColindante1: resultadoDat[0].detallecolindante1,
                            orientacion2: resultadoDat[0].orientacion2,
                            medida2: resultadoDat[0].medida2,
                            detalleColindante2: resultadoDat[0].detallecolindante2,
                            orientacion3: resultadoDat[0].orientacion3,
                            medida3: resultadoDat[0].medida3,
                            detalleColindante3: resultadoDat[0].detallecolindante3,
                            orientacion4: resultadoDat[0].orientacion4,
                            medida4: resultadoDat[0].medida4,
                            detalleColindante4: resultadoDat[0].detallecolindante4

                        }
                    }

                    res.json({
                        ok: (numReg > 0 && folio != '') ? true : false,
                        mensaje: (numReg > 0 && folio != '') ? 'Consulta exitosa' : 'No se encontró información',
                        terreno: (numReg > 0) ? elemRes : [],
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
 * Registro TERRENO => TerrenoFuenteInfLegal
 ****************************************************************************/
app.post('/terrenoFuenteLegal', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: terrenoFuenteLegal';

        logger.info(etiquetaLOG);

        let body = req.body;

        let pFolio = body.Folio;

        pEscritura = body.Escritura;
        pVolumenEscritura = body.VolumenEscritura;
        pFechaEscritura = body.FechaEscritura;
        pNumeroNotariaEscritura = body.NumeroNotariaEscritura;
        pNombreNotarioEscritura = body.NombreNotarioEscritura;
        pIdDistritoJudicialNotario = body.IdDistritoJudicialNotario;
        pJuzgadoSentencia = body.JuzgadoSentencia;
        pFechaSentencia = body.FechaSentencia;
        pExpedienteSentencia = body.ExpedienteSentencia;
        pFechaAlineaNumOficial = body.FechaAlineaNumOficial;
        pFolioAlineaNumOficial = body.FolioAlineaNumOficial;
        pFechaContratoPrivado = body.FechaContratoPrivado;
        pNombreAdquirente = body.NombreAdquirente;
        pPaternoAdquirente = body.PaternoAdquirente;
        pMaternoAdquirente = body.MaternoAdquirente;
        pNombreEnajenante = body.NombreEnajenante;
        pPaternoEnajenante = body.PaternoEnajenante;
        pMaternoEnajenante = body.MaternoEnajenante;

        let pUsuarioOperacion = req.usuario.idUsuario;

        let datoNoValido = '';

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA -->  ${pFolio}, ${pEscritura}, ${pVolumenEscritura}, ${pFechaEscritura}, ${pNumeroNotariaEscritura}, ${pNombreNotarioEscritura}, ${pIdDistritoJudicialNotario}, ${pJuzgadoSentencia}, ${pFechaSentencia}, ${pExpedienteSentencia}, ${pFechaAlineaNumOficial}, ${pFolioAlineaNumOficial}, ${pFechaContratoPrivado}, ${pNombreAdquirente}, ${pPaternoAdquirente}, ${pMaternoAdquirente}, ${pNombreEnajenante}, ${pPaternoEnajenante}, ${pMaternoEnajenante}, ${pUsuarioOperacion}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);

        datoNoValido = datoNoValido + validar.datoValido(false, 'N', 'Escritura', pEscritura);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Volumen Escritura', pVolumenEscritura);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Fecha Escritura', pFechaEscritura);
        datoNoValido = datoNoValido + validar.datoValido(false, 'N', 'Numero Notaria Escritura', pNumeroNotariaEscritura);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Nombre Notario Escritura', pNombreNotarioEscritura);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Distrito Judicial Notario', pIdDistritoJudicialNotario);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Juzgado Sentencia', pJuzgadoSentencia);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Fecha Sentencia', pFechaSentencia);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Expediente Sentencia', pExpedienteSentencia);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Fecha Alineación Numero Oficial', pFechaAlineaNumOficial);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Folio Alineacion Numero Oficial', pFolioAlineaNumOficial);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Fecha Contrato Privado', pFechaContratoPrivado);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Nombre Adquirente', pNombreAdquirente);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Paterno Adquirente', pPaternoAdquirente);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Materno Adquirente', pMaternoAdquirente);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Nombre Enajenante', pNombreEnajenante);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Paterno Enajenante', pPaternoEnajenante);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Materno Enajenante', pMaternoEnajenante);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Usuario', pUsuarioOperacion);

        if (datoNoValido == '') {

            BdTerrenoInfLegal(

                    pFolio.trim(),

                    (pEscritura == 'NULL' || pEscritura == 'null' || pEscritura == '') ? null : pEscritura,
                    (pVolumenEscritura == 'NULL' || pVolumenEscritura == 'null' || pVolumenEscritura == '') ? null : pVolumenEscritura,
                    (pFechaEscritura == 'NULL' || pFechaEscritura == 'null' || pFechaEscritura == '') ? null : pFechaEscritura,
                    (pNumeroNotariaEscritura == 'NULL' || pNumeroNotariaEscritura == 'null' || pNumeroNotariaEscritura == '') ? null : pNumeroNotariaEscritura,
                    (pNombreNotarioEscritura == 'NULL' || pNombreNotarioEscritura == 'null' || pNombreNotarioEscritura == '') ? null : pNombreNotarioEscritura,
                    (pIdDistritoJudicialNotario == 'NULL' || pIdDistritoJudicialNotario == 'null' || pIdDistritoJudicialNotario == '') ? null : pIdDistritoJudicialNotario,
                    (pJuzgadoSentencia == 'NULL' || pJuzgadoSentencia == 'null' || pJuzgadoSentencia == '') ? null : pJuzgadoSentencia,
                    (pFechaSentencia == 'NULL' || pFechaSentencia == 'null' || pFechaSentencia == '') ? null : pFechaSentencia,
                    (pExpedienteSentencia == 'NULL' || pExpedienteSentencia == 'null' || pExpedienteSentencia == '') ? null : pExpedienteSentencia,
                    (pFechaAlineaNumOficial == 'NULL' || pFechaAlineaNumOficial == 'null' || pFechaAlineaNumOficial == '') ? null : pFechaAlineaNumOficial,
                    (pFolioAlineaNumOficial == 'NULL' || pFolioAlineaNumOficial == 'null' || pFolioAlineaNumOficial == '') ? null : pFolioAlineaNumOficial,
                    (pFechaContratoPrivado == 'NULL' || pFechaContratoPrivado == 'null' || pFechaContratoPrivado == '') ? null : pFechaContratoPrivado,
                    (pNombreAdquirente == 'NULL' || pNombreAdquirente == 'null' || pNombreAdquirente == '') ? null : pNombreAdquirente,
                    (pPaternoAdquirente == 'NULL' || pPaternoAdquirente == 'null' || pPaternoAdquirente == '') ? null : pPaternoAdquirente,
                    (pMaternoAdquirente == 'NULL' || pMaternoAdquirente == 'null' || pMaternoAdquirente == '') ? null : pMaternoAdquirente,
                    (pNombreEnajenante == 'NULL' || pNombreEnajenante == 'null' || pNombreEnajenante == '') ? null : pNombreEnajenante,
                    (pPaternoEnajenante == 'NULL' || pPaternoEnajenante == 'null' || pPaternoEnajenante == '') ? null : pPaternoEnajenante,
                    (pMaternoEnajenante == 'NULL' || pMaternoEnajenante == 'null' || pMaternoEnajenante == '') ? null : pMaternoEnajenante,

                    pUsuarioOperacion

                )
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
            mensaje: err,
            codigo: codRespuesta.error
        });

    }
});

/****************************************************************************
 * Consulta TERRENO => TerrenoFuenteInfLegal
 ****************************************************************************/
app.get('/consultaTerrenoFuenteLegal', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaTerrenoFuenteLegal';
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
            BdConsultaTerrenoInfLegal(pFolio.trim(), pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;
                    resultadoDat = result;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el folio indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    if (numReg > 0) {
                        var elemRes = {

                            escritura: resultadoDat[0].escritura,
                            volumenEscritura: resultadoDat[0].volumenescritura,
                            fechaEscritura: resultadoDat[0].fechaescritura,
                            numeroNotariaEscritura: resultadoDat[0].numeronotariaescritura,
                            nombreNotarioEscritura: resultadoDat[0].nombrenotarioescritura,
                            idDistritoJudicialNotario: resultadoDat[0].iddistritojudicialnotario,
                            juzgadoSentencia: resultadoDat[0].juzgadosentencia,
                            fechaSentencia: resultadoDat[0].fechasentencia,
                            expedienteSentencia: resultadoDat[0].expedientesentencia,
                            fechaAlineaNumOficial: resultadoDat[0].fechaalineanumoficial,
                            folioAlineaNumOficial: resultadoDat[0].folioalineanumoficial,
                            fechaContratoPrivado: resultadoDat[0].fechacontratoprivado,
                            nombreAdquirente: resultadoDat[0].nombreadquirente,
                            paternoAdquirente: resultadoDat[0].paternoadquirente,
                            maternoAdquirente: resultadoDat[0].maternoadquirente,
                            nombreEnajenante: resultadoDat[0].nombreenajenante,
                            paternoEnajenante: resultadoDat[0].paternoenajenante,
                            maternoEnajenante: resultadoDat[0].maternoenajenante

                        }
                    }

                    res.json({
                        ok: (numReg > 0) ? true : false,
                        mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información',
                        terrenoFuenteLegal: (numReg > 0) ? elemRes : [],
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
 * Registro TERRENO => TerrenoComplemento
 ****************************************************************************/
app.post('/terrenoComplemento', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: terrenoComplemento';

        logger.info(etiquetaLOG);

        let body = req.body;

        let pFolio = body.Folio;

        pIdTopografia = body.IdTopografia;
        pIdFormaTerreno = body.IdFormaTerreno;
        pIdDensidadHabitacional = body.IdDensidadHabitacional;
        pServidumbresORestricciones = body.ServidumbresORestricciones;

        let pUsuarioOperacion = req.usuario.idUsuario;

        let datoNoValido = '';

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA -->  ${pFolio}, ${pIdTopografia}, ${pIdFormaTerreno}, ${pIdDensidadHabitacional}, ${pServidumbresORestricciones}, ${pUsuarioOperacion}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Id Topografia', pIdTopografia);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Id Forma Terreno', pIdFormaTerreno);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Id Densidad Habitacional', pIdDensidadHabitacional);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Servidumbres O Restricciones', pServidumbresORestricciones);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Usuario', pUsuarioOperacion);

        if (datoNoValido == '') {

            BdTerrenoComplemento(
                    pFolio.trim(),
                    pIdTopografia, pIdFormaTerreno, pIdDensidadHabitacional, pServidumbresORestricciones,
                    pUsuarioOperacion
                )
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
            mensaje: err,
            codigo: codRespuesta.error
        });

    }
});

/****************************************************************************
 * Consulta TERRENO => TerrenoComplemento
 ****************************************************************************/
app.get('/consultaTerrenoComplemento', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaTerrenoComplemento';
        logger.info(etiquetaLOG);

        let pFolio = req.query.Folio;
        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let numReg = 0;
        let resultadoDat;

        let folio;

        let datoNoValido = '';
        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pFolio}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);

        if (datoNoValido == '') {
            BdConsultaComplemento(pFolio.trim(), pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;
                    resultadoDat = result;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el folio indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    if (numReg > 0) {

                        folio = resultadoDat[0].folio;
                        var elemRes = {

                            idTopografia: resultadoDat[0].idtopografia,
                            idFormaTerreno: resultadoDat[0].idformaterreno,
                            caracteristPanoramicasF: resultadoDat[0].caracteristpanoramicasf,
                            intencidadConstruccionF: resultadoDat[0].intencidadconstruccionf,
                            descIntencidadConstruccionF: resultadoDat[0].descintencidadconstruccionf,
                            idDensidadHabitacional: resultadoDat[0].iddensidadhabitacional,
                            servidumbresORestricciones: resultadoDat[0].servidumbresorestricciones
                        }
                    }

                    res.json({
                        ok: (numReg > 0 && folio != '') ? true : false,
                        mensaje: (numReg > 0 && folio != '') ? 'Consulta exitosa' : 'No se encontró información',
                        terrenoComplemento: (numReg > 0) ? elemRes : [],
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
 * Registro TERRENO => TerrenoColindancias
 ****************************************************************************/
app.post('/terrenoColindancias', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: terrenoColindancias';

        logger.info(etiquetaLOG);

        let body = req.body;

        let pFolio = body.Folio;

        pIdTerrenoColindancia = body.IdTerrenoColindancia;
        pDescripcionColindancia = body.DescripcionColindancia;

        pOrientacion1 = body.Orientacion1;
        pMedida1 = body.Medida1;
        pDetalleColindante1 = body.DetalleColindante1;
        pOrientacion2 = body.Orientacion2;
        pMedida2 = body.Medida2;
        pDetalleColindante2 = body.DetalleColindante2;
        pOrientacion3 = body.Orientacion3;
        pMedida3 = body.Medida3;
        pDetalleColindante3 = body.DetalleColindante3;
        pOrientacion4 = body.Orientacion4;
        pMedida4 = body.Medida4;
        pDetalleColindante4 = body.DetalleColindante4;

        let pUsuarioOperacion = req.usuario.idUsuario;

        let datoNoValido = '';

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA -->  ${pFolio}, ${pIdTerrenoColindancia}, ${pDescripcionColindancia}, ${pOrientacion1}, ${pMedida1}, ${pDetalleColindante1}, ${pOrientacion2}, ${pMedida2}, ${pDetalleColindante2}, ${pOrientacion3}, ${pMedida3}, ${pDetalleColindante3}, ${pOrientacion4}, ${pMedida4}, ${pDetalleColindante4}, ${pUsuarioOperacion}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);

        datoNoValido = datoNoValido + validar.datoValido(true, 'R', 'Id Terreno Colindancia', pIdTerrenoColindancia);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Descripción Colindancia', pDescripcionColindancia);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Orientacion1', pOrientacion1);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Medida1', pMedida1);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Detalle Colindante1', pDetalleColindante1);
        datoNoValido = datoNoValido + validar.datoValido(false, 'N', 'Orientacion2', pOrientacion2);
        datoNoValido = datoNoValido + validar.datoValido(false, 'N', 'Medida2', pMedida2);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Detalle Colindante2', pDetalleColindante2);
        datoNoValido = datoNoValido + validar.datoValido(false, 'N', 'Orientacion3', pOrientacion3);
        datoNoValido = datoNoValido + validar.datoValido(false, 'N', 'Medida3', pMedida3);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Detalle Colindante3', pDetalleColindante3);
        datoNoValido = datoNoValido + validar.datoValido(false, 'N', 'Orientacion4', pOrientacion4);
        datoNoValido = datoNoValido + validar.datoValido(false, 'N', 'Medida4', pMedida4);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Detalle Colindante4', pDetalleColindante4);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Usuario', pUsuarioOperacion);

        if (datoNoValido == '') {

            BdTerrenoColindancias(

                    pFolio,
                    pIdTerrenoColindancia,
                    pDescripcionColindancia,
                    pOrientacion1,
                    pMedida1,
                    pDetalleColindante1,

                    pOrientacion1,
                    pMedida1,
                    pDetalleColindante1,

                    (pOrientacion2 == 'NULL' || pOrientacion2 == 'null' || pOrientacion2 == '' || pOrientacion2 == 0) ? null : pOrientacion2,
                    (pMedida2 == 'NULL' || pMedida2 == 'null' || pMedida2 == '' || pMedida2 == 0) ? null : pMedida2,
                    (pDetalleColindante2 == 'NULL' || pDetalleColindante2 == 'null' || pDetalleColindante2 == '') ? null : pDetalleColindante2,

                    (pOrientacion3 == 'NULL' || pOrientacion3 == 'null' || pOrientacion3 == '' || pOrientacion3 == 0) ? null : pOrientacion3,
                    (pMedida3 == 'NULL' || pMedida3 == 'null' || pMedida3 == '' || pMedida3 == 0) ? null : pMedida3,
                    (pDetalleColindante3 == 'NULL' || pDetalleColindante3 == 'null' || pDetalleColindante3 == '') ? null : pDetalleColindante3,

                    (pOrientacion4 == 'NULL' || pOrientacion4 == 'null' || pOrientacion4 == '' || pOrientacion4 == 0) ? null : pOrientacion4,
                    (pMedida4 == 'NULL' || pMedida4 == 'null' || pMedida4 == '' || pMedida4 == 0) ? null : pMedida4,
                    (pDetalleColindante4 == 'NULL' || pDetalleColindante4 == 'null' || pDetalleColindante4 == '') ? null : pDetalleColindante4,

                    pUsuarioOperacion

                )
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
            mensaje: err,
            codigo: codRespuesta.error
        });

    }
});

/****************************************************************************
 * Consulta TERRENO => TerrenoColindancias
 ****************************************************************************/
app.get('/consultaTerrenoColindancias', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaTerrenoColindancias';
        logger.info(etiquetaLOG);

        let pFolio = req.query.Folio;
        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let numReg = 0;
        let resultadoDat;
        let listaColindancias = [];

        let datoNoValido = '';
        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pFolio}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);

        if (datoNoValido == '') {
            BdConsultaColindancias(pFolio.trim(), pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;
                    resultadoDat = result;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el folio indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    if (numReg > 0) {
                        for (var i = 0, l = numReg; i < l; i++) {
                            var elemRes = {

                                idTerrenoColindancia: resultadoDat[i].idterrenocolindancia,
                                descripcionColindancia: resultadoDat[i].descripcioncolindancia,

                                orientacion1: resultadoDat[i].orientacion1,
                                medida1: resultadoDat[i].medida1,
                                detalleColindante1: resultadoDat[i].detallecolindante1,
                                orientacion2: resultadoDat[i].orientacion2,
                                medida2: resultadoDat[i].medida2,
                                detalleColindante2: resultadoDat[i].detallecolindante2,
                                orientacion3: resultadoDat[i].orientacion3,
                                medida3: resultadoDat[i].medida3,
                                detalleColindante3: resultadoDat[i].detallecolindante3,
                                orientacion4: resultadoDat[i].orientacion4,
                                medida4: resultadoDat[i].medida4,
                                detalleColindante4: resultadoDat[i].detallecolindante4
                            }
                            listaColindancias.push(elemRes);
                        }
                    }

                    res.json({
                        ok: (numReg > 0) ? true : false,
                        mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información',
                        colindancias: (numReg > 0) ? listaColindancias : [],
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
function BdListaTerreno(pCatalogo, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdListaTerreno `;
    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fCatTerreno('${pCatalogo}');`;

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
        throw (`Se presentó un error en BdListaTerreno: ${err}`);
    }
}

/**************   R e g i s t r o  TERRENO  ******************************************/
function BdTerreno(pFolio,
    pCalleFrentePuntoCard,
    pEntreCalle, pEntreCallePuntoCard,
    pCalleY, pCalleYPuntoCard,
    pCalleManzana, pCalleManzanaPuntoCard,
    pSuperficieTotalTerreno,
    pDescripcionSuperficie,
    pIdTipoFuenteInformacion,
    pOrientacion1, pMedida1, pDetalleColindante1,
    pOrientacion2, pMedida2, pDetalleColindante2,
    pOrientacion3, pMedida3, pDetalleColindante3,
    pOrientacion4, pMedida4, pDetalleColindante4,
    pUsuarioOperacion) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdTerreno `;

    try {
        logger.info(etiquetaLOG);

        const client = new Pool(configD);

        logger.info(etiquetaLOG + 'SELECT * FROM fTerreno(pFolio, pCalleFrentePuntoCard, pEntreCalle, pEntreCallePuntoCard, pCalleY, pCalleYPuntoCard, pCalleManzana, pCalleManzanaPuntoCard, pSuperficieTotalTerreno, pDescripcionSuperficie, pIdTipoFuenteInformacion, pOrientacion1, pMedida1, pDetalleColindante1,  pOrientacion2, pMedida2, pDetalleColindante2, pOrientacion3, pMedida3, pDetalleColindante3, pOrientacion4, pMedida4, pDetalleColindante4, pUsuarioOperacion);');

        let sQuery = 'SELECT * FROM fTerreno( \'' + pFolio + '\', ' +

            '(' + pCalleFrentePuntoCard + '::smallint),' +
            ((pEntreCalle == null) ? pEntreCalle : '\'' + pEntreCalle + '\'') + ',' +
            '(' + pEntreCallePuntoCard + '::smallint),' +
            ' \'' + pCalleY + '\',' +
            '(' + pCalleYPuntoCard + '::smallint),' +
            ((pCalleManzana == null) ? pCalleManzana : '\'' + pCalleManzana + '\'') + ',' +
            '(' + pCalleManzanaPuntoCard + '::smallint),' +
            '(' + pSuperficieTotalTerreno + '::decimal),' +
            ((pDescripcionSuperficie == null) ? pDescripcionSuperficie : '\'' + pDescripcionSuperficie + '\'') + ',' +
            '(' + pIdTipoFuenteInformacion + '::smallint),' +
            '(' + pOrientacion1 + '::smallint),' +
            '(' + pMedida1 + '::decimal),' +
            ' \'' + pDetalleColindante1 + '\',' +

            '(' + pOrientacion2 + '::smallint),' +
            '(' + pMedida2 + '::decimal),' +
            ' \'' + pDetalleColindante2 + '\',' +

            '(' + pOrientacion3 + '::smallint),' +
            '(' + pMedida3 + '::decimal),' +
            ' \'' + pDetalleColindante3 + '\',' +

            '(' + pOrientacion4 + '::smallint),' +
            '(' + pMedida4 + '::decimal),' +
            ' \'' + pDetalleColindante4 + '\',' +

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
        throw (`Se presentó un error en BdTerreno: ${err}`);
    }
}

/**************   C o n s u l t a  TERRENO  ******************************************/
function BdConsultaTerreno(pFolio, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdConsultaTerreno `;
    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultaTerreno('${pFolio}');`;

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
        throw (`Se presentó un error en BdConsultaTerreno: ${err}`);
    }
}

/**************   R e g i s t r o  TERRENO Información Legal  ******************************************/
function BdTerrenoInfLegal(pFolio,
    pEscritura, pVolumenEscritura, pFechaEscritura, pNumeroNotariaEscritura, pNombreNotarioEscritura, pIdDistritoJudicialNotario, pJuzgadoSentencia,
    pFechaSentencia, pExpedienteSentencia, pFechaAlineaNumOficial, pFolioAlineaNumOficial, pFechaContratoPrivado, pNombreAdquirente,
    pPaternoAdquirente, pMaternoAdquirente, pNombreEnajenante, pPaternoEnajenante, pMaternoEnajenante,
    pUsuarioOperacion) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdTerrenoInfLegal `;

    try {
        logger.info(etiquetaLOG);

        const client = new Pool(configD);

        logger.info(etiquetaLOG + 'SELECT * FROM fTerrenoFuenteLegal(pFolio,pEscritura, pVolumenEscritura, pFechaEscritura, pNumeroNotariaEscritura, pNombreNotarioEscritura, pIdDistritoJudicialNotario, pJuzgadoSentencia, pFechaSentencia, pExpedienteSentencia, pFechaAlineaNumOficial, pFolioAlineaNumOficial, pFechaContratoPrivado, pNombreAdquirente, pPaternoAdquirente, pMaternoAdquirente, pNombreEnajenante, pPaternoEnajenante, pMaternoEnajenante, pUsuarioOperacion);');

        let sQuery = 'SELECT * FROM fTerrenoFuenteLegal( \'' + pFolio + '\', ' +

            '(' + pEscritura + '::smallint),' +
            ((pVolumenEscritura == null) ? pVolumenEscritura : '\'' + pVolumenEscritura + '\'') + ',' +
            ((pFechaEscritura == null) ? pFechaEscritura : '\'' + pFechaEscritura + '\'') + ',' +

            pNumeroNotariaEscritura + ',' +

            ((pNombreNotarioEscritura == null) ? pNombreNotarioEscritura : '\'' + pNombreNotarioEscritura + '\'') + ',' +
            ((pIdDistritoJudicialNotario == null) ? pIdDistritoJudicialNotario : '\'' + pIdDistritoJudicialNotario + '\'') + ',' +
            ((pJuzgadoSentencia == null) ? pJuzgadoSentencia : '\'' + pJuzgadoSentencia + '\'') + ',' +
            ((pFechaSentencia == null) ? pFechaSentencia : '\'' + pFechaSentencia + '\'') + ',' +
            ((pExpedienteSentencia == null) ? pExpedienteSentencia : '\'' + pExpedienteSentencia + '\'') + ',' +
            ((pFechaAlineaNumOficial == null) ? pFechaAlineaNumOficial : '\'' + pFechaAlineaNumOficial + '\'') + ',' +
            ((pFolioAlineaNumOficial == null) ? pFolioAlineaNumOficial : '\'' + pFolioAlineaNumOficial + '\'') + ',' +
            ((pFechaContratoPrivado == null) ? pFechaContratoPrivado : '\'' + pFechaContratoPrivado + '\'') + ',' +
            ((pNombreAdquirente == null) ? pNombreAdquirente : '\'' + pNombreAdquirente + '\'') + ',' +
            ((pPaternoAdquirente == null) ? pPaternoAdquirente : '\'' + pPaternoAdquirente + '\'') + ',' +
            ((pMaternoAdquirente == null) ? pMaternoAdquirente : '\'' + pMaternoAdquirente + '\'') + ',' +
            ((pNombreEnajenante == null) ? pNombreEnajenante : '\'' + pNombreEnajenante + '\'') + ',' +
            ((pPaternoEnajenante == null) ? pPaternoEnajenante : '\'' + pPaternoEnajenante + '\'') + ',' +
            ((pMaternoEnajenante == null) ? pMaternoEnajenante : '\'' + pMaternoEnajenante + '\'') + ',' +
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
        throw (`Se presentó un error en BdTerrenoInfLegal: ${err}`);
    }
}

/**************   C o n s u l t a  TERRENO Información Legal  ******************************************/
function BdConsultaTerrenoInfLegal(pFolio, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdConsultaTerrenoInfLegal `;
    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultaTerrenoFuenteLegal('${pFolio}');`;

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
        throw (`Se presentó un error en BdConsultaTerrenoInfLegal: ${err}`);
    }
}

/**************   R e g i s t r o  TERRENO Complemento  ******************************************/
function BdTerrenoComplemento(pFolio,
    pIdTopografia, pIdFormaTerreno, pIdDensidadHabitacional, pServidumbresORestricciones,
    pUsuarioOperacion) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdTerrenoComplemento `;

    try {
        logger.info(etiquetaLOG);

        const client = new Pool(configD);

        logger.info(etiquetaLOG + 'SELECT * FROM fTerrenoComplemento(pFolio, pIdTopografia, pIdFormaTerreno, pIdDensidadHabitacional, pServidumbresORestricciones, pUsuarioOperacion);');

        let sQuery = 'SELECT * FROM fTerrenoComplemento( \'' + pFolio + '\', ' +

            '(' + pIdTopografia + '::smallint),' +
            '(' + pIdFormaTerreno + '::smallint),' +
            '(' + pIdDensidadHabitacional + '::smallint),' +
            '\'' + pServidumbresORestricciones + '\',' +
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
        throw (`Se presentó un error en fTerrenoComplemento: ${err}`);
    }
}

/**************   C o n s u l t a  TERRENO Complemento  ******************************************/
function BdConsultaComplemento(pFolio, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdConsultaComplemento `;
    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultaTerrenoComplemento('${pFolio}');`;

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
        throw (`Se presentó un error en BdConsultaComplemento: ${err}`);
    }
}

/**************   R e g i s t r o  TERRENO Colindancias  ******************************************/
function BdTerrenoColindancias(pFolio,
    pIdTerrenoColindancia, pDescripcionColindancia, pOrientacion1, pMedida1, pDetalleColindante1,
    pOrientacion1, pMedida1, pDetalleColindante1,
    pOrientacion2, pMedida2, pDetalleColindante2,
    pOrientacion3, pMedida3, pDetalleColindante3,
    pOrientacion4, pMedida4, pDetalleColindante4,
    pUsuarioOperacion) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdTerrenoColindancias `;

    try {
        logger.info(etiquetaLOG);

        const client = new Pool(configD);

        logger.info(etiquetaLOG + 'SELECT * FROM fTerrenoColindancias(pFolio, pIdTerrenoColindancia, pDescripcionColindancia, pOrientacion1, pMedida1, pDetalleColindante1, pOrientacion2, pMedida2, pDetalleColindante2, pOrientacion3, pMedida3, pDetalleColindante3, pOrientacion4, pMedida4, pDetalleColindante4, pUsuarioOperacion);');

        let sQuery = 'SELECT * FROM fTerrenoColindancias(  ' +
            '(' + pIdTerrenoColindancia + '::smallint),' +
            '\'' + pFolio + '\', ' +
            '\'' + pDescripcionColindancia + '\',' +
            '(' + pOrientacion1 + '::smallint),' +
            '(' + pMedida1 + '::decimal),' +
            '\'' + pDetalleColindante1 + '\',' +
            '(' + pOrientacion2 + '::smallint),' +
            '(' + pMedida2 + '::decimal),' +
            '\'' + pDetalleColindante2 + '\',' +
            '(' + pOrientacion3 + '::smallint),' +
            '(' + pMedida3 + '::decimal),' +
            ((pDetalleColindante3 == null) ? pDetalleColindante3 : '\'' + pDetalleColindante3 + '\'') + ',' +
            '(' + pOrientacion4 + '::smallint),' +
            '(' + pMedida4 + '::decimal),' +
            ((pDetalleColindante4 == null) ? pDetalleColindante4 : '\'' + pDetalleColindante4 + '\'') + ',' +
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
        throw (`Se presentó un error en fTerrenoColindancias: ${err}`);
    }
}

/**************   C o n s u l t a  TERRENO Colindancias  ******************************************/
function BdConsultaColindancias(pFolio, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdConsultaColindancias `;
    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultaTerrenoColindancias('${pFolio}');`;

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
        throw (`Se presentó un error en BdConsultaColindancias: ${err}`);
    }
}

module.exports = app;