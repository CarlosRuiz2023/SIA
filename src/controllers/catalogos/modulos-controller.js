const { response, request } = require('express'); 
const Modulo = require('../../models/modelos/catalogos/modulo');
const SubModulo = require('../../models/modelos/catalogos/subModulos')

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


module.exports = {
    modulosGet,
    subModulosGet
};

