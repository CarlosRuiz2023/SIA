const { response, request } = require('express');
const Roles = require('../../models/modelos/catalogos/roles');
const Modulo = require('../../models/modelos/catalogos/modulo');
const SubModulo = require('../../models/modelos/catalogos/subModulos')
const Permiso = require('../../models/modelos/catalogos/permiso');
const DetalleModuloRol = require('../../models/modelos/detalles/detalle_permiso_sub_modulo');
const DetalleModuloSubModulo = require('../../models/modelos/detalles/detalle_modulo_sub_modulo');
const DetalleRolPermiso = require('../../models/modelos/detalles/detalle_rol_permiso');

// const rolesGet = async (req = request, res = response) => {
//     try {
//         // Obtener roles con detalles de módulos
//         const roles = await Roles.findAll({
//             include: [{
//                 model: DetalleModuloRol,
//                 include: [{
//                     model: Modulo,
//                     include: [{
//                         model: DetalleModuloSubModulo,
//                         as: 'f_modulo',
//                         include: [{
//                             model: SubModulo,
//                             as: 'f_sub_modulo',
//                             include: [{
//                                 model: DetalleRolPermiso,
//                                 as:'fr',
//                                 include: [{
//                                     model: Permiso,
//                                     as:'fp',
//                                 }],
//                             }],
//                         }],
//                     }],
//                 }],
//             }],
//         });
//         res.status(200).json({
//             roles,
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             msg: 'Ha ocurrido un error, hable con el Administrador.',
//         });
//     }
// };
const rolesGet = async (req = request, res = response) => {
    try {
        // Obtener roles con detalles de módulos
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

        res.status(200).json({
            roles,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }
}

const rolesPermisosPut = async (req, res) => {
    try {
        const rolesPermisos = req.body;

        for (const { idRol, permisos } of rolesPermisos) {
            // Validar si el rol existe en la base de datos
            const rolExistente = await Roles.findByPk(idRol);
            if (!rolExistente) {
                return res.status(404).json({
                    msg: `No se encontró el rol con ID ${idRol}.`,
                });
            }

            // Obtener los registros actuales asociados al rol
            const informacionRoles = await DetalleRolPermiso.findAll({
                where: {
                    fk_cat_rol: idRol,
                },
            });

            // Mapear los registros actuales a sus respectivos IDs de permisos
            const permisosActuales = informacionRoles.map((rol) => rol.fk_cat_permiso);

            // Encontrar los permisos a agregar y eliminar
            const permisosAgregar = permisos.filter((permiso) => !permisosActuales.includes(permiso));
            const permisosEliminar = permisosActuales.filter((permiso) => !permisos.includes(permiso));

            // Eliminar permisos no necesarios
            await DetalleRolPermiso.destroy({
                where: {
                    fk_cat_rol: idRol,
                    fk_cat_permiso: permisosEliminar,
                },
            });

            // Crear nuevos registros para los permisos a agregar
            await DetalleRolPermiso.bulkCreate(
                permisosAgregar.map((permisoId) => ({
                    fk_cat_rol: idRol,
                    fk_cat_permiso: permisoId,
                }))
            );
        }

        // Obtener roles actualizados
        const rolesActualizados = await Roles.findAll({
            include: [{
                model: DetalleRolPermiso,
                include: [{
                    model: Permiso,
                }],
            }],
        });

        res.json({
            msg: 'Roles y permisos actualizados correctamente',
            roles: rolesActualizados,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }
};




// const rolesPermisosPut = async (req, res) => {
//     try {
//         const rolesPermisos = req.body;

//         for (const { idRol, permisos } of rolesPermisos) {
//             // Validar si el rol existe en la base de datos
//             console.log('ESTE ES EL ID ROL'+idRol, 'ESTOS SON LOS PERMISO'+permisos)
//             const rolExistente = await Roles.findByPk(idRol);
//             if (!rolExistente) {
//                 return res.status(404).json({
//                     msg: `No se encontró el rol con ID ${idRol}.`,
//                 });
//             }

//             // Eliminar permisos antiguos asociados al rol
//             await DetalleRolPermiso.destroy({
//                 where: {
//                     fk_cat_rol: idRol,
//                 },
//             });

//             // Asociar nuevos permisos al rol
//             await DetalleRolPermiso.bulkCreate(
//                 permisos.map((permisoId) => ({
//                     fk_cat_rol: idRol,
//                     fk_cat_permiso: permisoId,
//                 }))
//             );
//         }

//         const roles = await Roles.findAll({
//             include: [{
//                 model: DetalleRolPermiso,
//                 include: [{
//                     model: Permiso,
//                 }],
//             }],
//         });

//         res.json({
//             msg: 'Roles y permisos actualizados correctamente',
//             roles
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             msg: 'Ha ocurrido un error, hable con el Administrador.',
//         });
//     }
// };



const rolesTodosGet = async (req = request, res = response) => {
    try {
        const query = { estatus: 1 };
        const roles = await Roles.findAll({
            where: query,
        });

        res.status(200).json({
            ok: true,
            roles
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }

}

module.exports = {
    rolesGet,
    rolesTodosGet,
    rolesPermisosPut
};

