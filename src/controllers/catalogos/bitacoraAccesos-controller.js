const { response, request } = require('express');
const { Op } = require('sequelize');

const BitacoraAccesos = require('../../models/modelos/catalogos/bitacoraAcceso');
const Empleado = require('../../models/modelos/catalogos/empleado');
const Persona = require('../../models/modelos/catalogos/persona');


const bitacoraAccesoGet = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, empleados } = req.body;
        const query = {};

        if (fecha_inicio && fecha_fin) {
            query.fecha_inicio = {
                [Op.gte]: fecha_inicio,
                [Op.lte]: fecha_fin,
            };
        }

        if (empleados && empleados.length > 0) {
            query.fk_cat_empleado = {
                [Op.in]: empleados,
            };
        }

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



const bitacoraAccesosPost = async ( req = request, res = response ) => {
    try {
        const {
            fecha_inicio, 
            hora, 
            plataforma_web, 
            plataforma_movil, 
            descripccion, 
            direccion_ip, 
            fk_cat_empleado
        } = req.body; 

        const bitacoraAcceso = await BitacoraAccesos.create({
            fecha_inicio, 
            hora, 
            plataforma_web, 
            plataforma_movil, 
            descripccion, 
            direccion_ip, 
            fk_cat_empleado
        });

        res.status(201).json({
            ok:true,
            msg: 'Bitacora de acceso guardado correctamente',
            bitacoraAcceso
        });
          
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }
};


module.exports ={
    bitacoraAccesoGet,
    bitacoraAccesosPost
}