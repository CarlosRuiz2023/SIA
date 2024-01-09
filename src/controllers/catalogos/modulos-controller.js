// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require('express');
// IMPORTACIÓN DE LOS MODELOS DE BASE DE DATOS.
const Modulo = require('../../models/modelos/catalogos/modulo');
const SubModulo = require('../../models/modelos/catalogos/subModulos');
const DetalleModuloSubModulo = require('../../models/modelos/detalles/detalle_modulo_sub_modulo');

/**
 * OBTIENE TODOS LOS MÓDULOS CON ESTATUS ACTIVO.
 * @async
 * @function modulosGet
 * @param {request} req - OBJETO DE SOLICITUD HTTP.
 * @param {response} res - OBJETO DE RESPUESTA HTTP.
 * @returns {Object} RESPUESTA JSON CON LOS MÓDULOS OBTENIDOS.
 */
const modulosGet = async (req = request, res = response) => {
    try {
        // DEFINE EL CRITERIO DE BÚSQUEDA PARA MÓDULOS ACTIVOS.
        const query = { estatus: 1 };
        // REALIZA LA CONSULTA A LA BASE DE DATOS PARA OBTENER LOS MÓDULOS ACTIVOS.
        const modulos = await Modulo.findAll({
            where: query,
        });

        // RESPONDE CON UN OBJETO JSON QUE CONTIENE LOS MÓDULOS OBTENIDOS.
        res.status(200).json({
            ok: true,
            modulos,
        });
    } catch (error) {
        // MANEJO DE ERRORES: IMPRIME EL ERROR EN LA CONSOLA Y RESPONDE CON UN ERROR HTTP 500.
        console.log(error);
        res.status(500).json({
            msg: 'HA OCURRIDO UN ERROR, HABLE CON EL ADMINISTRADOR.',
            err: error,
        });
    }
}

/**
 * OBTIENE TODOS LOS SUBMÓDULOS CON ESTATUS ACTIVO.
 * @async
 * @function subModulosGet
 * @param {request} req - OBJETO DE SOLICITUD HTTP.
 * @param {response} res - OBJETO DE RESPUESTA HTTP.
 * @returns {Object} RESPUESTA JSON CON LOS SUBMÓDULOS OBTENIDOS.
 */
const subModulosGet = async (req = request, res = response) => {
    try {
        // DEFINE EL CRITERIO DE BÚSQUEDA PARA SUBMÓDULOS ACTIVOS.
        const query = { estatus: 1 };
        // REALIZA LA CONSULTA A LA BASE DE DATOS PARA OBTENER LOS SUBMÓDULOS ACTIVOS.
        const subModulo = await SubModulo.findAll({
            where: query,
        });

        // RESPONDE CON UN OBJETO JSON QUE CONTIENE LOS SUBMÓDULOS OBTENIDOS.
        res.status(200).json({
            ok: true,
            subModulo,
        });
    } catch (error) {
        // MANEJO DE ERRORES: IMPRIME EL ERROR EN LA CONSOLA Y RESPONDE CON UN ERROR HTTP 500.
        console.log(error);
        res.status(500).json({
            msg: 'HA OCURRIDO UN ERROR, HABLE CON EL ADMINISTRADOR.',
            err: error,
        });
    }
}

/**
 * OBTIENE TODOS LOS MÓDULOS CON SUS SUBMÓDULOS ASOCIADOS.
 * @async
 * @function modulosSubModulosGet
 * @param {request} req - OBJETO DE SOLICITUD HTTP.
 * @param {response} res - OBJETO DE RESPUESTA HTTP.
 * @returns {Object} RESPUESTA JSON CON LOS MÓDULOS Y SUBMÓDULOS OBTENIDOS.
 */
const modulosSubModulosGet = async (req = request, res = response) => {
    try {
        // OBTENER ROLES CON DETALLES DE MÓDULOS Y SUBMÓDULOS.
        const modulos = await Modulo.findAll({
            include: [{
                model: DetalleModuloSubModulo,
                include: [{
                    model: SubModulo,
                }],
            }],
        });

        // RESPONDE CON UN OBJETO JSON QUE CONTIENE LOS MÓDULOS Y SUBMÓDULOS OBTENIDOS.
        res.status(200).json({
            modulos,
        });
    } catch (error) {
        // MANEJO DE ERRORES: IMPRIME EL ERROR EN LA CONSOLA Y RESPONDE CON UN ERROR HTTP 500.
        console.log(error);
        res.status(500).json({
            msg: 'HA OCURRIDO UN ERROR, HABLE CON EL ADMINISTRADOR.',
        });
    }
}

// EXPORTA LOS MÉTODOS PARA SER UTILIZADOS EN OTROS ARCHIVOS.
module.exports = {
    modulosGet,
    subModulosGet,
    modulosSubModulosGet,
};
