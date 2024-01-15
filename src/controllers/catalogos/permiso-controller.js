// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require('express');
// IMPORTACIÓN DE LOS MODELOS DE BASE DE DATOS.
const Permiso = require('../../models/modelos/catalogos/permiso');
const DetalleRolSubModulo = require('../../models/modelos/detalles/detalle_rol_sub_modulo');
const SubModulo = require('../../models/modelos/catalogos/subModulos');
const Roles = require('../../models/modelos/catalogos/roles');

/**
 * OBTIENE TODOS LOS PERMISOS CON ESTATUS ACTIVO.
 * @async
 * @function permisosGet
 * @param {request} req - OBJETO DE SOLICITUD HTTP.
 * @param {response} res - OBJETO DE RESPUESTA HTTP.
 * @returns {Object} RESPUESTA JSON CON LOS PERMISOS OBTENIDOS.
 */
const permisosGet = async (req = request, res = response) => {
    try {
        // DEFINE EL CRITERIO DE BÚSQUEDA PARA PERMISOS ACTIVOS.
        const query = { estatus: 1 };
        // REALIZA LA CONSULTA A LA BASE DE DATOS PARA OBTENER LOS PERMISOS ACTIVOS.
        const permiso = await Permiso.findAll({
            where: query,
        });

        // RESPONDE CON UN OBJETO JSON QUE CONTIENE LOS PERMISOS OBTENIDOS.
        res.status(200).json({
            ok: true,
            permiso,
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
 * OBTIENE TODOS LOS PERMISOS CON SUS SUBMÓDULOS ASOCIADOS.
 * @async
 * @function permisoSubModuloGet
 * @param {request} req - OBJETO DE SOLICITUD HTTP.
 * @param {response} res - OBJETO DE RESPUESTA HTTP.
 * @returns {Object} RESPUESTA JSON CON LOS PERMISOS Y SUBMÓDULOS OBTENIDOS.
 */
const permisoSubModuloGet = async (req = request, res = response) => {
    try {
        // OBTENER PERMISOS CON DETALLES DE SUBMÓDULOS.
        const permisos_rol = await Roles.findAll({
            where: {
                estatus: 1
              },
            include: [{
                model: DetalleRolSubModulo,
                include: [{
                    model: SubModulo,
                    model: Permiso,
                }],
            }],
        });

        // RESPONDE CON UN OBJETO JSON QUE CONTIENE LOS PERMISOS Y SUBMÓDULOS OBTENIDOS.
        res.status(200).json({
            permisos_rol,
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
    permisosGet,
    permisoSubModuloGet,
};
