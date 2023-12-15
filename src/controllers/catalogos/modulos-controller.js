const { response, request } = require('express'); 
const Modulo = require('../../models/modelos/catalogos/modulo');
const SubModulo = require('../../models/modelos/catalogos/subModulos');
const DetalleModuloSubModulo = require('../../models/modelos/detalles/detalle_modulo_sub_modulo');

const modulosGet = async  (req = request, res = response) => {
    try {
        const query = { estatus: 1};
        const modulos = await Modulo.findAll({
            where: query,
        });

        res.status(200).json({
            ok:true,
            modulos
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
            err: error
        });
    }

}

const subModulosGet = async  (req = request, res = response) => {
    try {
        const query = { estatus: 1};
        const subModulo = await SubModulo.findAll({
            where: query,
        });

        res.status(200).json({
            ok:true,
            subModulo
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
            err: error
        });
    }

}

const modulosSubModulosGet= async(req = request, res = response) => {
    try {
        // Obtener roles con detalles de módulos
        const modulos = await Modulo.findAll({
            include: [{
                model: DetalleModuloSubModulo,
                include: [{
                    model: SubModulo,
                }],
            }],
        });
        res.status(200).json({
            modulos,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }
}


module.exports = {
    modulosGet,
    subModulosGet,
    modulosSubModulosGet
};

