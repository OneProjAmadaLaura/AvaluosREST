const logger = require('../config/log');

const ruta = ' [generales.js] ';


function datoValido(pRequerido, pTipoDato, pEtiqueta, pDato) {

    let etiquetaLOG = `${ ruta } METODO: datoValido `;

    let datoNoValido = '';
    let leyendaRequerido = 'No es válido el valor indicado para el dato: ';
    let leyendaEnviado = 'Verifique el envío del dato: ';

    try {

        if (pRequerido) {

            if (pDato == undefined || pDato == null || pDato == 'null' || pDato == 'NULL' || pDato == '') {

                if (pDato == 0 && pTipoDato != 'R' && pTipoDato != 'B') {
                    //R ,B
                    datoNoValido = leyendaRequerido + pEtiqueta;
                } else if (pDato != 0) {
                    datoNoValido = leyendaRequerido + pEtiqueta;
                } else if ((pTipoDato == 'R' || pTipoDato == 'B') && pDato == '') {
                    datoNoValido = leyendaRequerido + pEtiqueta;
                }

            } else {

                if (pTipoDato == 'S') {
                    if (pDato.trim() == '' || pDato.toUpperCase()  ==  'NULL') {
                        datoNoValido = leyendaRequerido + pEtiqueta;
                    }
                } else if (pTipoDato == 'N') {
                    if (pDato == 0) {
                        datoNoValido = leyendaRequerido + pEtiqueta;
                    }
                }
            }

        } else {

            if (pDato == undefined) {
                datoNoValido = leyendaEnviado + pEtiqueta;
            }
        }

        if (datoNoValido != '') {
            datoNoValido = ', ' + datoNoValido;
        }

        return datoNoValido;

    } catch (err) {
        logger.info(`${ etiquetaLOG } ENTRADA -->  ${pRequerido}, ${pTipoDato}, ${pEtiqueta}, ${pDato}, ERROR: ${ err } `);
        return err;
    }
}

module.exports = {
    "datoValido": datoValido
}