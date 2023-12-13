const { response, request } = require('express');
const Tolerancia = require('../../models/modelos/catalogos/tolerancia');

const toleranciaGet = async ( req = request, res = response) => {
    try {
        const query = { estatus: 1};
        const tolerancia = await Tolerancia.findAll({
            where: query,
        });

        res.status(200).json({
            ok:true,
            tolerancia
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }
};

module.exports ={
    toleranciaGet
}