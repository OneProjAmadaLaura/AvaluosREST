const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

const { Pool } = require('pg');

const logger = require('../config/log');
const validar = require('../utilerias/generales');
const { exceptions } = require('../config/log');
const ruta = ' [elementosConstruccion.js] ';
//--------------------------------------------------------------------------/
//   Elementos de Construcción
//--------------------------------------------------------------------------/

/****************************************************************************
 * Registro, edición de ElementosConstruccion
 ****************************************************************************/
app.post('/elementosConstruccion', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: elementosConstruccion';

        logger.info(etiquetaLOG);

        let body = req.body;
        let pUsuarioOperacion = req.usuario.idUsuario;

        let pFolio = body.Folio;
        let pCimientos = body.Cimientos;
        let pEstructuras = body.Estructuras;
        let pMuros = body.Muros;
        let pEntrepisos = body.Entrepisos;
        let pTechos = body.Techos;
        let pAzoteas = body.Azoteas;
        let pBardas = body.Bardas;
        let pAplanados = body.Aplanados;
        let pPlafones = body.Plafones;
        let pLambrines = body.Lambrines;
        let pPisos = body.Pisos;
        let pZoclos = body.Zoclos;
        let pEscaleras = body.Escaleras;
        let pPintura = body.Pintura;
        let pRecubrimientosEspeciales = body.RecubrimientosEspeciales;
        let pPuertasInteriores = body.PuertasInteriores;
        let pGuardaropas = body.Guardaropas;
        let pMueblesEmpotradosFijos = body.MueblesEmpotradosFijos;
        let pMueblesBaño = body.MueblesBaño;
        let pRamaleosHidraulicos = body.RamaleosHidraulicos;
        let pRamaleosSanitarios = body.RamaleosSanitarios;
        let pInstalacionesElectricas = body.InstalacionesElectricas;
        let pHerreria = body.Herreria;
        let pVentaneria = body.Ventaneria;
        let pVidrieria = body.Vidrieria;
        let pCerrajeria = body.Cerrajeria;
        let pFachadas = body.Fachadas;

        let datoNoValido = '';

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA -->  ${pFolio}, ${pCimientos}, ${pEstructuras}, ${pMuros}, ${pEntrepisos}, ${pTechos}, ${pAzoteas}, ${pBardas}, ${pAplanados}, ${pPlafones}, ${pLambrines}, ${pPisos}, ${pZoclos}, ${pEscaleras}, ${pPintura}, ${pRecubrimientosEspeciales}, ${pPuertasInteriores}, ${pGuardaropas}, ${pMueblesEmpotradosFijos}, ${pMueblesBaño}, ${pRamaleosHidraulicos}, ${pRamaleosSanitarios}, ${pInstalacionesElectricas}, ${pHerreria}, ${pVentaneria}, ${pVidrieria}, ${pCerrajeria}, ${pFachadas}, ${pUsuarioOperacion}`);

        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'F', 'Folio', pFolio);

        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Cimientos', pCimientos);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Estructuras', pEstructuras);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Muros', pMuros);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Entrepisos', pEntrepisos);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Techos', pTechos);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Azoteas', pAzoteas);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Bardas', pBardas);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Aplanados', pAplanados);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Plafones', pPlafones);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Lambrines', pLambrines);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Pisos', pPisos);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Zoclos', pZoclos);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Escaleras', pEscaleras);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Pintura', pPintura);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'RecubrimientosEspeciales', pRecubrimientosEspeciales);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'PuertasInteriores', pPuertasInteriores);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Guardaropas', pGuardaropas);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'MueblesEmpotradosFijos', pMueblesEmpotradosFijos);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'MueblesBaño', pMueblesBaño);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'RamaleosHidraulicos', pRamaleosHidraulicos);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'RamaleosSanitarios', pRamaleosSanitarios);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'InstalacionesElectricas', pInstalacionesElectricas);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Herreria', pHerreria);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Ventaneria', pVentaneria);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Vidrieria', pVidrieria);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Cerrajeria', pCerrajeria);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Fachadas', pFachadas);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Usuario', pUsuarioOperacion);

        if (datoNoValido == '') {

            BdElementosConstruccion(
                    '\'' + pFolio.trim() + '\'',
                    (pCimientos.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pCimientos.trim() + '\'',

                    (pEstructuras.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pEstructuras.trim() + '\'',
                    (pMuros.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pMuros.trim() + '\'',
                    (pEntrepisos.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pEntrepisos.trim() + '\'',
                    (pTechos.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pTechos.trim() + '\'',
                    (pAzoteas.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pAzoteas.trim() + '\'',
                    (pBardas.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pBardas.trim() + '\'',
                    (pAplanados.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pAplanados.trim() + '\'',
                    (pPlafones.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pPlafones.trim() + '\'',
                    (pLambrines.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pLambrines.trim() + '\'',
                    (pPisos.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pPisos.trim() + '\'',
                    (pZoclos.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pZoclos.trim() + '\'',
                    (pEscaleras.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pEscaleras.trim() + '\'',
                    (pPintura.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pPintura.trim() + '\'',
                    (pRecubrimientosEspeciales.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pRecubrimientosEspeciales.trim() + '\'',

                    (pPuertasInteriores.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pPuertasInteriores.trim() + '\'',
                    (pGuardaropas.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pGuardaropas.trim() + '\'',
                    (pMueblesEmpotradosFijos.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pMueblesEmpotradosFijos.trim() + '\'',
                    (pMueblesBaño.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pMueblesBaño.trim() + '\'',
                    (pRamaleosHidraulicos.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pRamaleosHidraulicos.trim() + '\'',
                    (pRamaleosSanitarios.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pRamaleosSanitarios.trim() + '\'',
                    (pInstalacionesElectricas.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pInstalacionesElectricas.trim() + '\'',
                    (pHerreria.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pHerreria.trim() + '\'',
                    (pVentaneria.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pVentaneria.trim() + '\'',
                    (pVidrieria.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pVidrieria.trim() + '\'',
                    (pCerrajeria.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pCerrajeria.trim() + '\'',
                    (pFachadas.toUpperCase()  ==  'NULL')  ?  null  : '\'' + pFachadas.trim() + '\'',
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

                })
                .catch((err) => {

                    logger.error(ruta + 'ERROR: ' + err);
                    res.json({
                        ok: false,
                        mensaje: err.message,
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
 * Consulta ElementosConstruccion
 ****************************************************************************/
app.get('/consultaElementosConstruccion', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaElementosConstruccion';
        logger.info(etiquetaLOG);

        // Del token
        let pUsuario = req.usuario.usuario;

        let pFolio = req.query.Folio;

        let numReg = 0;
        let resultadoDat;
        let tablaResultado = [];

        let datoNoValido = '';
        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pFolio}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);

        if (datoNoValido == '') {
            BdConsultaElementosConstruccion(pFolio, pUsuario)
                .then(result => {
                    numReg = result.length;
                    resultadoDat = result;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el folio indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    if (numReg > 0) {

                        for (var i = 0, l = numReg; i < l; i++) {
                            var elemRes = {

                                cimientos: resultadoDat[i].cimientos,
                                estructuras: resultadoDat[i].estructuras,
                                muros: resultadoDat[i].muros,
                                entrepisos: resultadoDat[i].entrepisos,
                                techos: resultadoDat[i].techos,
                                azoteas: resultadoDat[i].azoteas,
                                bardas: resultadoDat[i].bardas,
                                aplanados: resultadoDat[i].aplanados,
                                plafones: resultadoDat[i].plafones,
                                lambrines: resultadoDat[i].lambrines,
                                pisos: resultadoDat[i].pisos,
                                zoclos: resultadoDat[i].zoclos,
                                escaleras: resultadoDat[i].escaleras,
                                pintura: resultadoDat[i].pintura,
                                recubrimientosEspeciales: resultadoDat[i].recubrimientosespeciales,
                                puertasInteriores: resultadoDat[i].puertasinteriores,
                                guardaropas: resultadoDat[i].guardaropas,
                                mueblesEmpotradosFijos: resultadoDat[i].mueblesempotradosfijos,
                                mueblesBaño: resultadoDat[i].mueblesbaño,
                                ramaleosHidraulicos: resultadoDat[i].ramaleoshidraulicos,
                                ramaleosSanitarios: resultadoDat[i].ramaleossanitarios,
                                instalacionesElectricas: resultadoDat[i].instalacioneselectricas,
                                herreria: resultadoDat[i].herreria,
                                ventaneria: resultadoDat[i].ventaneria,
                                vidrieria: resultadoDat[i].vidrieria,
                                cerrajeria: resultadoDat[i].cerrajeria,
                                fachadas: resultadoDat[i].fachadas

                            }
                            tablaResultado.push(elemRes);
                        }

                    }

                    res.json({
                        ok: (numReg > 0) ? true : false,
                        mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información',
                        elementosConstrucion: (numReg > 0) ? tablaResultado : [],
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
 * Listas para las tablas INSTALACIONES ESPECIALES, ELEMENTOS ACCESORIOS Y OBRAS COMPLEMENTARIAS ( Privativas/Comunes )
 ****************************************************************************/
app.get('/listaElementosConstruc', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: listaElementosConstruc';
        logger.info(etiquetaLOG);

        let pCatalogo = req.query.Catalogo;
        let pTipoInstalEsp = req.query.TipoInstalEsp;
        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let numReg = 0;
        let listaDat;
        let listaCat = [];

        let datoNoValido = '';
        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pCatalogo}, ${pTipoInstalEsp}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Catalogo', pCatalogo);

        if (pTipoInstalEsp == undefined && pCatalogo == 'INSTALACIONESESPE') {
            datoNoValido = datoNoValido + ' Debe indicar el dato TipoInstalEsp';
        }

        if (datoNoValido == '') {

            BdListaElementosConstruc(pCatalogo, pTipoInstalEsp, pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    if (numReg == 0) {
                        res.json({
                            ok: false,
                            mensaje: 'No se encontró información de la lista indicada',
                            lista: []
                        });

                    } else {

                        listaDat = result;
                        // Se ajustan salidas para utilizar solo un método
                        for (var i = 0, l = listaDat.length; i < l; i++) {
                            var elemento = {
                                clave: listaDat[i].clave,
                                descripcion: listaDat[i].descripcion
                            }
                            listaCat.push(elemento);
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

/*******************************************************************************************************************************
 * 
 */


/***********************************************************************************************************************************
 * Registro ElementosConstruccInstala para contrucciones Privativas
 ***********************************************************************************************************************************/
app.post('/elementosInstalacionPriva', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: elementosConstruccInstala';

        logger.info(etiquetaLOG);

        let body = req.body;

        let pIdElemConstruccInstala = body.IdElemConstruccInstala;
        let pFolio = body.Folio;
        let pTipoConstruccion = 'P';
        let pTipoInstal = body.TipoInstal;
        let pIdInstalacion = body.IdInstalacion;

        let pEdad = body.Edad;
        let pCantidadMaterial = body.CantidadMaterial;
        let pCostoUnitario = body.CostoUnitario;

        let pIdUnidadMedida = body.IdUnidadMedida;

        let pUsuarioOperacion = req.usuario.idUsuario;

        let datoNoValido = '';

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA -->  ${pIdElemConstruccInstala}, ${pFolio}, ${pTipoInstal}, ${pIdInstalacion}, ${pEdad}, ${pCantidadMaterial}, ${pCostoUnitario}, ${pIdUnidadMedida}, ${pUsuarioOperacion}`);

        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'R', 'IdElemConstruccInstala', pIdElemConstruccInstala);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'S', 'Folio',  pFolio);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'S', 'TipoInstal', pTipoInstal);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'S', 'IdInstalacion', pIdInstalacion);

        datoNoValido  =  datoNoValido  +  validar.datoValido(false,  'N', 'Edad', pEdad);
        datoNoValido  =  datoNoValido  +  validar.datoValido(false,  'N', 'CantidadMaterial', pCantidadMaterial);
        datoNoValido  =  datoNoValido  +  validar.datoValido(false,  'N', 'CostoUnitario', pCostoUnitario);

        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'S', 'IdUnidadMedida', pIdUnidadMedida);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Usuario', pUsuarioOperacion);

        if (datoNoValido == '') {

            BdElementosConstruccInstala(

                    pIdElemConstruccInstala,
                    pFolio,
                    pTipoConstruccion,
                    pTipoInstal,
                    pIdInstalacion,

                    (pEdad == undefined) ? null : pEdad,
                    (pCantidadMaterial == undefined) ? null : pCantidadMaterial,
                    (pCostoUnitario == undefined) ? null : pCostoUnitario,

                    null,
                    pIdUnidadMedida,

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

                })
                .catch((err) => {

                    logger.error(ruta + 'ERROR: ' + err);
                    res.json({
                        ok: false,
                        mensaje: err.message,
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

/*******************************************************************************************************************************************
 * Consulta elementosConstruccInstala para contrucciones Privativas
 ******************************************************************************************************************************************/
app.get('/consultaElementosInstalacionPriva', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaElementosInstalacionPriva';
        logger.info(etiquetaLOG);

        let pFolio = req.query.Folio;
        let pTipoConstruccion = 'P';
        let pTipoInstalEsp = req.query.TipoInstalEsp;
        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let numReg = 0;
        let resultadoDat;
        let tablaResultado = [];


        let datoNoValido = '';
        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pFolio}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'TipoInstalEsp', pTipoInstalEsp);

        if (datoNoValido == '') {
            BdConsultaElementosConstruccInstala(pFolio, pTipoConstruccion, pTipoInstalEsp, pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;
                    resultadoDat = result;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el folio indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    if (numReg > 0) {

                        for (var i = 0, l = numReg; i < l; i++) {
                            var elemRes = {

                                idElemConstruccInstala: resultadoDat[i].idelemconstruccinstala,
                                folio: resultadoDat[i].folio,
                                tipoConstruccion: resultadoDat[i].tipoconstruccion,
                                tipoInstalEsp: resultadoDat[i].tipoinstalesp,
                                idInstalacionEspecial: resultadoDat[i].idinstalacionespecial,
                                edad: resultadoDat[i].edad,
                                cantidadMaterial: resultadoDat[i].cantidadmaterial,
                                costoUnitario: resultadoDat[i].costounitario,
                                indiviso: resultadoDat[i].indiviso,
                                demptoF: resultadoDat[i].demptof,
                                vurnF: resultadoDat[i].vurnf,
                                totalF: resultadoDat[i].totalf,
                                idUnidadMedida: resultadoDat[i].idunidadmedida,
                                vpF: resultadoDat[i].vpf,
                                vpEdadF: resultadoDat[i].vpedadf

                            }
                            tablaResultado.push(elemRes);
                        }

                    }
                    /**
                     * 
                     *                                 totalIndivisoF:resultadoDat[i].totalindivisof,
                                                    promSumaComunF:resultadoDat[i].promsumacomunf,
                                                    promTotalComunF:resultadoDat[i].promtotalcomunf,
                                                    regComunF:resultadoDat[i].regcomunf,
                                                    sumaComunF:resultadoDat[i].sumacomunf,
                                                    totalComunF:resultadoDat[i].totalcomunf,
                                                    sumaComunIndivF:resultadoDat[i].sumacomunindivf,
                                                    totalComunIndivF:resultadoDat[i].totalcomunindivf

                     * 
                     */



                    res.json({
                        ok: (numReg > 0) ? true : false,
                        mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información',
                        instalaciones: (numReg > 0) ? tablaResultado : [],
                        sumaTotalF: (numReg > 0) ? resultadoDat[0].sumaprivf : [],
                        totaTodasF: (numReg > 0) ? resultadoDat[0].totalprivaf : [],
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



/********************************************************************************************************************************
 * 
 */



/****************************************************************************
/***    L L A M A D O S   A    B A S E     D E    D A T O S    **************
/****************************************************************************/
/**************   R e g i s t r o  InmuebleConstrucciones  ******************************************/

function BdElementosConstruccion(pFolio, pCimientos, pEstructuras, pMuros, pEntrepisos, pTechos, pAzoteas,
    pBardas, pAplanados, pPlafones, pLambrines, pPisos, pZoclos,
    pEscaleras, pPintura, pRecubrimientosEspeciales, pPuertasInteriores,
    pGuardaropas, pMueblesEmpotradosFijos, pMueblesBaño, pRamaleosHidraulicos,
    pRamaleosSanitarios, pInstalacionesElectricas, pHerreria, pVentaneria,
    pVidrieria, pCerrajeria, pFachadas, pUsuarioOperacion) {

    let etiquetaLOG = ruta + '[Usuario: ' + pUsuarioOperacion + '] METODO: BdElementosConstruccion ';

    try {
        logger.info(etiquetaLOG);

        const client = new Pool(configD);

        logger.info(etiquetaLOG + 'SELECT * FROM fElementosConstruccion (pFolio, pCimientos, pEstructuras, pMuros, pEntrepisos, pTechos, pAzoteas, ' +
            'pBardas, pAplanados, pPlafones, pLambrines, pPisos, pZoclos, pEscaleras, pPintura, pRecubrimientosEspeciales, ' +
            'pPuertasInteriores, pGuardaropas, pMueblesEmpotradosFijos, pMueblesBaño, pRamaleosHidraulicos, pRamaleosSanitarios, ' +
            'pInstalacionesElectricas, pHerreria, pVentaneria, pVidrieria, pCerrajeria, pFachadas, pUsuarioOperacion)');

        let sQuery = 'SELECT * FROM fElementosConstruccion(' +
            pFolio + ',' +
            pCimientos + ',' + pEstructuras + ',' + pMuros + ',' + pEntrepisos + ',' + pTechos + ',' + pAzoteas + ',' +
            pBardas + ',' + pAplanados + ',' + pPlafones + ',' + pLambrines + ',' + pPisos + ',' + pZoclos + ',' +
            pEscaleras + ',' + pPintura + ',' + pRecubrimientosEspeciales + ',' + pPuertasInteriores + ',' +
            pGuardaropas + ',' + pMueblesEmpotradosFijos + ',' + pMueblesBaño + ',' + pRamaleosHidraulicos + ',' +
            pRamaleosSanitarios + ',' + pInstalacionesElectricas + ',' + pHerreria + ',' + pVentaneria + ',' +
            pVidrieria + ',' + pCerrajeria + ',' + pFachadas + ',' +
            pUsuarioOperacion + ');';

        logger.info(`${ etiquetaLOG }` + sQuery);

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
        throw (`Se presentó un error en BdElementosConstruccion: ${err}`);
    }
}

/**************   C o n s u l t a   ******************************************/
function BdConsultaElementosConstruccion(pFolio, pUsuarioOperacion) {
    let etiquetaLOG = ruta + '[Usuario: ' + pUsuarioOperacion + '] METODO: BdConsultaElementosConstruccion ';

    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultaElemConstrucc ('${pFolio}');`;

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
        throw (`Se presentó un error en BdConsultaElementosConstruccion: ${err}`);
    }
}

/**************   Llenado de combos   ******************************************/
function BdListaElementosConstruc(pCatalogo, pTipoInstalEsp, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdListaElementosConstruc `;
    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fCatElementosConstruccion('${pCatalogo}','${pTipoInstalEsp}');`;

        logger.info(`${ etiquetaLOG }` + sQuery);

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
        throw (`Se presentó un error en BdListaElementosConstruc: ${err}`);
    }
}

/**************   R e g i s t r o  ElementosConstruccInstala  ******************************************/

function BdElementosConstruccInstala(
    pIdElemConstruccInstala,
    pFolio,
    pTipoConstruccion,
    pTipoInstalEsp,
    pIdInstalacionEspecial,
    pEdad,
    pCantidadMaterial,
    pCostoUnitario,
    pIndiviso,
    pIdUnidadMedida,
    pUsuarioOperacion) {

    let etiquetaLOG = ruta + '[Usuario: ' + pUsuarioOperacion + '] METODO: BdInmuebleConstrucciones ';

    try {
        logger.info(etiquetaLOG);

        const client = new Pool(configD);

        logger.info(etiquetaLOG + 'SELECT * FROM fElementosConstruccInstala (pIdElemConstruccInstala, pFolio, pTipoConstruccion, pTipoInstalEsp, pIdInstalacionEspecial, pEdad, pCantidadMaterial, pCostoUnitario, pIndiviso, pIdUnidadMedida, pUsuarioOperacion);');

        let sQuery = 'SELECT * FROM fElementosConstruccInstala(' +
            pIdElemConstruccInstala + ', ' +
            ' \'' + pFolio + '\', ' +
            ' \'' + pTipoConstruccion + '\', ' +
            ' \'' + pTipoInstalEsp + '\', ' +
            '(\'' + pIdInstalacionEspecial + '\'::char(4)),' +

            '(' + pEdad + '::smallint),' +
            '(' + pCantidadMaterial + '::smallint),' +
            '(' + pCostoUnitario + '::decimal),' +
            '(' + pIndiviso + '::decimal),' +
            ' \'' + pIdUnidadMedida + '\', ' +

            pUsuarioOperacion + ');';

        logger.info(`${ etiquetaLOG }` + sQuery);

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
        throw (`Se presentó un error en BdInmuebleConstrucciones: ${err}`);
    }
}

/**************   C o n s u l t a  ElementosConstruccInstala  ******************************************/

function BdConsultaElementosConstruccInstala(pFolio, pTipoConstruccion, pTipoInstalEsp, pUsuarioOperacion) {
    let etiquetaLOG = ruta + '[Usuario: ' + pUsuarioOperacion + '] METODO: BdConsultaElementosConstruccInstala ';

    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultaElementosConstruccInstala ('${pFolio}', '${pTipoConstruccion}', '${pTipoInstalEsp}');`;

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
        throw (`Se presentó un error en BdConsultaElementosConstruccInstala: ${err}`);
    }
}


module.exports = app;