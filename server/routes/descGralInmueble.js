const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

const { Pool } = require('pg');

const logger = require('../config/log');
const validar = require('../utilerias/generales');
const { exceptions } = require('../config/log');
const ruta = ' [descGralInmueble.js] ';
//--------------------------------------------------------------------------/
//   Descripción General del Inmueble
//--------------------------------------------------------------------------/

/****************************************************************************
 * Listas para la tabla de Descripción General del Inmueble
 ****************************************************************************/
app.get('/listaDesGralInmueble', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: listaDesGralInmueble';
        logger.info(etiquetaLOG);

        let pCatalogo = req.query.Catalogo;
        let pTipoCostruc = req.query.TipoConstruccion;
        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let numReg = 0;
        let listaDat;
        let listaCat = [];

        let datoNoValido = '';
        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pCatalogo}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Catalogo', pCatalogo);

        if (pTipoCostruc == undefined && pCatalogo == 'TIPOCONSTRUCCION') {
            datoNoValido = datoNoValido + ' Debe indicar el dato TipoCostruccion';
        }

        if (datoNoValido == '') {

            BdListaDesGralInmueble(pCatalogo, pTipoCostruc, pUsuarioOperacion)
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
                        if (pCatalogo == 'PARTIDASCONSERVACION' || pCatalogo == 'TIPOCONSTRUCCION' || pCatalogo == 'ESTADOCONSERVACION') {
                            for (var i = 0, l = listaDat.length; i < l; i++) {
                                var elemento = {
                                    clave: listaDat[i].clave,
                                    descripcion: listaDat[i].descripcion
                                }
                                listaCat.push(elemento);
                            }

                        } else if (pCatalogo == 'CLASECONSTRUCCION' || pCatalogo == 'USOCONSTRUCCION' || pCatalogo == 'RANGONIVEL') {

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
 * Registro InmuebleConstrucciones
 ****************************************************************************/
app.post('/inmuebleConstrucciones', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: inmuebleConstrucciones';

        logger.info(etiquetaLOG);

        let body = req.body;

        let pIdInmConstruccion = body.IdInmConstruccion;
        let pFolio = body.Folio;
        let pTipoConstruccion = body.TipoConstruccion;
        let pIdTipoConstruccion = body.IdTipoConstruccion;
        let pSuperficie = body.Superficie;
        let pDescripcionModulo = body.DescripcionModulo;
        let pNivelTipo = body.NivelTipo;
        let pIdUsoConstruccion = body.IdUsoConstruccion;
        let pIdRangoNivelTGDF = body.IdRangoNivelTGDF;
        let pEdad = body.Edad;
        let pIdEstadoConservacion = body.IdEstadoConservacion;
        let pIndiviso = body.Indiviso;

        let pUsuarioOperacion = req.usuario.idUsuario;

        let datoNoValido = '';

        let resultadoDat;
        let elemRes;

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA -->  ${pIdInmConstruccion}, ${pFolio}, ${pTipoConstruccion}, ${pIdTipoConstruccion}, ${pSuperficie}, ${pDescripcionModulo}, ${pNivelTipo}, ${pIdUsoConstruccion}, ${pIdRangoNivelTGDF}, ${pEdad}, ${pIdEstadoConservacion}, ${pIndiviso}, ${pUsuarioOperacion}`);

        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'R', 'Id Inmueble Construccion',  pIdInmConstruccion);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'S', 'Folio',  pFolio);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'S', 'Tipo Construccion',  pTipoConstruccion);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'N', 'Id Tipo Construccion',  pIdTipoConstruccion);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'N', 'Superficie',  pSuperficie);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'S', 'Descripción Módulo',  pDescripcionModulo);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'N', 'Nivel Tipo',  pNivelTipo);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'S', 'Id Uso Construcción',  pIdUsoConstruccion);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'S', 'Id Rango Nivel TGDF',  pIdRangoNivelTGDF);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'N', 'Edad',  pEdad);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'N', 'Id Estado Conservación',  pIdEstadoConservacion);

        if ( pTipoConstruccion == 'C') {
            datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'N', 'Indiviso', pIndiviso);
        } else {
            pIndiviso = 0;
        }

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Usuario', pUsuarioOperacion);

        if (datoNoValido == '') {

            BdInmuebleConstrucciones(

                    pIdInmConstruccion,
                    pFolio,
                    pTipoConstruccion,
                    pIdTipoConstruccion,
                    pSuperficie,
                    pDescripcionModulo,
                    pNivelTipo,
                    pIdUsoConstruccion,
                    pIdRangoNivelTGDF,
                    pEdad,
                    pIdEstadoConservacion,
                    pIndiviso,
                    null,
                    null,
                    pUsuarioOperacion

                )
                .then(result => {

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${JSON.stringify(result[0].resultado)}, mensaje = ${JSON.stringify(result[0].mensaje)}, codigo = ${(result[0].resultado) ? codRespuesta.exito : codRespuesta.error}`);

                    if ((result[0].resultado)) {

                        resultadoDat = result;

                        elemRes = {
                            idInmConstruccion: resultadoDat[0].idinmconstruccion,
                            folio: resultadoDat[0].folio,
                            tipoConstruccion: resultadoDat[0].tipoconstruccion,
                            idTipoConstruccion: resultadoDat[0].idtipoconstruccion,
                            superficie: resultadoDat[0].superficie,
                            descripcionModulo: resultadoDat[0].descripcionmodulo,
                            nivelTipo: resultadoDat[0].niveltipo,
                            idUsoConstruccion: resultadoDat[0].idusoconstruccion,
                            idRangoNivelTGDF: resultadoDat[0].idrangoniveltgdf,
                            claseF: resultadoDat[0].clasef,
                            puntajeF: resultadoDat[0].puntajef,
                            edad: resultadoDat[0].edad,
                            idEstadoConservacion: resultadoDat[0].idestadoconservacion,
                            indiviso: resultadoDat[0].indiviso,
                            idClaseConstruccionF: resultadoDat[0].idclaseconstruccionf,
                            estadoGralConservacionF: resultadoDat[0].estadogralconservacionf,
                            vidaMinimaRemanenteF: resultadoDat[0].vidaminimaremanentef,
                            indiceCostosRemanenteF: resultadoDat[0].indicecostosremanentef,
                            totalPuntosAjustadosF: resultadoDat[0].totalpuntosajustadosf,
                            claseSM: resultadoDat[0].clasesm,
                            puntajeSM: resultadoDat[0].puntajesm
                        }
                    } else {
                        elemRes = [];
                    }

                    res.json({
                        ok: result[0].resultado,
                        mensaje: result[0].mensaje,
                        registro: elemRes,
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
 * Consulta InmuebleConstrucciones
 ****************************************************************************/
app.get('/consultaInmuebleConstruc', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaInmuebleConstruc';
        logger.info(etiquetaLOG);

        let pFolio = req.query.Folio;
        let pTipoConstruccion = req.query.TipoConstruccion;
        // Del token
        let pUsuarioOperacion = req.usuario.idUsuario;

        let numReg = 0;
        let resultadoDat;
        let tablaResultado = [];


        let datoNoValido = '';
        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA --> ${pFolio}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Tipo Construcción', pTipoConstruccion);

        if (datoNoValido == '') {
            BdConsultaInmuebleConstruc(pFolio, pTipoConstruccion, pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;
                    resultadoDat = result;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el folio indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    if (numReg > 0) {

                        for (var i = 0, l = numReg; i < l; i++) {
                            var elemRes = {

                                idInmConstruccion: resultadoDat[i].idinmconstruccion,
                                folio: resultadoDat[i].folio,
                                tipoConstruccion: resultadoDat[i].tipoconstruccion,
                                idTipoConstruccion: resultadoDat[i].idtipoconstruccion,
                                superficie: resultadoDat[i].superficie,
                                descripcionModulo: resultadoDat[i].descripcionmodulo,
                                nivelTipo: resultadoDat[i].niveltipo,
                                idUsoConstruccion: resultadoDat[i].idusoconstruccion,
                                idRangoNivelTGDF: resultadoDat[i].idrangoniveltgdf,
                                claseF: resultadoDat[i].clasef,
                                puntajeF: resultadoDat[i].puntajef,
                                edad: resultadoDat[i].edad,
                                idEstadoConservacion: resultadoDat[i].idestadoconservacion,
                                indiviso: resultadoDat[i].indiviso,
                                idClaseConstruccionF: resultadoDat[i].idclaseconstruccionf,
                                estadoGralConservacionF: resultadoDat[i].estadogralconservacionf,
                                vidaMinimaRemanenteF: resultadoDat[i].vidaminimaremanentef,
                                indiceCostosRemanenteF: resultadoDat[i].indicecostosremanentef,
                                totalPuntosAjustadosF: resultadoDat[i].totalpuntosajustadosf,
                                claseSM: resultadoDat[i].clasesm,
                                puntajeSM: resultadoDat[i].puntajesm
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
 * Registro los datos para le sección Sin Matrices
 ****************************************************************************/
app.post('/sinMatrices', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: inmuebleConstrucciones';

        logger.info(etiquetaLOG);

        let body = req.body;

        let pIdInmConstruccion = body.IdInmConstruccion;
        let pFolio = body.Folio;
        let pTipoConstruccion = body.TipoConstruccion;

        let pClaseSM = body.ClaseSM;
        let pPuntajeSM = body.PuntajeSM;

        let pIdTipoConstruccion = 0;
        let pSuperficie = 0;
        let pDescripcionModulo = '';
        let pNivelTipo = 0;
        let pIdUsoConstruccion = '';
        let pIdRangoNivelTGDF = '';
        let pEdad = 0;
        let pIdEstadoConservacion = 0;
        let pIndiviso = 0;

        let pUsuarioOperacion = req.usuario.idUsuario;

        let datoNoValido = '';

        let resultadoDat;
        let elemRes;

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA -->  ${pIdInmConstruccion}, ${pFolio}, ${pTipoConstruccion}, ${pClaseSM}, ${pPuntajeSM}, ${pUsuarioOperacion}`);


        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'R', 'Id Inmueble Construccion',  pIdInmConstruccion);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'S', 'Folio',  pFolio);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true,  'S', 'Tipo Construccion',  pTipoConstruccion);

        datoNoValido  =  datoNoValido  +  validar.datoValido(false,  'S', 'Clase Sin Matriz', pClaseSM);
        datoNoValido  =  datoNoValido  +  validar.datoValido(false,  'N', 'Puntaje Sin Matriz', pPuntajeSM);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Usuario', pUsuarioOperacion);

        if (datoNoValido == '') {

            BdInmuebleConstrucciones(

                    pIdInmConstruccion,
                    pFolio,
                    pTipoConstruccion,
                    pIdTipoConstruccion,
                    pSuperficie,
                    pDescripcionModulo,
                    pNivelTipo,
                    pIdUsoConstruccion,
                    pIdRangoNivelTGDF,
                    pEdad,
                    pIdEstadoConservacion,
                    pIndiviso,
                    (pClaseSM == 'NULL' || pClaseSM == 'null' || pClaseSM == '') ? null : pClaseSM,
                    (pPuntajeSM == 'NULL' || pPuntajeSM == 'null' || pPuntajeSM == '' || pPuntajeSM == 0) ? null : pPuntajeSM,


                    pUsuarioOperacion

                )
                .then(result => {

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${JSON.stringify(result[0].resultado)}, mensaje = ${JSON.stringify(result[0].mensaje)}, codigo = ${(result[0].resultado) ? codRespuesta.exito : codRespuesta.error}`);

                    if ((result[0].resultado)) {

                        resultadoDat = result;

                        elemRes = {
                            idInmConstruccion: resultadoDat[0].idinmconstruccion,
                            folio: resultadoDat[0].folio,
                            tipoConstruccion: resultadoDat[0].tipoconstruccion,
                            idTipoConstruccion: resultadoDat[0].idtipoconstruccion,
                            superficie: resultadoDat[0].superficie,
                            descripcionModulo: resultadoDat[0].descripcionmodulo,
                            nivelTipo: resultadoDat[0].niveltipo,
                            idUsoConstruccion: resultadoDat[0].idusoconstruccion,
                            idRangoNivelTGDF: resultadoDat[0].idrangoniveltgdf,
                            claseF: resultadoDat[0].clasef,
                            puntajeF: resultadoDat[0].puntajef,
                            edad: resultadoDat[0].edad,
                            idEstadoConservacion: resultadoDat[0].idestadoconservacion,
                            indiviso: resultadoDat[0].indiviso,
                            idClaseConstruccionF: resultadoDat[0].idclaseconstruccionf,
                            estadoGralConservacionF: resultadoDat[0].estadogralconservacionf,
                            vidaMinimaRemanenteF: resultadoDat[0].vidaminimaremanentef,
                            indiceCostosRemanenteF: resultadoDat[0].indicecostosremanentef,
                            totalPuntosAjustadosF: resultadoDat[0].totalpuntosajustadosf,
                            claseSM: resultadoDat[0].clasesm,
                            puntajeSM: resultadoDat[0].puntajesm
                        }
                    } else {
                        elemRes = [];
                    }

                    res.json({
                        ok: result[0].resultado,
                        mensaje: result[0].mensaje,
                        registro: elemRes,
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
/***    L L A M A D O S   A    B A S E     D E    D A T O S    **************
/****************************************************************************/
/**************   Llenado de combos   ******************************************/
function BdListaDesGralInmueble(pCatalogo, pTipoCostruc, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdListaDesGralInmueble `;
    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fCatDesGralInmueble('${pCatalogo}','${pTipoCostruc}');`;

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
        throw (`Se presentó un error en BdListaDesGralInmueble: ${err}`);
    }
}

/**************   R e g i s t r o  InmuebleConstrucciones  ******************************************/
function BdInmuebleConstrucciones(
    pIdInmConstruccion, pFolio,
    pTipoConstruccion, pIdTipoConstruccion,
    pSuperficie, pDescripcionModulo,
    pNivelTipo, pIdUsoConstruccion,
    pIdRangoNivelTGDF, pEdad,
    pIdEstadoConservacion, pIndiviso,
    pClaseSM, pPuntajeSM,
    pUsuarioOperacion) {

    let etiquetaLOG = ruta + '[Usuario: ' + pUsuarioOperacion + '] METODO: BdInmuebleConstrucciones ';

    try {
        logger.info(etiquetaLOG);

        const client = new Pool(configD);

        logger.info(etiquetaLOG + 'SELECT * FROM fInmuebleConstrucciones (pIdInmConstruccion, pFolio, pTipoConstruccion, pIdTipoConstruccion, pSuperficie, pDescripcionModulo, pNivelTipo, pIdUsoConstruccion, pIdRangoNivelTGDF, pEdad, pIdEstadoConservacion, pIndiviso, pUsuarioOperacion);');

        let sQuery = 'SELECT * FROM fInmuebleConstrucciones(' +
            pIdInmConstruccion + ', ' +
            ' \'' + pFolio + '\', ' +
            ' \'' + pTipoConstruccion + '\', ' +
            pIdTipoConstruccion + ', ' +
            '(' + pSuperficie + '::decimal),' +
            ' \'' + pDescripcionModulo + '\', ' +
            '(' + pNivelTipo + '::smallint),' +
            ' \'' + pIdUsoConstruccion + '\', ' +
            ' \'' + pIdRangoNivelTGDF + '\', ' +
            pEdad + ', ' +
            '(' + pIdEstadoConservacion + '::smallint),' +
            '(' + pIndiviso + '::decimal),' +
            ((pClaseSM == null) ? pClaseSM : '\'' + pClaseSM + '\'') + ',' +
            '(' + pPuntajeSM + '::decimal),' +

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

/**************   C o n s u l t a  InmuebleConstrucciones  ******************************************/

function BdConsultaInmuebleConstruc(pFolio, pTipoConstruccion, pUsuarioOperacion) {
    let etiquetaLOG = ruta + '[Usuario: ' + pUsuarioOperacion + '] METODO: BdConsultaInmuebleConstruc ';

    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultaInmuebleConstrucciones ('${pFolio}', '${pTipoConstruccion}');`;

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
        throw (`Se presentó un error en BdConsultaInmuebleConstruc: ${err}`);
    }
}

module.exports = app;