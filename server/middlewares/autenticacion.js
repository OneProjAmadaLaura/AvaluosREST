const jwt = require('jsonwebtoken');

const logger = require('../config/log');

//====================
// Verificar token
//====================

let verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            logger.info(' [autenticacion.js] METODO: verificaToken  Error: Se generó un error en la verificación del token solicitado de ' + req.route.path);
            return res.status(401).json({
                ok: false,
                mensaje: 'Se generó un error en la verificación del token',
                codigo: 'AV400'
            });
        }
        req.usuario = decode.usuario;

        next();
    })

};

module.exports = {
    verificaToken
}