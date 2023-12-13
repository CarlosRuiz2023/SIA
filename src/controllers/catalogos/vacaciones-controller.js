const { response, request } = require('express');
const Vacaciones = require('../../models/modelos/catalogos/vacaciones');

const vacacionesGet = async ( req = request, res = response) => {
    try {
        const query = { estatus: 1};
        const vacaciones = await Vacaciones.findAll({
            where: query,
        });

        res.status(200).json({
            ok:true,
            vacaciones
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }
};

module.exports ={
    vacacionesGet
}