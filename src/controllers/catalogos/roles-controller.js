const { response, request } = require('express');
const Roles = require('../../models/modelos/catalogos/roles');
const Modulo = require('../../models/modelos/catalogos/modulo');
const SubModulo = require('../../models/modelos/catalogos/subModulos')
const Permiso = require('../../models/modelos/catalogos/permiso');
const DetalleModuloRol = require('../../models/modelos/detalles/detalle_rol_modulo');
const DetalleModuloSubModulo = require('../../models/modelos/detalles/detalle_modulo_sub_modulo');
const DetalleRolPermiso = require('../../models/modelos/detalles/detalle_rol_permiso');

const rolesGet = async (req = request, res = response) => {
    try {
        // Obtener roles con detalles de módulos
        const roles = await Roles.findAll({
            include: [{
                model: DetalleModuloRol,
                include: [{
                    model: Modulo,
                    include: [{
                        model: DetalleModuloSubModulo,
                        as: 'f_modulo',
                        include: [{
                            model: SubModulo,
                            as: 'f_sub_modulo',
                            include: [{
                                model: DetalleRolPermiso,
                                as:'fr',
                                include: [{
                                    model: Permiso,
                                    as:'fp',
                                }],
                            }],
                        }],
                    }],
                }],
            }],
        });

        res.json({
            roles,
        });

    } catch (error) {
        console.error('Error en rolesGet:', error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
            err: error
        });
    }
};


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
            err: error
        });
    }

}



module.exports = {
    rolesGet,
    rolesTodosGet
};

