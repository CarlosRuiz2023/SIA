const { response, request } = require('express'); 
const Permiso = require('../../models/modelos/catalogos/permiso');
const DetallePermisoSubModulo = require('../../models/modelos/detalles/detalle_permiso_sub_modulo');
const SubModulo = require('../../models/modelos/catalogos/subModulos');

const permisosGet = async  (req = request, res = response) => {
    try {
        const query = { estatus: 1};
        const permiso = await Permiso.findAll({
            where: query,
        });

        res.status(200).json({
            ok:true,
            permiso
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
            err: error
        });
    }

}

const permisoSubModuloGet = async (req = request, res = response) => {
    try {
        // Obtener roles con detalles de módulos
        const permiso = await Permiso.findAll({
            include: [{
                model: DetallePermisoSubModulo,
                include: [{
                    model: SubModulo,
                }],
            }],
        });
        res.status(200).json({
            permiso,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }
}


module.exports = {
    permisosGet,
    permisoSubModuloGet
};

