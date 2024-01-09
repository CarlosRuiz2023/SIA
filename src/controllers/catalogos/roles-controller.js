// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require('express');
// IMPORTACIÓN DE MODELOS DE BASE DE DATOS.
const Roles = require('../../models/modelos/catalogos/roles');
const Permiso = require('../../models/modelos/catalogos/permiso');
const DetalleRolPermiso = require('../../models/modelos/detalles/detalle_rol_permiso');

/**
 * OBTIENE TODOS LOS ROLES CON LOS PERMISOS ASOCIADOS.
 * @async
 * @function rolesGet
 * @param {request} req - OBJETO DE SOLICITUD HTTP.
 * @param {response} res - OBJETO DE RESPUESTA HTTP.
 * @returns {Object} RESPUESTA JSON CON LOS ROLES Y PERMISOS OBTENIDOS.
 */
const rolesGet = async (req = request, res = response) => {
    try {
        // OBTENER ROLES CON DETALLES DE PERMISOS
        const roles = await Roles.findAll({
            attributes: ['id_cat_rol', 'rol', 'descripccion', 'estatus'],
            include: [{
                model: DetalleRolPermiso,
                attributes: ['id_detalle_rol_permiso',],
                include: [{
                    model: Permiso,
                    attributes: ['id_cat_permiso', 'permiso'],
                }],
            }],
        });

        // RESPONDER CON UN OBJETO JSON QUE CONTIENE LOS ROLES Y PERMISOS OBTENIDOS.
        res.status(200).json({
            roles,
        });
    } catch (error) {
        // MANEJO DE ERRORES: IMPRIME EL ERROR EN LA CONSOLA Y RESPONDE CON UN ERROR HTTP 500.
        console.log(error);
        res.status(500).json({
            msg: 'HA OCURRIDO UN ERROR, HABLE CON EL ADMINISTRADOR.',
        });
    }
};

/**
 * ACTUALIZA LOS PERMISOS ASOCIADOS A LOS ROLES.
 * @async
 * @function rolesPermisosPut
 * @param {request} req - OBJETO DE SOLICITUD HTTP.
 * @param {response} res - OBJETO DE RESPUESTA HTTP.
 * @returns {Object} RESPUESTA JSON CON EL RESULTADO DE LA ACTUALIZACIÓN.
 */
const rolesPermisosPut = async (req, res) => {
    try {
        // OBTIENE LA INFORMACIÓN DE PERMISOS Y ROLES DEL CUERPO DE LA SOLICITUD.
        const rolesPermisos = req.body;

        // ITERA A TRAVÉS DE CADA ELEMENTO EN LA LISTA DE ROLES Y PERMISOS.
        for (const { idRol, permisos } of rolesPermisos) {
            // VALIDA SI EL ROL EXISTE EN LA BASE DE DATOS.
            const rolExistente = await Roles.findByPk(idRol);
            if (!rolExistente) {
                return res.status(404).json({
                    msg: `No se encontró el rol con ID ${idRol}.`,
                });
            }

            // OBTIENE LOS REGISTROS ACTUALES ASOCIADOS AL ROL.
            const informacionRoles = await DetalleRolPermiso.findAll({
                where: {
                    fk_cat_rol: idRol,
                },
            });

            // MAPEA LOS REGISTROS ACTUALES A SUS RESPECTIVOS IDS DE PERMISOS.
            const permisosActuales = informacionRoles.map((rol) => rol.fk_cat_permiso);

            // ENCUENTRA LOS PERMISOS A AGREGAR Y ELIMINAR.
            const permisosAgregar = permisos.filter((permiso) => !permisosActuales.includes(permiso));
            const permisosEliminar = permisosActuales.filter((permiso) => !permisos.includes(permiso));

            // ELIMINA PERMISOS NO NECESARIOS.
            await DetalleRolPermiso.destroy({
                where: {
                    fk_cat_rol: idRol,
                    fk_cat_permiso: permisosEliminar,
                },
            });

            // CREA NUEVOS REGISTROS PARA LOS PERMISOS A AGREGAR.
            await DetalleRolPermiso.bulkCreate(
                permisosAgregar.map((permisoId) => ({
                    fk_cat_rol: idRol,
                    fk_cat_permiso: permisoId,
                }))
            );
        }

        // OBTIENE ROLES ACTUALIZADOS.
        const rolesActualizados = await Roles.findAll({
            include: [{
                model: DetalleRolPermiso,
                include: [{
                    model: Permiso,
                }],
            }],
        });

        // RESPONDE CON UN OBJETO JSON QUE CONTIENE UN MENSAJE Y LOS ROLES ACTUALIZADOS.
        res.json({
            msg: 'Roles y permisos actualizados correctamente',
            roles: rolesActualizados,
        });
    } catch (error) {
        // MANEJO DE ERRORES: IMPRIME EL ERROR EN LA CONSOLA Y RESPONDE CON UN ERROR HTTP 500.
        console.log(error);
        res.status(500).json({
            msg: 'HA OCURRIDO UN ERROR, HABLE CON EL ADMINISTRADOR.',
        });
    }
};

/**
 * OBTIENE TODOS LOS ROLES CON ESTATUS ACTIVO.
 * @async
 * @function rolesTodosGet
 * @param {request} req - OBJETO DE SOLICITUD HTTP.
 * @param {response} res - OBJETO DE RESPUESTA HTTP.
 * @returns {Object} RESPUESTA JSON CON LOS ROLES ACTIVOS OBTENIDOS.
 */
const rolesTodosGet = async (req = request, res = response) => {
    try {
        // DEFINE EL CRITERIO DE BÚSQUEDA PARA ROLES ACTIVOS.
        const query = { estatus: 1 };
        // REALIZA LA CONSULTA A LA BASE DE DATOS PARA OBTENER LOS ROLES ACTIVOS.
        const roles = await Roles.findAll({
            where: query,
        });

        // RESPONDE CON UN OBJETO JSON QUE CONTIENE LOS ROLES ACTIVOS OBTENIDOS.
        res.status(200).json({
            ok: true,
            roles,
        });
    } catch (error) {
        // MANEJO DE ERRORES: IMPRIME EL ERROR EN LA CONSOLA Y RESPONDE CON UN ERROR HTTP 500.
        console.log(error);
        res.status(500).json({
            msg: 'HA OCURRIDO UN ERROR, HABLE CON EL ADMINISTRADOR.',
        });
    }
};

// EXPORTA LOS MÉTODOS PARA SER UTILIZADOS EN OTROS ARCHIVOS.
module.exports = {
    rolesGet,
    rolesTodosGet,
    rolesPermisosPut
};
