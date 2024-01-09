// IMPORTACIÓN DEL MÓDULO 'validationResult' DESDE LA BIBLIOTECA 'express-validator'.
const { validationResult } = require('express-validator');

/**
 * FUNCIÓN DE MIDDLEWARE PARA VALIDAR LOS CAMPOS DE UNA SOLICITUD.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función de middleware para pasar al siguiente middleware.
 */
const validarCampos = (req, res, next) => {
    // VALIDA LOS CAMPOS UTILIZANDO LA FUNCIÓN 'validationResult'.
    const errors = validationResult(req);
    
    // VERIFICA SI HAY ERRORES Y RESPONDE CON UNA RESPUESTA DE ERROR 400 JUNTO CON LOS ERRORES EN FORMATO JSON.
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    // SI NO HAY ERRORES, EJECUTA EL PRÓXIMO MIDDLEWARE EN LA CADENA.
    next();
};

// EXPORTA LA FUNCIÓN 'validarCampos' PARA SER UTILIZADA EN OTROS ARCHIVOS.
module.exports = {
    validarCampos
};
