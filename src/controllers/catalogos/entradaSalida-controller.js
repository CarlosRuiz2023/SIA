// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require("express");
// IMPORTACIÓN DEL OPERADOR 'Op' DE SEQUELIZE PARA REALIZAR OPERACIONES COMPLEJAS.
const { Op } = require("sequelize");
// IMPORTACIÓN DEL MODELO DE BASE DE DATOS.
const EntradaSalida = require("../../models/modelos/catalogos/entradaSalida");
const RegistroChequeo = require("../../models/modelos/catalogos/registroChequeo");
const DetalleDiasEntradaSalida = require("../../models/modelos/detalles/detalle_dias_entrada_salida");
const TipoHorario = require("../../models/modelos/catalogos/tipoHorario");

/**
 * OBTIENE LOS DIAS CON ESTATUS ACTIVO.
 * @async
 * @function entradaSalidaGet
 * @param {request} req - OBJETO DE SOLICITUD HTTP.
 * @param {response} res - OBJETO DE RESPUESTA HTTP.
 * @returns {Object} RESPUESTA JSON CON LAS TOLERANCIAS ACTIVAS OBTENIDAS.
 */
const entradaSalidaGet = async (req = request, res = response) => {
  try {
    // DEFINE EL CRITERIO DE BÚSQUEDA PARA TOLERANCIAS ACTIVAS.
    const query = { estatus: 1 };
    // REALIZA LA CONSULTA A LA BASE DE DATOS PARA OBTENER LAS TOLERANCIAS ACTIVAS.
    const dias = await EntradaSalida.findAll({
      where: query,
    });

    // RESPONDE CON UN OBJETO JSON QUE CONTIENE LAS TOLERANCIAS ACTIVAS OBTENIDAS.
    res.status(200).json({
      ok: true,
      results: dias,
    });
  } catch (error) {
    // MANEJO DE ERRORES: IMPRIME EL ERROR EN LA CONSOLA Y RESPONDE CON UN ERROR HTTP 500.
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "HA OCURRIDO UN ERROR, HABLE CON EL ADMINISTRADOR.",
    });
  }
};

/**
 * OBTIENE LOS REGISTROS DE LA BITÁCORA DE ACCESOS SEGÚN LOS PARÁMETROS ESPECIFICADOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const reporteEntradasSalidasPost = async (req, res) => {
  try {
    // EXTRAEMOS LOS PARÁMETROS DE LA SOLICITUD.
    const { fecha_inicio, fecha_fin, empleados } = req.body;
    const query = {};

    // AGREGAMOS CONDICIONES A LA CONSULTA DE ACUERDO A LOS PARÁMETROS RECIBIDOS.
    if (fecha_inicio && fecha_fin) {
      query.fecha = {
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
    const resultado = await RegistroChequeo.findAll({
      include: [
        {
          model: DetalleDiasEntradaSalida,
          as: "detalleDiasEntradaSalida",
          include: [{ model: TipoHorario, as: "cat_tipo_horario" }],
        },
      ],
      where: query,
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      results: resultado,
    });
  } catch (error) {
    // MANEJO DE ERRORES, IMPRIMIMOS EL ERROR EN LA CONSOLA Y ENVIAMOS UNA RESPUESTA DE ERROR AL CLIENTE.
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Ha ocurrido un error, hable con el Administrador.",
    });
  }
};

// EXPORTA EL MÉTODO PARA SER UTILIZADO EN OTROS ARCHIVOS.
module.exports = {
  entradaSalidaGet,
  reporteEntradasSalidasPost,
};
