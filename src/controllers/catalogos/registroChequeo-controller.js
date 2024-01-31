// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require("express");
// IMPORTACIÓN DEL OPERADOR 'Op' DE SEQUELIZE PARA REALIZAR OPERACIONES COMPLEJAS.
const { Op } = require("sequelize");
// IMPORTACIÓN DEL MODELO 'TRANSPORTER' DESDE LA RUTA CORRESPONDIENTE.
const { transporter } = require("../../helpers/enviar-emails");

const pool = require("../../database/config");
// IMPORTACIÓN DE LOS MODELOS NECESARIOS PARA REALIZAR CONSULTAS EN LA BASE DE DATOS.
const DetalleDiasEntradaSalida = require("../../models/modelos/detalles/detalle_dias_entrada_salida");
const EntradaSalida = require("../../models/modelos/catalogos/entradaSalida");
const Dias = require("../../models/modelos/catalogos/dias");
const TipoHorario = require("../../models/modelos/catalogos/tipoHorario");
const RegistroChequeo = require("../../models/modelos/catalogos/registroChequeo");
const Eventos = require("../../models/modelos/catalogos/eventos");
const Empleado = require("../../models/modelos/catalogos/empleado");
const PuestoTrabajo = require("../../models/modelos/catalogos/puestoTrabajo");
const Tolerancia = require("../../models/modelos/catalogos/tolerancia");
const Usuario = require("../../models/modelos/usuario");
const Persona = require("../../models/modelos/catalogos/persona");
const Cliente = require("../../models/modelos/catalogos/cliente");

const {
  sumarHoras,
  restarHoras,
} = require("../../helpers/operacionesHorarias");
const Ausencia = require("../../models/modelos/catalogos/ausencias");

