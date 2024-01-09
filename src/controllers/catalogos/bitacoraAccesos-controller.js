// IMPORTACIÓN DEL OBJETO 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require('express');

// IMPORTACIÓN DEL OPERADOR 'Op' DE SEQUELIZE PARA REALIZAR OPERACIONES COMPLEJAS.
const { Op } = require('sequelize');

// IMPORTACIÓN DE LOS MODELOS NECESARIOS PARA REALIZAR CONSULTAS EN LA BASE DE DATOS.
const BitacoraAccesos = require('../../models/modelos/catalogos/bitacoraAcceso');
const Empleado = require('../../models/modelos/catalogos/empleado');
const Persona = require('../../models/modelos/catalogos/persona');

/**
 * OBTIENE LOS REGISTROS DE LA BITÁCORA DE ACCESOS SEGÚN LOS PARÁMETROS ESPECIFICADOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const bitacoraAccesoGet = async (req, res) => {
    try {
        // EXTRAEMOS LOS PARÁMETROS DE LA SOLICITUD.
        const { fecha_inicio, fecha_fin, empleados } = req.body;
        const query = {};

        // AGREGAMOS CONDICIONES A LA CONSULTA DE ACUERDO A LOS PARÁMETROS RECIBIDOS.
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

        // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS.
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

        // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
        res.status(200).json({
            ok: true,
            bitacoraAcceso,
        });

    } catch (error) {
        // MANEJO DE ERRORES, IMPRIMIMOS EL ERROR EN LA CONSOLA Y ENVIAMOS UNA RESPUESTA DE ERROR AL CLIENTE.
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }
};

/**
 * REGISTRA UN NUEVO ACCESO EN LA BITÁCORA DE ACCESOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const bitacoraAccesosPost = async ( req = request, res = response ) => {
    try {
        // EXTRAEMOS LOS DATOS NECESARIOS DEL CUERPO DE LA SOLICITUD.
        const {
            fecha_inicio, 
            hora, 
            plataforma_web, 
            plataforma_movil, 
            descripccion, 
            direccion_ip, 
            fk_cat_empleado
        } = req.body; 

        // REGISTRAMOS UN NUEVO ACCESO EN LA BITÁCORA DE ACCESOS.
        const bitacoraAcceso = await BitacoraAccesos.create({
            fecha_inicio, 
            hora, 
            plataforma_web, 
            plataforma_movil, 
            descripccion, 
            direccion_ip, 
            fk_cat_empleado
        });

        // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DEL REGISTRO.
        res.status(201).json({
            ok:true,
            msg: 'Bitacora de acceso guardado correctamente',
            bitacoraAcceso
        });
          
    } catch (error) {
        // MANEJO DE ERRORES, IMPRIMIMOS EL ERROR EN LA CONSOLA Y ENVIAMOS UNA RESPUESTA DE ERROR AL CLIENTE.
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }
};

// EXPORTAMOS LAS FUNCIONES PARA SU USO EN OTROS ARCHIVOS.
module.exports ={
    bitacoraAccesoGet,
    bitacoraAccesosPost
};
