const { response, request } = require('express');
const PuestoTrabajo = require('../../models/modelos/catalogos/puestoTrabajo');

const puestoTrabajoGet = async ( req = request, res = response) => {
    try {
        const query = { estatus: 1};
        const puestoTrabajo = await PuestoTrabajo.findAll({
            where: query,
        });

        res.status(200).json({
            ok:true,
            puestoTrabajo
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }
};

module.exports ={
    puestoTrabajoGet
}