/**
 * OBTIENE TODOS LOS CLIENTES ACTIVOS DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const registroChequeoGet = async (req = request, res = response) => {
  try {
    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO CLIENTES Y SUS RELACIONES.
    const registroChequeo = await RegistroChequeo.findAll({
      include: [
        { model: Eventos, as: "evento" },
        { model: Empleado, as: "empleado" },
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
      msg: "Ha ocurrido un error, hable con el Administrador.",
    });
  }
};

/**
 * OBTIENE LOS REGISTROS DE LA BITÁCORA DE ACCESOS SEGÚN LOS PARÁMETROS ESPECIFICADOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const reportePost = async (req, res) => {
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
      msg: "Ha ocurrido un error, hable con el Administrador.",
    });
  }
};

/**
 * OBTIENE LOS REGISTROS DE LA BITÁCORA DE ACCESOS SEGÚN LOS PARÁMETROS ESPECIFICADOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const reporteEventosYTiempoPost = async (req, res) => {
  try {
    // EXTRAEMOS LOS PARÁMETROS DE LA SOLICITUD.
    const { fecha_inicio, fecha_fin, tipo = 1, empleados } = req.body;
    const query = {};

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

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

    let resultado = {};
    const totales = {};

    switch (tipo) {
      case 1:
        resultado = await RegistroChequeo.findAll({
          attributes: [
            [pool.fn("DATE_TRUNC", "DAY", pool.col("fecha")), "fecha_dia"],
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
                pool.cast(
                  pool.fn("SUM", pool.col("tiempo_retardo")),
                  "interval"
                ),
                "'HH24:MI:SS'"
              ),
              "total_tiempo_retardo",
            ],
          ],
          group: ["fecha_dia", "id_cat_empleado", "id_cat_persona"],
          order: [["fecha_dia"]],
          where: query,
          include: [
            {
              model: Empleado,
              as: "empleado",
              include: [{ model: Persona, as: "persona" }],
            },
          ],
        });
        break;
      case 2:
        resultado = await RegistroChequeo.findAll({
          attributes: [
            [pool.fn("DATE_TRUNC", "week", pool.col("fecha")), "inicio_semana"],
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
                pool.cast(
                  pool.fn("SUM", pool.col("tiempo_retardo")),
                  "interval"
                ),
                "'HH24:MI:SS'"
              ),
              "total_tiempo_retardo",
            ],
          ],
          group: ["inicio_semana", "id_cat_empleado", "id_cat_persona"],
          order: [["inicio_semana"]],
          where: query,
          include: [
            {
              model: Empleado,
              as: "empleado",
              include: [{ model: Persona, as: "persona" }],
            },
          ],
        });
        break;
      case 3:
        resultado = await RegistroChequeo.findAll({
          attributes: [
            [
              pool.literal(`
                CASE
                  WHEN EXTRACT(DAY FROM fecha) <= 15 THEN DATE_TRUNC('MONTH', fecha)
                  ELSE DATE_TRUNC('MONTH', fecha) + INTERVAL '15 days'
                END
              `),
              "inicio_quincena",
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
                pool.cast(
                  pool.fn("SUM", pool.col("tiempo_retardo")),
                  "interval"
                ),
                "'HH24:MI:SS'"
              ),
              "total_tiempo_retardo",
            ],
          ],
          group: ["inicio_quincena", "id_cat_empleado", "id_cat_persona"],
          order: [["inicio_quincena"]],
          where: query,
          include: [
            {
              model: Empleado,
              as: "empleado",
              include: [{ model: Persona, as: "persona" }],
            },
          ],
        });
        break;
      case 4:
        resultado = await RegistroChequeo.findAll({
          attributes: [
            [pool.fn("DATE_TRUNC", "MONTH", pool.col("fecha")), "inicio_mes"],
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
                pool.cast(
                  pool.fn("SUM", pool.col("tiempo_retardo")),
                  "interval"
                ),
                "'HH24:MI:SS'"
              ),
              "total_tiempo_retardo",
            ],
          ],
          group: ["inicio_mes", "id_cat_empleado", "id_cat_persona"],
          order: [["inicio_mes"]],
          where: query,
          include: [
            {
              model: Empleado,
              as: "empleado",
              include: [{ model: Persona, as: "persona" }],
            },
          ],
        });
        break;
    }
    // Itera sobre los resultados y suma los valores
    resultado.forEach((resultado) => {
      console.log(resultado);
      const idCatEmpleado = resultado.empleado.id_cat_empleado;

      // Eliminar una comilla simple o doble al principio y al final
      let totalTiempoExtra = resultado.dataValues.total_tiempo_extra.replace(
        /^['"]|['"]$/g,
        ""
      );

      // Eliminar una comilla simple o doble al principio y al final
      let totalTiempoRetardo =
        resultado.dataValues.total_tiempo_retardo.replace(/^['"]|['"]$/g, "");

      // Verifica si ya existe una entrada para el empleado en el objeto
      if (!totales[idCatEmpleado]) {
        totales[idCatEmpleado] = {
          R: 0,
          SR: 0,
          total_tiempo_extra: "00:00:00",
          total_tiempo_retardo: "00:00:00",
        };
      }

      // Suma los valores para el empleado actual
      totales[idCatEmpleado].total_tiempo_extra = sumarHoras(
        totales[idCatEmpleado].total_tiempo_extra,
        totalTiempoExtra
      );

      totales[idCatEmpleado].total_tiempo_retardo = sumarHoras(
        totales[idCatEmpleado].total_tiempo_retardo,
        totalTiempoRetardo
      );

      totales[idCatEmpleado].R += parseInt(resultado.dataValues.R);

      totales[idCatEmpleado].SR += parseInt(resultado.dataValues.SR);
    });
    // Restar tiempos extras y a reponer
    Object.keys(totales).forEach((idEmpleado) => {
      const resultado = totales[idEmpleado];

      // Convertir tiempos extras y a reponer a segundos
      let TotalTiemposReponer = "00:00:00";

      let TotalTiemposExtra = restarHoras(
        resultado.total_tiempo_extra,
        resultado.total_tiempo_retardo
      );

      if (!timeRegex.test(TotalTiemposExtra)) {
        TotalTiemposExtra = "00:00:00";
        TotalTiemposReponer = restarHoras(
          resultado.total_tiempo_retardo,
          resultado.total_tiempo_extra
        );
        // Actualizar la propiedad con la nueva suma de horas trabajadas
        resultado.total_tiempo_extra = TotalTiemposExtra;
        // Actualizar la propiedad con la nueva suma de horas trabajadas
        resultado.total_tiempo_retardo = TotalTiemposReponer;
      } else {
        // Actualizar la propiedad con la nueva suma de horas trabajadas
        resultado.total_tiempo_extra = TotalTiemposExtra;
        // Actualizar la propiedad con la nueva suma de horas trabajadas
        resultado.total_tiempo_retardo = TotalTiemposReponer;
      }
    });
    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      results: { resultado, totales },
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
 * REGISTRA UN NUEVO CLIENTE EN LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const registroChequeoPost = async (req = request, res = response) => {
  try {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    // EXTRAEMOS LOS DATOS NECESARIOS DEL CUERPO DE LA SOLICITUD.
    const { fecha, hora, evento, id_empleado, entrada_salida } = req.body;

    const date = new Date(fecha);
    let dia = date.getDay() + 1;

    // BUSCAMOS AL EMPLEADO DENTRO DE LA BASE DE DATOS.
    const empleado = await Empleado.findByPk(id_empleado);
    const puestoTrabajo = await PuestoTrabajo.findByPk(
      empleado.fk_cat_puesto_trabajo
    );
    // CREAMOS UNA NUEVA PERSONA EN LA BASE DE DATOS.
    const detalleDiasEntradaSalida = await DetalleDiasEntradaSalida.create({
      fk_cat_dias: dia,
      fk_cat_entrada_salida: entrada_salida,
      fk_cat_tipo_horario: puestoTrabajo.fk_cat_tipo_horario,
    });
    const tolerancia = await Tolerancia.findByPk(empleado.fk_cat_tolerancia);
    const entradaSalida = await EntradaSalida.findByPk(entrada_salida);

    let registroChequeo = {};
    let hora_llegada = "";
    let tiempoRetardo = "";
    switch (entrada_salida) {
      case 1:
        hora_llegada = sumarHoras(
          entradaSalida.hora,
          tolerancia.tiempo_tolerancia
        );

        tiempoRetardo = restarHoras(hora, hora_llegada);

        // CREAMOS UNA NUEVA PERSONA EN LA BASE DE DATOS.
        if (!timeRegex.test(tiempoRetardo)) {
          const tiempoExtra = restarHoras(entradaSalida.hora, hora);
          if (!timeRegex.test(tiempoExtra)) {
            registroChequeo = await RegistroChequeo.create({
              fecha: fecha,
              hora: hora,
              tiempo_retardo: "00:00:00",
              fk_cat_eventos: evento,
              fk_cat_empleado: id_empleado,
              fk_detalle_dias_entrada_salida:
                detalleDiasEntradaSalida.id_detalle_entrada_salida,
              tiempo_extra: "00:00:00",
            });
          } else {
            registroChequeo = await RegistroChequeo.create({
              fecha: fecha,
              hora: hora,
              tiempo_retardo: "00:00:00",
              fk_cat_eventos: evento,
              fk_cat_empleado: id_empleado,
              fk_detalle_dias_entrada_salida:
                detalleDiasEntradaSalida.id_detalle_entrada_salida,
              tiempo_extra: tiempoExtra,
            });
          }
        } else {
          registroChequeo = await RegistroChequeo.create({
            fecha: fecha,
            hora: hora,
            tiempo_retardo: tiempoRetardo,
            fk_cat_eventos: evento,
            fk_cat_empleado: id_empleado,
            fk_detalle_dias_entrada_salida:
              detalleDiasEntradaSalida.id_detalle_entrada_salida,
            tiempo_extra: "00:00:00",
          });
        }
        break;
      case 2:
        hora_llegada = entradaSalida.hora;
        tiempoExtra = restarHoras(hora, hora_llegada);

        // CREAMOS UNA NUEVA PERSONA EN LA BASE DE DATOS.
        if (!timeRegex.test(tiempoExtra)) {
          const tiempoRetardo = restarHoras(hora_llegada, hora);
          if (!timeRegex.test(tiempoRetardo)) {
            registroChequeo = await RegistroChequeo.create({
              fecha: fecha,
              hora: hora,
              tiempo_retardo: "00:00:00",
              fk_cat_eventos: evento,
              fk_cat_empleado: id_empleado,
              fk_detalle_dias_entrada_salida:
                detalleDiasEntradaSalida.id_detalle_entrada_salida,
              tiempo_extra: "00:00:00",
            });
          } else {
            registroChequeo = await RegistroChequeo.create({
              fecha: fecha,
              hora: hora,
              tiempo_retardo: tiempoRetardo,
              fk_cat_eventos: evento,
              fk_cat_empleado: id_empleado,
              fk_detalle_dias_entrada_salida:
                detalleDiasEntradaSalida.id_detalle_entrada_salida,
              tiempo_extra: "00:00:00",
            });
          }
        } else {
          registroChequeo = await RegistroChequeo.create({
            fecha: fecha,
            hora: hora,
            tiempo_retardo: "00:00:00",
            fk_cat_eventos: evento,
            fk_cat_empleado: id_empleado,
            fk_detalle_dias_entrada_salida:
              detalleDiasEntradaSalida.id_detalle_entrada_salida,
            tiempo_extra: tiempoExtra,
          });
        }
        break;
      case 3:
        hora_llegada = sumarHoras(entradaSalida.hora, "00:15:00");
        tiempoRetardo = restarHoras(hora, hora_llegada);

        // CREAMOS UNA NUEVA PERSONA EN LA BASE DE DATOS.
        if (!timeRegex.test(tiempoRetardo)) {
          const tiempoExtra = restarHoras(entradaSalida.hora, hora);
          if (!timeRegex.test(tiempoExtra)) {
            registroChequeo = await RegistroChequeo.create({
              fecha: fecha,
              hora: hora,
              tiempo_retardo: "00:00:00",
              fk_cat_eventos: evento,
              fk_cat_empleado: id_empleado,
              fk_detalle_dias_entrada_salida:
                detalleDiasEntradaSalida.id_detalle_entrada_salida,
              tiempo_extra: "00:00:00",
            });
          } else {
            registroChequeo = await RegistroChequeo.create({
              fecha: fecha,
              hora: hora,
              tiempo_retardo: "00:00:00",
              fk_cat_eventos: evento,
              fk_cat_empleado: id_empleado,
              fk_detalle_dias_entrada_salida:
                detalleDiasEntradaSalida.id_detalle_entrada_salida,
              tiempo_extra: tiempoExtra,
            });
          }
        } else {
          registroChequeo = await RegistroChequeo.create({
            fecha: fecha,
            hora: hora,
            tiempo_retardo: tiempoRetardo,
            fk_cat_eventos: evento,
            fk_cat_empleado: id_empleado,
            fk_detalle_dias_entrada_salida:
              detalleDiasEntradaSalida.id_detalle_entrada_salida,
            tiempo_extra: "00:00:00",
          });
        }
        break;
      case 4:
        hora_llegada = entradaSalida.hora;
        tiempoExtra = restarHoras(hora, hora_llegada);

        // CREAMOS UNA NUEVA PERSONA EN LA BASE DE DATOS.
        if (!timeRegex.test(tiempoExtra)) {
          const tiempoRetardo = restarHoras(hora_llegada, hora);
          if (!timeRegex.test(tiempoRetardo)) {
            registroChequeo = await RegistroChequeo.create({
              fecha: fecha,
              hora: hora,
              tiempo_retardo: "00:00:00",
              fk_cat_eventos: evento,
              fk_cat_empleado: id_empleado,
              fk_detalle_dias_entrada_salida:
                detalleDiasEntradaSalida.id_detalle_entrada_salida,
              tiempo_extra: "00:00:00",
            });
          } else {
            registroChequeo = await RegistroChequeo.create({
              fecha: fecha,
              hora: hora,
              tiempo_retardo: tiempoRetardo,
              fk_cat_eventos: evento,
              fk_cat_empleado: id_empleado,
              fk_detalle_dias_entrada_salida:
                detalleDiasEntradaSalida.id_detalle_entrada_salida,
              tiempo_extra: "00:00:00",
            });
          }
        } else {
          registroChequeo = await RegistroChequeo.create({
            fecha: fecha,
            hora: hora,
            tiempo_retardo: "00:00:00",
            fk_cat_eventos: evento,
            fk_cat_empleado: id_empleado,
            fk_detalle_dias_entrada_salida:
              detalleDiasEntradaSalida.id_detalle_entrada_salida,
            tiempo_extra: tiempoExtra,
          });
        }
        break;
      default:
        hora_llegada = entradaSalida.hora;
        tiempoExtra = restarHoras(hora, hora_llegada);

        // CREAMOS UNA NUEVA PERSONA EN LA BASE DE DATOS.
        if (!timeRegex.test(tiempoExtra)) {
          const tiempoRetardo = restarHoras(hora_llegada, hora);
          if (!timeRegex.test(tiempoRetardo)) {
            registroChequeo = await RegistroChequeo.create({
              fecha: fecha,
              hora: hora,
              tiempo_retardo: "00:00:00",
              fk_cat_eventos: evento,
              fk_cat_empleado: id_empleado,
              fk_detalle_dias_entrada_salida:
                detalleDiasEntradaSalida.id_detalle_entrada_salida,
              tiempo_extra: "00:00:00",
            });
          } else {
            registroChequeo = await RegistroChequeo.create({
              fecha: fecha,
              hora: hora,
              tiempo_retardo: tiempoRetardo,
              fk_cat_eventos: evento,
              fk_cat_empleado: id_empleado,
              fk_detalle_dias_entrada_salida:
                detalleDiasEntradaSalida.id_detalle_entrada_salida,
              tiempo_extra: "00:00:00",
            });
          }
        } else {
          registroChequeo = await RegistroChequeo.create({
            fecha: fecha,
            hora: hora,
            tiempo_retardo: "00:00:00",
            fk_cat_eventos: evento,
            fk_cat_empleado: id_empleado,
            fk_detalle_dias_entrada_salida:
              detalleDiasEntradaSalida.id_detalle_entrada_salida,
            tiempo_extra: tiempoExtra,
          });
        }
        break;
    }

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DEL REGISTRO.
    res.status(201).json({
      ok: true,
      results: { registroChequeo, msg: "Chequeo guardado correctamente" },
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
 * MANEJA EL PROCESO DE INICIO DE SESIÓN PARA UN USUARIO.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const notificarNoChequeoPost = async (req, res = response) => {
  try {
    const { correo, tipo = 1 } = req.body;

    // BUSCAMOS AL USUARIO DENTRO DE LA BASE DE DATOS.
    const usuario = await Usuario.findOne({ where: { correo } });

    let name = "Usuario";
    // BUSCAMOS AL USUARIO DENTRO DE LA BASE DE DATOS.
    const empleado = await Empleado.findOne({
      where: { fk_cat_usuario: usuario.id_cat_usuario },
    });

    if (!empleado) {
      // BUSCAMOS AL USUARIO DENTRO DE LA BASE DE DATOS.
      const cliente = await Cliente.findOne({
        where: { fk_cat_usuario: usuario.id_cat_usuario },
      });
      // BUSCAMOS AL USUARIO DENTRO DE LA BASE DE DATOS.
      const persona = await Persona.findOne({
        where: { id_cat_persona: cliente.fk_cat_persona },
      });
      name = `${persona.nombre} ${persona.apellido_Paterno} ${persona.apellido_Materno}`;
    } else {
      // BUSCAMOS AL USUARIO DENTRO DE LA BASE DE DATOS.
      const persona = await Persona.findOne({
        where: { id_cat_persona: empleado.fk_cat_persona },
      });
      name = `${persona.nombre} ${persona.apellido_Paterno} ${persona.apellido_Materno}`;
    }

    let asunto = "";
    let mensaje = "";
    let mailOptions = {};

    switch (tipo) {
      case 1:
        asunto = "Entrada a la empresa no checada";
        mensaje = `<div style="background-color:#e0e0e0; padding: 20px; border-radius: 5px;"> <h3 style="color: #808080;">Hola ${name},</h3> <p style="line-height: 1.5;"> Notamos que aún no has registrado tu ingreso a la empresa el día de hoy. Te recomendamos checarla y completarla lo antes posible para tener un registro preciso de tu tiempo diario. </p> <p style="line-height: 1.5;"><b>No dejes pasar más tiempo, ingresa a tu cuenta y capture su entrada a la empresa.</b></p> </div>`;

        mailOptions = {
          from: '"Soporte" <soporte@midominio.com>',
          to: correo,
          subject: asunto,
          html: mensaje,
        };
        break;
      case 2:
        asunto = "Salida a comer no checada";
        mensaje = `<div style="background-color:#e0e0e0; padding: 20px; border-radius: 5px;"> <h3 style="color: #808080;">Hola ${name},</h3> <p style="line-height: 1.5;"> Notamos que aún no has registrado tu salida a comer el día de hoy. Te recomendamos checarla y completarla lo antes posible para tener un registro preciso de tu tiempo diario. </p> <p style="line-height: 1.5;"><b>No dejes pasar más tiempo, ingresa a tu cuenta y capture su salida a comer.</b></p> </div>`;

        mailOptions = {
          from: '"Soporte" <soporte@midominio.com>',
          to: correo,
          subject: asunto,
          html: mensaje,
        };
        break;
      case 3:
        asunto = "Salida de la empresa no checada";
        mensaje = `<div style="background-color:#e0e0e0; padding: 20px; border-radius: 5px;"> <h3 style="color: #808080;">Hola ${name},</h3> <p style="line-height: 1.5;"> Notamos que aún no has registrado tu salida de la empresa el día de hoy. Te recomendamos checarla y completarla lo antes posible para tener un registro preciso de tu tiempo diario. </p> <p style="line-height: 1.5;"><b>No dejes pasar más tiempo, ingresa a tu cuenta y capture su salida de la empresa.</b></p> </div>`;

        mailOptions = {
          from: '"Soporte" <soporte@midominio.com>',
          to: correo,
          subject: asunto,
          html: mensaje,
        };
        break;
      case 4:
        asunto = "Salida de la empresa no checada";
        mensaje = `<div style="background-color:#e0e0e0; padding: 20px; border-radius: 5px;"> <h3 style="color: #808080;">Hola ${name},</h3> <p style="line-height: 1.5;"> Notamos que aún no has registrado tu salida de la empresa el día de hoy. Te recomendamos checarla y completarla lo antes posible para tener un registro preciso de tu tiempo diario. </p> <p style="line-height: 1.5;"><b>No dejes pasar más tiempo, ingresa a tu cuenta y capture su salida de la empresa.</b></p> </div>`;

        mailOptions = {
          from: '"Soporte" <soporte@midominio.com>',
          to: correo,
          subject: asunto,
          html: mensaje,
        };
        break;
        await transporter.sendMail(mailOptions);
        res.json({ ok: true, results: { msg: "Email sent successfully" } });
    }
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
 * OBTIENE LOS REGISTROS DE LA BITÁCORA DE ACCESOS SEGÚN LOS PARÁMETROS ESPECIFICADOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const reporteEventosEmpleadoPost = async (req, res) => {
  try {
    // EXTRAEMOS LOS PARÁMETROS DE LA SOLICITUD.
    const { id_empleado } = req.body;
    const query = {};

    query.fk_cat_empleado = {
      [Op.eq]: id_empleado,
    };
    const resultado1 = await Ausencia.findAll({
      order: [["fecha"]],
      where: query,
    });
    query.fk_cat_eventos = {
      [Op.ne]: 1,
    };

    const resultado = await RegistroChequeo.findAll({
      order: [["fecha"]],
      where: query,
    });

    // Combina los dos arrays
    const resultadosCombinados = [...resultado1, ...resultado];

    // Ordena el array combinado por fecha
    resultadosCombinados.sort((b, a) => new Date(a.fecha) - new Date(b.fecha));

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      results: { resultadosCombinados },
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

// EXPORTAMOS LAS FUNCIONES PARA SU USO EN OTROS ARCHIVOS.
module.exports = {
  registroChequeoGet,
  registroChequeoPost,
  notificarNoChequeoPost,
  reportePost,
  reporteEventosYTiempoPost,
  reporteEventosEmpleadoPost,
};
