// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require("express");
// IMPORTACIÓN DEL OPERADOR 'Op' DE SEQUELIZE PARA REALIZAR OPERACIONES COMPLEJAS.
const { Op } = require("sequelize");
const pool = require("../../database/config");
// IMPORTACIÓN DEL MODELO DE BASE DE DATOS.
const EntradaSalida = require("../../models/modelos/catalogos/entradaSalida");
const RegistroChequeo = require("../../models/modelos/catalogos/registroChequeo");
const DetalleDiasEntradaSalida = require("../../models/modelos/detalles/detalle_dias_entrada_salida");
const TipoHorario = require("../../models/modelos/catalogos/tipoHorario");
const Empleado = require("../../models/modelos/catalogos/empleado");
const Persona = require("../../models/modelos/catalogos/persona");
const {
  sumarHoras,
  restarHoras,
} = require("../../helpers/operacionesHorarias");
const Ausencia = require("../../models/modelos/catalogos/ausencias");

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
      attributes: [
        "fk_cat_empleado",
        [pool.fn("DATE_TRUNC", "week", pool.col("fecha")), "inicio_semana"],
        [
          pool.fn(
            "TO_CHAR",
            pool.cast(pool.fn("SUM", pool.col("tiempo_extra")), "interval"),
            "'HH24:MI:SS'"
          ),
          "total_tiempo_extra",
        ],
        [
          pool.fn(
            "TO_CHAR",
            pool.cast(pool.fn("SUM", pool.col("tiempo_retardo")), "interval"),
            "'HH24:MI:SS'"
          ),
          "total_tiempo_retardo",
        ],
        [
          pool.fn(
            "COUNT",
            pool.literal(`
            CASE WHEN fk_cat_eventos = 3 THEN 1 ELSE NULL END
          `)
          ),
          "R",
        ],
        [
          pool.fn(
            "COUNT",
            pool.literal(`
            CASE WHEN fk_cat_eventos = 2 THEN 1 ELSE NULL END
          `)
          ),
          "SR",
        ],
      ],
      group: [
        "inicio_semana",
        "fk_cat_empleado",
        "detalleDiasEntradaSalida.id_detalle_entrada_salida",
        "detalleDiasEntradaSalida.cat_tipo_horario.id_cat_tipo_horario",
        "empleado.id_cat_empleado",
        "empleado.persona.id_cat_persona",
      ],
      order: [["inicio_semana"]],
      include: [
        {
          model: Empleado,
          as: "empleado",
          include: [{ model: Persona, as: "persona" }],
        },
        {
          model: DetalleDiasEntradaSalida,
          as: "detalleDiasEntradaSalida",
          include: [
            {
              model: TipoHorario,
              as: "cat_tipo_horario",
              attributes: [
                [pool.literal('"jornada" * 5'), "Horas_semanales"],
                "jornada",
              ],
            },
          ],
        },
      ],
      where: query,
    });

    query.estatus = {
      [Op.eq]: 0,
    };

    const resultado1 = await Ausencia.findAll({
      attributes: [
        "fk_cat_empleado",
        [pool.fn("DATE_TRUNC", "week", pool.col("fecha")), "inicio_semana"],
        [
          pool.fn(
            "COUNT",
            pool.literal(`
              CASE WHEN fk_cat_empleado IS NOT NULL THEN 1 ELSE NULL END
            `)
          ),
          "A",
        ],
      ],
      group: [
        "inicio_semana",
        "fk_cat_empleado",
        "empleado.id_cat_empleado",
        "empleado.persona.id_cat_persona",
      ],
      order: [["inicio_semana"]],
      include: [
        {
          model: Empleado,
          as: "empleado",
          include: [{ model: Persona, as: "persona" }],
        },
      ],
      where: query,
    });

    // Mapeamos los resultados para reorganizar la estructura
    const resultadoFinal = resultado.map((result) => {
      const horasSemanales = `${result.detalleDiasEntradaSalida.cat_tipo_horario.dataValues.Horas_semanales}:00:00`;
      // Eliminar una comilla simple o doble al principio y al final
      let totalTiempoExtra = result.dataValues.total_tiempo_extra.replace(
        /^['"]|['"]$/g,
        ""
      );
      // Eliminar una comilla simple o doble al principio y al final
      let totalTiempoRetardo = result.dataValues.total_tiempo_retardo.replace(
        /^['"]|['"]$/g,
        ""
      );
      let tiempoTrabajado = sumarHoras(horasSemanales, totalTiempoExtra);
      tiempoTrabajado = restarHoras(tiempoTrabajado, totalTiempoRetardo);

      return {
        horas_semanales: horasSemanales,
        jornada:
          result.detalleDiasEntradaSalida.cat_tipo_horario.dataValues.jornada,
        inicio_semana: result.dataValues.inicio_semana,
        tiempo_trabajado: tiempoTrabajado,
        fk_cat_empleado: result.fk_cat_empleado,
        total_tiempo_extra: totalTiempoExtra,
        total_tiempo_retardo: totalTiempoRetardo,
        R: result.dataValues.R,
        SR: result.dataValues.SR,
        empleado: {
          numero_empleado: result.empleado.numero_empleado,
          sueldo: result.empleado.sueldo,
          persona: {
            nombre: result.empleado.persona.nombre,
            apellido_Paterno: result.empleado.persona.apellido_Paterno,
            apellido_Materno: result.empleado.persona.apellido_Materno,
          },
        },
      };
    });

    console.log(resultadoFinal);

    // Unir los resultados
    const resultadosFinales = resultadoFinal.map((resultadoFinal) => {
      const resultadoAusencia = resultado1.find((resultado1) => {
        return (
          resultado1.fk_cat_empleado === resultadoFinal.fk_cat_empleado &&
          new Date(resultado1.dataValues.inicio_semana).toISOString() ===
            new Date(resultadoFinal.inicio_semana).toISOString()
        );
      });

      return {
        Horas_semanales: resultadoFinal.horas_semanales,
        jornada: resultadoFinal.jornada,
        inicio_semana: resultadoFinal.inicio_semana,
        tiempo_trabajado: resultadoFinal.tiempo_trabajado,
        fk_cat_empleado: resultadoFinal.fk_cat_empleado,
        total_tiempo_extra: resultadoFinal.totalTiempoExtra,
        total_tiempo_retardo: resultadoFinal.totalTiempoRetardo,
        R: resultadoFinal.R,
        SR: resultadoFinal.SR,
        A: resultadoAusencia ? resultadoAusencia.dataValues.A : "0",
        empleado: resultadoFinal.empleado,
        detalleDiasEntradaSalida: resultadoFinal.detalleDiasEntradaSalida,
      };
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      results: resultadosFinales,
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
