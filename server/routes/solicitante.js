const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

const { Pool } = require('pg');

const logger = require('../config/log');
const validar = require('../utilerias/generales');
const ruta = ' [solicitante.js] ';
//--------------------------------------------------------------------------/
//   Solicitante
//--------------------------------------------------------------------------/

/****************************************************************************
 * Registro
 ****************************************************************************/
app.post('/solicitante', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: solicitante';

        logger.info(etiquetaLOG);

        let body = req.body;

        let pFolio = body.Folio;

        let pNombre =  body.Nombre;
        let pPaterno =  body.Paterno;
        let pMaterno =  body.Materno;

        let pTipoPersona = body.TipoPersona;
        let pRFC = body.RFC;
        let pCURP = body.CURP;

        let pTelefonoFijo  =  body.TelefonoFijo;
        let pExtTelefono  =  body.ExtTelefono;
        let pTelefonoMovil  =  body.TelefonoMovil;

        let pCP = body.CP;
        let pIdEntidad = body.IdEntidad;
        let pIdMunicipio = body.IdMunicipio;
        let pIdAsentamiento = body.IdAsentamiento;

        let pCalle = body.Calle;
        let pExterior = body.Exterior;
        let pInterior = body.Interior;
        let pManzana = body.Manzana;
        let pLote = body.Lote;
        let pEdificio = body.Edificio;

        let pUsuarioOperacion = req.usuario.idUsuario;

        let datoNoValido = '';

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA -->  ${pFolio}, ${pNombre}, ${pPaterno}, ${pMaterno}, ${pTipoPersona}, ${pRFC}, ${pCURP}, ${pTelefonoFijo }, ${pExtTelefono }, ${pTelefonoMovil }, ${pCP}, ${pIdEntidad}, ${pIdMunicipio}, ${pIdAsentamiento}, ${pCalle},${pExterior}, ${pInterior}, ${pManzana}, ${pLote}, ${pEdificio}, ${pUsuarioOperacion}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Nombre', pNombre);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Paterno', pPaterno);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Materno', pMaterno);

        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Tipo Persona', pTipoPersona);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'RFC', pRFC);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'CURP', pCURP);

        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Telefono Fijo', pTelefonoFijo);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Ext Telefono', pExtTelefono);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Telefono Movil', pTelefonoMovil);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'CP', pCP);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'IdEntidad', pIdEntidad);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'IdMunicipio', pIdMunicipio);
        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'IdAsentamiento', pIdAsentamiento);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Calle', pCalle);
        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Exterior', pExterior);

        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Interior', pInterior);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Manzana', pManzana);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Lote', pLote);
        datoNoValido = datoNoValido + validar.datoValido(false, 'S', 'Edificio', pEdificio);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Usuario', pUsuarioOperacion);

        if (datoNoValido == '') {

            BdSolicitante(
                    '\'' + pFolio.trim() + '\'',
                    '\'' + pNombre.trim() + '\'',
                    '\'' + pPaterno.trim() + '\'',
                    (pMaterno.toUpperCase() == 'NULL') ? null : '\'' + pMaterno.trim() + '\'',
                    (pTipoPersona.toUpperCase() == 'NULL') ? null : '\'' + pTipoPersona.trim() + '\'',
                    (pRFC.toUpperCase() == 'NULL') ? null : '\'' + pRFC.trim() + '\'',
                    (pCURP.toUpperCase() == 'NULL') ? null : '\'' + pCURP.trim() + '\'',

                    (pTelefonoFijo.toUpperCase() == 'NULL') ? null : '\'' + pTelefonoFijo.trim() + '\'',
                    (pExtTelefono.toUpperCase() == 'NULL') ? null : '\'' + pExtTelefono.trim() + '\'',
                    (pTelefonoMovil.toUpperCase() == 'NULL') ? null : '\'' + pTelefonoMovil.trim() + '\'',
                    '\'' + pCP.trim() + '\'',
                    '\'' + pIdEntidad.trim() + '\'',
                    '\'' + pIdMunicipio.trim() + '\'',
                    '\'' + pIdAsentamiento.trim() + '\'',
                    '\'' + pCalle.trim() + '\'',
                    '\'' + pExterior.trim() + '\'',

                    (pInterior.toUpperCase() == 'NULL') ? null : '\'' + pInterior.trim() + '\'',
                    (pManzana.toUpperCase() == 'NULL') ? null : '\'' + pManzana.trim() + '\'',
                    (pLote.toUpperCase() == 'NULL') ? null : '\'' + pLote.trim() + '\'',
                    (pEdificio.toUpperCase() == 'NULL') ? null : '\'' + pEdificio.trim() + '\'',

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
app.get('/consultaSolicitante', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultasolicitante';
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
            BdConsultaSolicitante(pFolio.trim(), pUsuarioOperacion)
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
                            nombre: resultadoDat[0].nombre,
                            paterno: resultadoDat[0].paterno,
                            materno: resultadoDat[0].materno,
                            tipoPersona: resultadoDat[0].tipopersona,
                            rfc: resultadoDat[0].rfc,
                            curp: resultadoDat[0].curp,
                            telefonoFijo: resultadoDat[0].telefonofijo,
                            extTelefono: resultadoDat[0].exttelefono,
                            telefonoMovil: resultadoDat[0].telefonomovil,
                            cp: resultadoDat[0].cp,
                            idEntidad: resultadoDat[0].identidad,
                            entidad: resultadoDat[0].entidad,
                            idMunicipio: resultadoDat[0].idmunicipio,
                            municipio: resultadoDat[0].municipio,
                            calle: resultadoDat[0].calle,
                            exterior: resultadoDat[0].exterior,
                            interior: resultadoDat[0].interior,
                            manzana: resultadoDat[0].manzana,
                            lote: resultadoDat[0].lote,
                            edificio: resultadoDat[0].edificio,
                            listaasentamientos: asentamientos
                        }
                    }

                    res.json({
                        ok: (numReg > 0) ? true : false,
                        mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información',
                        solicitante: (numReg > 0) ? elemRes : [],
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
function BdSolicitante(pFolio, pNombre, pPaterno, pMaterno, pTipoPersona, pRFC, pCURP,
    pTelefonoFijo, pExtTelefono, pTelefonoMovil,
    pCP, pIdEntidad, pIdMunicipio, pIdAsentamiento, pCalle, pExterior,
    pInterior, pManzana, pLote, pEdificio, pUsuarioOperacion) {

    let etiquetaLOG = ruta + '[Usuario: ' + pUsuarioOperacion + '] METODO: BdSolicitante ';

    try {
        logger.info(etiquetaLOG);

        const client = new Pool(configD);

        logger.info(etiquetaLOG + 'SELECT * FROM fsolicitante (pFolio, pNombre, pPaterno, pMaterno, pTipoPersona, pRFC, pCURP, pTelefonoFijo, pExtTelefono, pTelefonoMovil, pCP, pIdEntidad, pIdMunicipio, pIdAsentamiento, pCalle, pExterior, pInterior, pManzana, pLote, pEdificio, pUsuarioOperacion);');

        let sQuery = `SELECT * FROM fsolicitante (${pFolio}, ${pNombre}, ${pPaterno}, ${pMaterno}, ${pTipoPersona}, ${pRFC}, ${pCURP}, ${pTelefonoFijo}, ${pExtTelefono}, ${pTelefonoMovil}, ${pCP}, ${pIdEntidad}, ${pIdMunicipio}, ${pIdAsentamiento}, ${pCalle}, ${pExterior}, ${pInterior}, ${pManzana}, ${pLote}, ${pEdificio}, ${pUsuarioOperacion});`;

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
        throw (`Se presentó un error en BdSolicitante: ${err}`);
    }
}
/**************   C o n s u l t a   ******************************************/
function BdConsultaSolicitante(pFolio, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdConsultasolicitante `;
    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultasolicitante('${pFolio}');`;

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
        throw (`Se presentó un error en BdConsultaSolicitante: ${err}`);
    }
}

module.exports = app;