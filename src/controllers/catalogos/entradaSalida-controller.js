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

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

    if (empleados && empleados.length > 0) {
      query.fk_cat_empleado = {
        [Op.in]: empleados,
      };
    }

    const resultado2 = await RegistroChequeo.findAll({
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

    // AGREGAMOS CONDICIONES A LA CONSULTA DE ACUERDO A LOS PARÁMETROS RECIBIDOS.
    if (fecha_inicio && fecha_fin) {
      query.fecha = {
        [Op.gte]: fecha_inicio,
        [Op.lte]: fecha_fin,
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
      group: ["inicio_semana", "fk_cat_empleado"],
      order: [["inicio_semana"]],
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
              CASE WHEN fk_cat_dia != 6 THEN 1 ELSE NULL END
            `)
          ),
          "A",
        ],
        [
          pool.fn(
            "COUNT",
            pool.literal(`
              CASE WHEN fk_cat_dia = 6 THEN 1 ELSE NULL END
            `)
          ),
          "As",
        ],
      ],
      group: ["inicio_semana", "fk_cat_empleado"],
      order: [["inicio_semana"]],
      where: query,
    });

    // Unir los resultados
    // Mapeamos los resultados para reorganizar la estructura
    const resultadoFinal = resultado.map((resultado) => {
      const resultadoEmpleados = resultado2.find((resultado2) => {
        return resultado2.fk_cat_empleado === resultado.fk_cat_empleado;
      });

      const horasSemanales = `${resultadoEmpleados.detalleDiasEntradaSalida.cat_tipo_horario.dataValues.Horas_semanales}:00:00`;

      // Eliminar una comilla simple o doble al principio y al final
      let totalTiempoExtra = resultado.dataValues.total_tiempo_extra.replace(
        /^['"]|['"]$/g,
        ""
      );
      // Eliminar una comilla simple o doble al principio y al final
      let totalTiempoRetardo =
        resultado.dataValues.total_tiempo_retardo.replace(/^['"]|['"]$/g, "");

      let tiempoTrabajado = "";
      if (totalTiempoExtra == totalTiempoRetardo) {
        tiempoTrabajado = horasSemanales;
      } else {
        tiempoTrabajado = sumarHoras(horasSemanales, totalTiempoExtra);
        tiempoTrabajado = restarHoras(tiempoTrabajado, totalTiempoRetardo);
      }

      return {
        horas_semanales: horasSemanales,
        jornada:
          resultadoEmpleados.detalleDiasEntradaSalida.cat_tipo_horario
            .dataValues.jornada,
        inicio_semana: resultado.dataValues.inicio_semana,
        tiempo_trabajado: tiempoTrabajado,
        fk_cat_empleado: resultado.fk_cat_empleado,
        total_tiempo_extra: totalTiempoExtra,
        total_tiempo_retardo: totalTiempoRetardo,
        R: resultado.dataValues.R,
        SR: resultado.dataValues.SR,
        empleado: {
          numero_empleado: resultadoEmpleados.empleado.numero_empleado,
          sueldo: resultadoEmpleados.empleado.sueldo,
          persona: {
            nombre: resultadoEmpleados.empleado.persona.nombre,
            apellido_Paterno:
              resultadoEmpleados.empleado.persona.apellido_Paterno,
            apellido_Materno:
              resultadoEmpleados.empleado.persona.apellido_Materno,
          },
        },
      };
    });

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
        horas_semanales: resultadoFinal.horas_semanales,
        jornada: resultadoFinal.jornada,
        inicio_semana: resultadoFinal.inicio_semana,
        total_tiempo_extra: resultadoFinal.total_tiempo_extra,
        total_tiempo_retardo: resultadoFinal.total_tiempo_retardo,
        tiempo_trabajado: resultadoAusencia
          ? restarHoras(
              restarHoras(
                resultadoFinal.tiempo_trabajado,
                `0${
                  resultadoAusencia.dataValues.A * resultadoFinal.jornada
                }:00:00`
              ),
              `0${resultadoAusencia.dataValues.As * 5}:00:00`
            )
          : resultadoFinal.tiempo_trabajado,
        fk_cat_empleado: resultadoFinal.fk_cat_empleado,
        R: resultadoFinal.R,
        SR: resultadoFinal.SR,
        A: resultadoAusencia ? resultadoAusencia.dataValues.A : "0",
        As: resultadoAusencia ? resultadoAusencia.dataValues.As : "0",
        empleado: resultadoFinal.empleado,
      };
    });

    const totales = {};

    // Itera sobre los resultados y suma los valores
    resultadosFinales.forEach((resultado) => {
      const idCatEmpleado = resultado.fk_cat_empleado;

      // Verifica si ya existe una entrada para el empleado en el objeto
      if (!totales[idCatEmpleado]) {
        totales[idCatEmpleado] = {
          sumaHorasSemanal: "00:00:00",
          sumaHorasTrabajadas: "00:00:00",
          sumaTiemposExtra: "00:00:00",
          sumaTiemposReponer: "00:00:00",
          sumaA: 0,
          sumaAs: 0,
          sumaR: 0,
          sumaSR: 0,
        };
      }

      // Suma los valores para el empleado actual
      totales[idCatEmpleado].sumaHorasSemanal = sumarHoras(
        totales[idCatEmpleado].sumaHorasSemanal,
        resultado.horas_semanales
      );

      totales[idCatEmpleado].sumaHorasTrabajadas = sumarHoras(
        totales[idCatEmpleado].sumaHorasTrabajadas,
        resultado.tiempo_trabajado
      );

      totales[idCatEmpleado].sumaTiemposExtra = sumarHoras(
        totales[idCatEmpleado].sumaTiemposExtra,
        resultado.total_tiempo_extra
      );

      totales[idCatEmpleado].sumaTiemposReponer = sumarHoras(
        totales[idCatEmpleado].sumaTiemposReponer,
        resultado.total_tiempo_retardo
      );

      totales[idCatEmpleado].sumaA += parseInt(resultado.A);
    });

    // Restar tiempos extras y a reponer
    Object.keys(totales).forEach((idEmpleado) => {
      const resultado = resultadosFinales[idEmpleado];

      // Convertir tiempos extras y a reponer a segundos
      let TotalTiemposReponer = "00:00:00";

      let TotalTiemposExtra = restarHoras(
        resultado.sumaTiemposExtra,
        resultado.sumaTiemposReponer
      );

      if (!timeRegex.test(TotalTiemposExtra)) {
        TotalTiemposExtra = "00:00:00";
        TotalTiemposReponer = restarHoras(
          resultado.sumaTiemposExtra,
          resultado.sumaTiemposReponer
        );
        // Actualizar la propiedad con la nueva suma de horas trabajadas
        resultado.sumaTiemposExtra = TotalTiemposExtra;
        // Actualizar la propiedad con la nueva suma de horas trabajadas
        resultado.sumaTiemposReponer = TotalTiemposReponer;
      } else {
        // Actualizar la propiedad con la nueva suma de horas trabajadas
        resultado.sumaTiemposExtra = TotalTiemposExtra;
        // Actualizar la propiedad con la nueva suma de horas trabajadas
        resultado.sumaTiemposReponer = TotalTiemposReponer;
      }
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      results: resultadosFinales,
      totales,
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
