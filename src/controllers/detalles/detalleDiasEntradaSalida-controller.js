// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require("express");

// IMPORTACIÓN DE LOS MODELOS NECESARIOS PARA REALIZAR CONSULTAS EN LA BASE DE DATOS.
const DetalleDiasEntradaSalida = require("../../models/modelos/detalles/detalle_dias_entrada_salida");
const EntradaSalida = require("../../models/modelos/catalogos/entradaSalida");
const Dias = require("../../models/modelos/catalogos/dias");
const TipoHorario = require("../../models/modelos/catalogos/tipoHorario");

/**
 * OBTIENE TODOS LOS CLIENTES ACTIVOS DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const detalleDiasEntradaSalidaGet = async (req = request, res = response) => {
  try {
    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO CLIENTES Y SUS RELACIONES.
    const detalleDiasEntradaSalida = await DetalleDiasEntradaSalida.findAll({
      include: [
        { model: Dias, as: "cat_dia" },
        { model: TipoHorario, as: "cat_tipo_horario" },
        { model: EntradaSalida, as: "cat_entrada_salida" },
      ],
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      detalleDiasEntradaSalida,
    });
  } catch (error) {
    // MANEJO DE ERRORES, IMPRIMIMOS EL ERROR EN LA CONSOLA Y ENVIAMOS UNA RESPUESTA DE ERROR AL CLIENTE.
    console.log(error);
    res.status(500).json({
      msg: "Ha ocurrido un error, hable con el Administrador.",
    });
  }
};

// EXPORTAMOS LAS FUNCIONES PARA SU USO EN OTROS ARCHIVOS.
module.exports = {
  detalleDiasEntradaSalidaGet,
};
