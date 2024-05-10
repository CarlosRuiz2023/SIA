// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require("express");
// IMPORTACIÓN DEL OPERADOR 'Op' DE SEQUELIZE PARA REALIZAR OPERACIONES COMPLEJAS.
const { Op } = require("sequelize");
const pool = require("../../database/config");
// IMPORTACIÓN DEL MODELO DE BASE DE DATOS.
const EntradaSalida = require("../../models/modelos/catalogos/entradaSalida");
const RegistroChequeo = require("../../models/modelos/catalogos/registroChequeo");
const DetalleDiasEntradaSalida = require("../../models/modelos/detalles/detalle_dias_entrada_salida");
const DetallePermisosEmpleado = require("../../models/modelos/detalles/detalle_permisos_empleado");
const TipoHorario = require("../../models/modelos/catalogos/tipoHorario");
const Empleado = require("../../models/modelos/catalogos/empleado");
const Persona = require("../../models/modelos/catalogos/persona");
const {
  sumarHoras,
  restarHoras,
} = require("../../helpers/operacionesHorarias");
const Ausencia = require("../../models/modelos/catalogos/ausencias");
const Eventos = require("../../models/modelos/catalogos/eventos");
const Dias = require("../../models/modelos/catalogos/dias");

/**
 * OBTIENE REGISTROS DE ESE DIA SEGUN LOS EMPLEADOS ESPECIFICADOS EN EL SERVICIO.
 * @async
 * @function entradaSalidaGet
 * @param {request} req - OBJETO DE SOLICITUD HTTP.
 * @param {response} res - OBJETO DE RESPUESTA HTTP.
 * @returns {Object} RESPUESTA JSON CON REGISTROS OBTENIDOS.
 */
const entradaSalidaPost = async (req = request, res = response) => {
  try {
    // EXTRAEMOS LOS PARÁMETROS DE LA SOLICITUD.
    const { empleados } = req.body;
    const query = {};

    const dateActual = new Date();

    const fecha = dateActual.toISOString().slice(0, 10);

    // AGREGAMOS CONDICIONES A LA CONSULTA DE ACUERDO A LOS PARÁMETROS RECIBIDOS.
    query.fecha = fecha;
    if (empleados && empleados.length > 0) {
      query.fk_cat_empleado = {
        [Op.in]: empleados,
      };
    }
    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS.
    const registroChequeo = await RegistroChequeo.findAll({
      where: query,
      include: [
        {
          model: Empleado,
          as: "empleado",
          include: [{ model: Persona, as: "persona" }],
        },
        { model: Eventos, as: "evento" },
        {
          model: DetalleDiasEntradaSalida,
          as: "detalleDiasEntradaSalida",
          include: [
            {
              model: Dias,
              as: "cat_dia",
            },
            {
              model: TipoHorario,
              as: "cat_tipo_horario",
            },
            {
              model: EntradaSalida,
              as: "cat_entrada_salida",
            },
          ],
        },
      ],
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      results: registroChequeo,
    });
  } catch (error) {
    // MANEJO DE ERRORES, IMPRIMIMOS EL ERROR EN LA CONSOLA Y ENVIAMOS UNA RESPUESTA DE ERROR AL CLIENTE.
    console.log(error);
    res.status(500).json({
      ok: false,
      results: {
        msg: "Ha ocurrido un error, hable con el Administrador.",
      },
    });
  }
};

/**
 * GENERA UN REPORTE DE ENTRADAS Y SALIDAS SEGUN SUS ESPECIFICACIONES.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con su reporte tipo JSON.
 */
