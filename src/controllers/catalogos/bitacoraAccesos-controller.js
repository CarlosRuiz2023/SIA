const { response, request } = require('express');
const { Op } = require('sequelize');

const BitacoraAccesos = require('../../models/modelos/catalogos/bitacoraAcceso');
const Empleado = require('../../models/modelos/catalogos/empleado');
const Persona = require('../../models/modelos/catalogos/persona');


const bitacoraAccesoGet = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.body;
        const query = {
            fecha_inicio: {
                [Op.gte]: fecha_inicio,
                [Op.lte]: fecha_fin,    
            },
        };
        
        const bitacoraAcceso = await BitacoraAccesos.findAll({
            where: query,
            include: [
                { 
                    model: Empleado,
                    include: [
                        { model: Persona, as: 'persona' },
                    ],
                },
            ],
        });

        res.status(200).json({
            ok: true,
            bitacoraAcceso,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }
};



module.exports ={
    bitacoraAccesoGet
}