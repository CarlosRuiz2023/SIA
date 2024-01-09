// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require('express');
// IMPORTACIÓN DEL MODELO DE BASE DE DATOS.
const Vacaciones = require('../../models/modelos/catalogos/vacaciones');

/**
 * OBTIENE LAS VACACIONES CON ESTATUS ACTIVO.
 * @async
 * @function vacacionesGet
 * @param {request} req - OBJETO DE SOLICITUD HTTP.
 * @param {response} res - OBJETO DE RESPUESTA HTTP.
 * @returns {Object} RESPUESTA JSON CON LAS VACACIONES ACTIVAS OBTENIDAS.
 */
const vacacionesGet = async (req = request, res = response) => {
    try {
        // DEFINE EL CRITERIO DE BÚSQUEDA PARA VACACIONES ACTIVAS.
        const query = { estatus: 1 };
        // REALIZA LA CONSULTA A LA BASE DE DATOS PARA OBTENER LAS VACACIONES ACTIVAS.
        const vacaciones = await Vacaciones.findAll({
            where: query,
        });

        // RESPONDE CON UN OBJETO JSON QUE CONTIENE LAS VACACIONES ACTIVAS OBTENIDAS.
        res.status(200).json({
            ok: true,
            vacaciones
        });

    } catch (error) {
        // MANEJO DE ERRORES: IMPRIME EL ERROR EN LA CONSOLA Y RESPONDE CON UN ERROR HTTP 500.
        console.log(error);
        res.status(500).json({
            msg: 'HA OCURRIDO UN ERROR, HABLE CON EL ADMINISTRADOR.',
        });
    }
};

// EXPORTA EL MÉTODO PARA SER UTILIZADO EN OTROS ARCHIVOS.
module.exports = {
    vacacionesGet
};
