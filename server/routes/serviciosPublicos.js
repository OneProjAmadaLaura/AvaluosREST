const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

const { Pool } = require('pg');

const logger = require('../config/log');
const validar = require('../utilerias/generales');
const ruta = ' [serviciosPublicos.js] ';
//--------------------------------------------------------------------------/
//   Servicios Publicos
//--------------------------------------------------------------------------/

/****************************************************************************
 * Listas para el módulo Servicios Publicos
 ****************************************************************************/

app.get('/listaServPublicos', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: listaServPublicos';
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

            BdListaServiciosPublicos(pCatalogo, pUsuarioOperacion)
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
app.post('/servPublicos', verificaToken, (req, res) => {
    try {

        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: servPublicos';

        logger.info(etiquetaLOG);

        let body = req.body;

        let pFolio = body.Folio;

        pIdAguaPotable = body.IdAguaPotable;
        pIdRecoAguasResiduales = body.IdRecoAguasResiduales;
        pIdDrenajePluvialCalle = body.IdDrenajePluvialCalle;
        pIdDrenajePluvialZona = body.IdDrenajePluvialZona;
        pIdSistMixtoPluvialResidual = body.IdSistMixtoPluvialResidual;
        pIdSuministroElectrico = body.IdSuministroElectrico;
        pIdAcometidaElectricaInmueble = body.IdAcometidaElectricaInmueble;
        pIdAlumbradoPublico = body.IdAlumbradoPublico;
        pIdVialidades = body.IdVialidades;
        pIdBanquetas = body.IdBanquetas;
        pIdGuarniciones = body.IdGuarniciones;
        pIdGasNatural = body.IdGasNatural;
        pIdVigilanciaZona = body.IdVigilanciaZona;

        let pUsuarioOperacion = req.usuario.idUsuario;

        let datoNoValido = '';

        logger.info(`${etiquetaLOG}, PARAMETROS DE ENTRADA -->  ${pFolio}, ${pIdAguaPotable}, ${pIdRecoAguasResiduales}, ${pIdDrenajePluvialCalle}, ${pIdDrenajePluvialZona}, ${pIdSistMixtoPluvialResidual}, ${pIdSuministroElectrico}, ${pIdAcometidaElectricaInmueble}, ${pIdAlumbradoPublico}, ${pIdVialidades}, ${pIdBanquetas}, ${pIdGuarniciones}, ${pIdGasNatural}, ${pIdVigilanciaZona}, ${pUsuarioOperacion}`);

        datoNoValido = datoNoValido + validar.datoValido(true, 'S', 'Folio', pFolio);

        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'N', 'Id Agua Potable ', pIdAguaPotable);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'N', 'Id Recolección Aguas Residuales ', pIdRecoAguasResiduales);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'N', 'Id Drenaje Pluvial Calle ', pIdDrenajePluvialCalle);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'N', 'Id Drenaje Pluvial Zona ', pIdDrenajePluvialZona);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'N', 'Id SistMixto Pluvial Residual ', pIdSistMixtoPluvialResidual);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'N', 'Id Suministro Electrico ', pIdSuministroElectrico);
        datoNoValido  =  datoNoValido  +  validar.datoValido(false, 'N', 'Id Acometida Electrica Inmueble ', pIdAcometidaElectricaInmueble);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'N', 'Id Alumbrado Publico ', pIdAlumbradoPublico);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'N', 'Id Vialidades ', pIdVialidades);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'N', 'Id Banquetas ', pIdBanquetas);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'N', 'Id Guarniciones ', pIdGuarniciones);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'N', 'Id Gas Natural ', pIdGasNatural);
        datoNoValido  =  datoNoValido  +  validar.datoValido(true, 'N', 'Id Vigilancia Zona ', pIdVigilanciaZona);

        datoNoValido = datoNoValido + validar.datoValido(true, 'N', 'Usuario', pUsuarioOperacion);

        if (datoNoValido == '') {

            BdServiciosPublicos(

                    pFolio.trim(),

                    pIdAguaPotable,
                    pIdRecoAguasResiduales,
                    pIdDrenajePluvialCalle,
                    pIdDrenajePluvialZona,
                    pIdSistMixtoPluvialResidual,
                    pIdSuministroElectrico,
                    pIdAcometidaElectricaInmueble,
                    pIdAlumbradoPublico,
                    pIdVialidades,
                    pIdBanquetas,
                    pIdGuarniciones,
                    pIdGasNatural,
                    pIdVigilanciaZona,

                    pUsuarioOperacion

                )
                .then(result => {

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${JSON.stringify(result[0].resultado)}, mensaje = ${JSON.stringify(result[0].mensaje)}, codigo = ${(result[0].resultado) ? codRespuesta.exito : codRespuesta.error}`);
                    res.json({
                        ok: result[0].resultado,
                        mensaje: result[0].mensaje,
                        nivelInfraestructuraF: result[0].nivelinfraestructuraf,
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
app.get('/consultaServiciosPublicos', verificaToken, (req, res) => {
    try {
        let etiquetaLOG = ruta + '[Usuario: ' + req.usuario.idUsuario + '] METODO: consultaServiciosPublicos';
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
            BdConsultaServiciosPublicos(pFolio.trim(), pUsuarioOperacion)
                .then(result => {
                    numReg = result.length;
                    resultadoDat = result;

                    logger.info(`${etiquetaLOG} RESPUESTA: ok = ${(numReg>0)?true:false}, mensaje = ${(numReg>0)?'Consulta exitosa':'No se encontró información con el folio indicado'}, codigo =  ${(numReg>0)?codRespuesta.exito:codRespuesta.noDatos}`);

                    if (numReg > 0) {
                        var elemRes = {

                            idAguaPotable: resultadoDat[0].idaguapotable,
                            idRecoAguasResiduales: resultadoDat[0].idrecoaguasresiduales,
                            idDrenajePluvialCalle: resultadoDat[0].iddrenajepluvialcalle,
                            idDrenajePluvialZona: resultadoDat[0].iddrenajepluvialzona,
                            idSistMixtoPluvialResidual: resultadoDat[0].idsistmixtopluvialresidual,
                            idSuministroElectrico: resultadoDat[0].idsuministroelectrico,
                            idAcometidaElectricaInmueble: resultadoDat[0].idacometidaelectricainmueble,
                            idAlumbradoPublico: resultadoDat[0].idalumbradopublico,
                            idVialidades: resultadoDat[0].idvialidades,
                            idBanquetas: resultadoDat[0].idbanquetas,
                            idGuarniciones: resultadoDat[0].idguarniciones,
                            idGasNatural: resultadoDat[0].idgasnatural,
                            idVigilanciaZona: resultadoDat[0].idvigilanciazona,
                            nivelInfraestructuraF: resultadoDat[0].nivelinfraestructuraf

                        }
                    }

                    res.json({
                        ok: (numReg > 0) ? true : false,
                        mensaje: (numReg > 0) ? 'Consulta exitosa' : 'No se encontró información',
                        serviciosPublicos: (numReg > 0) ? elemRes : [],
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
function BdListaServiciosPublicos(pCatalogo, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdListaServiciosPublicos `;
    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fCatServiciosPublicos('${pCatalogo}');`;

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
        logger.error(`${ ruta } ERROR: ${ err }`);
        throw (`Se presentó un error en BdListaServiciosPublicos: ${err}`);
    }
}

/**************   R e g i s t r o   ******************************************/
function BdServiciosPublicos(pFolio,
    pIdAguaPotable, pIdRecoAguasResiduales, pIdDrenajePluvialCalle, pIdDrenajePluvialZona, pIdSistMixtoPluvialResidual,
    pIdSuministroElectrico, pIdAcometidaElectricaInmueble, pIdAlumbradoPublico, pIdVialidades, pIdBanquetas, pIdGuarniciones,
    pIdGasNatural, pIdVigilanciaZona,
    pUsuarioOperacion) {

    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdServiciosPublicos `;

    try {
        logger.info(etiquetaLOG);

        const client = new Pool(configD);

        logger.info(etiquetaLOG + 'SELECT * FROM fServiciosPublicos(pFolio, pIdAguaPotable,pIdRecoAguasResiduales,pIdDrenajePluvialCalle,pIdDrenajePluvialZona,pIdSistMixtoPluvialResidual,pIdSuministroElectrico,pIdAcometidaElectricaInmueble,pIdAlumbradoPublico,pIdVialidades,pIdBanquetas,pIdGuarniciones,pIdGasNatural,pIdVigilanciaZona, pUsuarioOperacion);');

        let sQuery = 'SELECT * FROM fServiciosPublicos( \'' + pFolio + '\', ' +

            '(' + pIdAguaPotable + '::smallint),' +
            '(' + pIdRecoAguasResiduales + '::smallint),' +
            '(' + pIdDrenajePluvialCalle + '::smallint),' +
            '(' + pIdDrenajePluvialZona + '::smallint),' +
            '(' + pIdSistMixtoPluvialResidual + '::smallint),' +
            '(' + pIdSuministroElectrico + '::smallint),' +
            '(' + pIdAcometidaElectricaInmueble + '::smallint),' +
            '(' + pIdAlumbradoPublico + '::smallint),' +
            '(' + pIdVialidades + '::smallint),' +
            '(' + pIdBanquetas + '::smallint),' +
            '(' + pIdGuarniciones + '::smallint),' +
            '(' + pIdGasNatural + '::smallint),' +
            '(' + pIdVigilanciaZona + '::smallint),' +

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
        throw (`Se presentó un error en BdServiciosPublicos: ${err}`);
    }
}

/**************   C o n s u l t a   ******************************************/
function BdConsultaServiciosPublicos(pFolio, pUsuarioOperacion) {
    let etiquetaLOG = `${ ruta }[Usuario: ${ pUsuarioOperacion }] METODO: BdConsultaServiciosPublicos `;
    try {
        logger.info(etiquetaLOG);
        const client = new Pool(configD);

        let sQuery = `SELECT * FROM fConsultaServiciosPublicos('${pFolio}');`;

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
        throw (`Se presentó un error en BdConsultaServiciosPublicos: ${err}`);
    }
}

module.exports = app;