const reporteEntradasSalidasPost = async (req, res) => {
  try {
    // EXTRAEMOS LOS PARÁMETROS DE LA SOLICITUD.
    const { fecha_inicio, fecha_fin, empleados } = req.body;
    const query = {};
    const query1 = {};
    const query2 = {};
    const totales = {};

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

    if (empleados && empleados.length > 0) {
      query.fk_cat_empleado = {
        [Op.in]: empleados,
      };
    }

    const empleado = await RegistroChequeo.findAll({
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

    if (empleados && empleados.length > 0) {
      query1.fk_cat_empleado = {
        [Op.in]: empleados,
      };
    }

    if (fecha_inicio && fecha_fin) {
      query1.fecha_permiso = {
        [Op.gte]: fecha_inicio,
        [Op.lte]: fecha_fin,
      };
    }

    query1.estatus = 3;

    if (empleados && empleados.length > 0) {
      query2.fk_cat_empleado = {
        [Op.in]: empleados,
      };
    }

    if (fecha_inicio && fecha_fin) {
      query2.fecha_reposicion = {
        [Op.gte]: fecha_inicio,
        [Op.lte]: fecha_fin,
      };
    }

    query2.estatus = 4;

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS.
    const chequeos = await RegistroChequeo.findAll({
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

    const permisosPendientes = await DetallePermisosEmpleado.findAll({
      attributes: [
        "fk_cat_empleado",
        [
          pool.fn("DATE_TRUNC", "week", pool.col("fecha_permiso")),
          "inicio_semana",
        ],
        [
          pool.fn(
            "COUNT",
            pool.literal(`
            CASE WHEN estatus = 3 THEN 1 ELSE NULL END
          `)
          ),
          "Pp",
        ],
        [pool.fn("SUM", pool.col("tiempo_horas")), "total_tiempo_horas"],
      ],
      group: ["inicio_semana", "fk_cat_empleado"],
      order: [["inicio_semana"]],
      where: query1,
    });

    const permisosRepuestos = await DetallePermisosEmpleado.findAll({
      attributes: [
        "fk_cat_empleado",
        [
          pool.fn("DATE_TRUNC", "week", pool.col("fecha_reposicion")),
          "inicio_semana",
        ],
        [
          pool.fn(
            "COUNT",
            pool.literal(`
            CASE WHEN estatus = 4 THEN 1 ELSE NULL END
          `)
          ),
          "Pr",
        ],
        [pool.fn("SUM", pool.col("tiempo_horas")), "total_tiempo_horas"],
      ],
      group: ["inicio_semana", "fk_cat_empleado"],
      order: [["inicio_semana"]],
      where: query2,
    });

    query.estatus = 0;

    const ausencias = await Ausencia.findAll({
      attributes: [
        "fk_cat_empleado",
        [pool.fn("DATE_TRUNC", "week", pool.col("fecha")), "inicio_semana"],
        [
          pool.fn(
            "COUNT",
            pool.literal(`
              CASE WHEN fk_cat_dia != 6 AND estatus = 0 THEN 1 ELSE NULL END
            `)
          ),
          "A",
        ],
        [
          pool.fn(
            "COUNT",
            pool.literal(`
              CASE WHEN fk_cat_dia = 6 AND estatus = 0 THEN 1 ELSE NULL END
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
    const chequeosEmpleado = chequeos.map((resultado) => {
      const resultadoEmpleados = empleado.find((resultado2) => {
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
    const accesosAusencias = chequeosEmpleado.map((resultadoFinal) => {
      const resultadoAusencia = ausencias.find((resultado1) => {
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

    // Unir los resultados
    const chequeosPermisos = accesosAusencias.map((resultadoFinal) => {
      const resultadoPermiso = permisosPendientes.find((permiso) => {
        return (
          permiso.fk_cat_empleado === resultadoFinal.fk_cat_empleado &&
          new Date(permiso.dataValues.inicio_semana).toISOString() ===
            new Date(resultadoFinal.inicio_semana).toISOString()
        );
      });

      return {
        horas_semanales: resultadoFinal.horas_semanales,
        jornada: resultadoFinal.jornada,
        inicio_semana: resultadoFinal.inicio_semana,
        total_tiempo_extra: resultadoFinal.total_tiempo_extra,
        total_tiempo_retardo: resultadoPermiso
          ? sumarHoras(
              resultadoFinal.total_tiempo_retardo,
              `0${
                resultadoPermiso.dataValues.Pp *
                resultadoPermiso.dataValues.total_tiempo_horas
              }:00:00`
            )
          : resultadoFinal.total_tiempo_retardo,
        tiempo_trabajado: resultadoPermiso
          ? restarHoras(
              resultadoFinal.tiempo_trabajado,
              `0${
                resultadoPermiso.dataValues.Pp *
                resultadoPermiso.dataValues.tiempo_horas
              }:00:00`
            )
          : resultadoFinal.tiempo_trabajado,
        fk_cat_empleado: resultadoFinal.fk_cat_empleado,
        R: resultadoFinal.R,
        SR: resultadoFinal.SR,
        A: resultadoFinal.A,
        As: resultadoFinal.As,
        Pp: resultadoPermiso ? resultadoPermiso.dataValues.Pp : "0",
        empleado: resultadoFinal.empleado,
      };
    });

    // Unir los resultados
    const resultadosFinales = chequeosPermisos.map((resultadoFinal) => {
      const resultadoPermiso = permisosRepuestos.find((permiso) => {
        return (
          permiso.fk_cat_empleado === resultadoFinal.fk_cat_empleado &&
          new Date(permiso.dataValues.inicio_semana).toISOString() ===
            new Date(resultadoFinal.inicio_semana).toISOString()
        );
      });

      return {
        horas_semanales: resultadoFinal.horas_semanales,
        jornada: resultadoFinal.jornada,
        inicio_semana: resultadoFinal.inicio_semana,
        total_tiempo_extra: resultadoPermiso
          ? restarHoras(
              resultadoFinal.total_tiempo_extra,
              `0${
                resultadoPermiso.dataValues.Pr *
                resultadoPermiso.dataValues.total_tiempo_horas
              }:00:00`
            )
          : resultadoFinal.total_tiempo_extra,
        total_tiempo_retardo: resultadoFinal.total_tiempo_extra,
        tiempo_trabajado: resultadoPermiso
          ? sumarHoras(
              resultadoFinal.tiempo_trabajado,
              `0${
                resultadoPermiso.dataValues.Pr *
                resultadoPermiso.dataValues.tiempo_horas
              }:00:00`
            )
          : resultadoFinal.tiempo_trabajado,
        fk_cat_empleado: resultadoFinal.fk_cat_empleado,
        R: resultadoFinal.R,
        SR: resultadoFinal.SR,
        A: resultadoFinal.A,
        As: resultadoFinal.As,
        Pp: resultadoFinal.Pp,
        Pr: resultadoPermiso ? resultadoPermiso.dataValues.Pr : "0",
        empleado: resultadoFinal.empleado,
      };
    });

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
          sumaPp: 0,
          sumaPr: 0,
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

      totales[idCatEmpleado].sumaAs += parseInt(resultado.As);

      totales[idCatEmpleado].sumaR += parseInt(resultado.R);

      totales[idCatEmpleado].sumaSR += parseInt(resultado.SR);

      totales[idCatEmpleado].sumaPp += parseInt(resultado.Pp);

      totales[idCatEmpleado].sumaPr += parseInt(resultado.Pr);
    });

    // Restar tiempos extras y a reponer
    Object.keys(totales).forEach((idEmpleado) => {
      const resultado = totales[idEmpleado];

      // Convertir tiempos extras y a reponer a segundos
      let TotalTiemposReponer = "00:00:00";

      let TotalTiemposExtra = restarHoras(
        resultado.sumaTiemposExtra,
        resultado.sumaTiemposReponer
      );

      if (!timeRegex.test(TotalTiemposExtra)) {
        TotalTiemposExtra = "00:00:00";
        TotalTiemposReponer = restarHoras(
          resultado.sumaTiemposReponer,
          resultado.sumaTiemposExtra
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
  entradaSalidaPost,
  reporteEntradasSalidasPost,
};
