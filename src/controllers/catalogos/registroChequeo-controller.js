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
const DetallePermisosEmpleado = require("../../models/modelos/detalles/detalle_permisos_empleado");

/**
 * OBTIENE TODOS LOS CHEQUEOS REGISTRADOS DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con chequeos registrados tipo JSON.
 */
const registroChequeoGet = async (req = request, res = response) => {
  try {
    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO CHEQUEOS Y SUS RELACIONES.
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
 * GENERAMOS UN REPORTE DE CHEQUEOS SEGUN SUS ESPECIFICACIONES
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con reporte de chequeos tipo JSON.
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
      where: query,
      order: [["fecha", "DESC"]],
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
 * REGISTRA UN NUEVO CHEQUEO EN LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con chequeo tipo JSON.
 */
const registroChequeoPost = async (req = request, res = response) => {
  try {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    // EXTRAEMOS LOS DATOS NECESARIOS DEL CUERPO DE LA SOLICITUD.
    const { evento, id_empleado, entrada_salida } = req.body;

    const dateActual = new Date();

    const fecha = dateActual.toISOString().slice(0, 10);
    const hora = dateActual.toTimeString().slice(0, 8);

    const date = new Date(fecha);
    let dia = date.getDay() + 1;

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO DETALLES DE SI HUBO ALGUN REGISTRO PREVIO ESE DIA.
    const registroPrevio = await RegistroChequeo.findOne({
      include: [
        {
          model: DetalleDiasEntradaSalida,
          as: "detalleDiasEntradaSalida",
          where: { fk_cat_entrada_salida: entrada_salida },
        },
      ],
      where: {
        fecha,
        fk_cat_empleado: id_empleado,
      },
    });

    if (registroPrevio) {
      //RETORNAMOS MENSAJE DE ERROR
      return res.status(400).json({
        ok: false,
        results: {
          msg: `El empleado con el ID ${id_empleado} ya cuenta con un chequeo de ese tipo el dia de hoy`,
        },
      });
    }

    // BUSCAMOS AL EMPLEADO DENTRO DE LA BASE DE DATOS.
    const empleado = await Empleado.findByPk(id_empleado);
    const puestoTrabajo = await PuestoTrabajo.findByPk(
      empleado.fk_cat_puesto_trabajo
    );
    // CREAMOS UNA NUEVO CHEQUEO EN LA BASE DE DATOS.
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

        // VALIDAMOS QUE CUMPLA CON LA EXPRESION REGULAR DE FORMATO "00:00:00".
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

        // VALIDAMOS QUE CUMPLA CON LA EXPRESION REGULAR DE FORMATO "00:00:00".
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

        // VALIDAMOS QUE CUMPLA CON LA EXPRESION REGULAR DE FORMATO "00:00:00".
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

        // VALIDAMOS QUE CUMPLA CON LA EXPRESION REGULAR DE FORMATO "00:00:00".
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

        // VALIDAMOS QUE CUMPLA CON LA EXPRESION REGULAR DE FORMATO "00:00:00".
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
    res.status(200).json({
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
 * NOTIFICA QUE NO SE HA CHECADO EN EL TIEMPO ESPERADO.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con mensaje de envio tipo JSON.
 */
const notificarNoChequeoPost = async (req, res = response) => {
  try {
    const { correo, tipo = 1 } = req.body;

    // BUSCAMOS AL USUARIO DENTRO DE LA BASE DE DATOS.
    const usuario = await Usuario.findOne({ where: { correo } });

    let name = "Usuario";
    // BUSCAMOS AL EMPLEADO DENTRO DE LA BASE DE DATOS.
    const empleado = await Empleado.findOne({
      where: { fk_cat_usuario: usuario.id_cat_usuario },
    });

    if (!empleado) {
      // BUSCAMOS AL CLIENTE DENTRO DE LA BASE DE DATOS.
      const cliente = await Cliente.findOne({
        where: { fk_cat_usuario: usuario.id_cat_usuario },
      });
      // BUSCAMOS A LA PERSONA DENTRO DE LA BASE DE DATOS.
      const persona = await Persona.findOne({
        where: { id_cat_persona: cliente.fk_cat_persona },
      });
      name = `${persona.nombre} ${persona.apellido_Paterno} ${persona.apellido_Materno}`;
    } else {
      // BUSCAMOS A LA PERSONA DENTRO DE LA BASE DE DATOS.
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
 * GENERA UN REPORTE DE EVENTOS POR EMPLEADO.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con eventos por empleado tipo JSON.
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

/**
 * GENERA UN REPORTE DE EVENTOS Y TIEMPOS FINALES POR EMPLEADOS ESPECIFICOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con eventos y tiempos tipo JSON.
 */
const reporteEventosYTiempoPost = async (req, res) => {
  try {
    // EXTRAEMOS LOS PARÁMETROS DE LA SOLICITUD.
    const { fecha_inicio, fecha_fin, tipo = 1, empleados } = req.body;
    const query = {};
    const query1 = {};
    const query2 = {};
    let totales = {};
    let permisosPendientes = [];
    let permisosRepuestos = [];
    let chequeos = [];
    let ausencias = [];

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

    switch (tipo) {
      case 1:
        // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS.
        chequeos = await RegistroChequeo.findAll({
          attributes: [
            "fk_cat_empleado",
            [pool.fn("DATE_TRUNC", "DAY", pool.col("fecha")), "inicio_semana"],
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

        query1.estatus = 3;

        permisosPendientes = await DetallePermisosEmpleado.findAll({
          attributes: [
            "fk_cat_empleado",
            [
              pool.fn("DATE_TRUNC", "DAY", pool.col("fecha_permiso")),
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

        permisosRepuestos = await DetallePermisosEmpleado.findAll({
          attributes: [
            "fk_cat_empleado",
            [
              pool.fn("DATE_TRUNC", "DAY", pool.col("fecha_reposicion")),
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

        ausencias = await Ausencia.findAll({
          attributes: [
            "fk_cat_empleado",
            [pool.fn("DATE_TRUNC", "DAY", pool.col("fecha")), "inicio_semana"],
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
        break;
      case 2:
        // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS.
        chequeos = await RegistroChequeo.findAll({
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
                pool.cast(
                  pool.fn("SUM", pool.col("tiempo_retardo")),
                  "interval"
                ),
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

        query1.estatus = 3;

        permisosPendientes = await DetallePermisosEmpleado.findAll({
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

        permisosRepuestos = await DetallePermisosEmpleado.findAll({
          attributes: [
            "fk_cat_empleado",
            [
              pool.fn("DATE_TRUNC", "WEEK", pool.col("fecha_reposicion")),
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

        ausencias = await Ausencia.findAll({
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
        break;
      case 3:
        // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS.
        chequeos = await RegistroChequeo.findAll({
          attributes: [
            "fk_cat_empleado",
            [
              pool.literal(`
                CASE
                  WHEN EXTRACT(DAY FROM fecha) <= 15 THEN DATE_TRUNC('MONTH', fecha)
                  ELSE DATE_TRUNC('MONTH', fecha) + INTERVAL '15 days'
                END
              `),
              "inicio_semana",
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

        query1.estatus = 3;

        permisosPendientes = await DetallePermisosEmpleado.findAll({
          attributes: [
            "fk_cat_empleado",
            [
              pool.literal(`
                CASE
                  WHEN EXTRACT(DAY FROM fecha_permiso) <= 15 THEN DATE_TRUNC('MONTH', fecha_permiso)
                  ELSE DATE_TRUNC('MONTH', fecha_permiso) + INTERVAL '15 days'
                END
              `),
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

        permisosRepuestos = await DetallePermisosEmpleado.findAll({
          attributes: [
            "fk_cat_empleado",
            [
              pool.fn("DATE_TRUNC", "DAY", pool.col("fecha_reposicion")),
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

        ausencias = await Ausencia.findAll({
          attributes: [
            "fk_cat_empleado",
            [
              pool.literal(`
                CASE
                  WHEN EXTRACT(DAY FROM fecha) <= 15 THEN DATE_TRUNC('MONTH', fecha)
                  ELSE DATE_TRUNC('MONTH', fecha) + INTERVAL '15 days'
                END
              `),
              "inicio_semana",
            ],
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
        break;
      case 4:
        // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS.
        chequeos = await RegistroChequeo.findAll({
          attributes: [
            "fk_cat_empleado",
            [
              pool.fn("DATE_TRUNC", "MONTH", pool.col("fecha")),
              "inicio_semana",
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

        query1.estatus = 3;

        permisosPendientes = await DetallePermisosEmpleado.findAll({
          attributes: [
            "fk_cat_empleado",
            [
              pool.fn("DATE_TRUNC", "MONTH", pool.col("fecha_permiso")),
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

        permisosRepuestos = await DetallePermisosEmpleado.findAll({
          attributes: [
            "fk_cat_empleado",
            [
              pool.fn("DATE_TRUNC", "MONTH", pool.col("fecha_reposicion")),
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

        ausencias = await Ausencia.findAll({
          attributes: [
            "fk_cat_empleado",
            [
              pool.fn("DATE_TRUNC", "MONTH", pool.col("fecha")),
              "inicio_semana",
            ],
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
        break;
    }

    // Unir los resultados
    // Mapeamos los resultados para reorganizar la estructura
    const chequeosEmpleado = chequeos.map((chequeo) => {
      const resultadoEmpleados = empleado.find((empleado) => {
        return empleado.fk_cat_empleado === chequeo.fk_cat_empleado;
      });

      const horasSemanales = `${resultadoEmpleados.detalleDiasEntradaSalida.cat_tipo_horario.dataValues.Horas_semanales}:00:00`;

      // Eliminar una comilla simple o doble al principio y al final
      let totalTiempoExtra = chequeo.dataValues.total_tiempo_extra.replace(
        /^['"]|['"]$/g,
        ""
      );
      // Eliminar una comilla simple o doble al principio y al final
      let totalTiempoRetardo = chequeo.dataValues.total_tiempo_retardo.replace(
        /^['"]|['"]$/g,
        ""
      );

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
        inicio_semana: chequeo.dataValues.inicio_semana,
        tiempo_trabajado: tiempoTrabajado,
        fk_cat_empleado: chequeo.fk_cat_empleado,
        total_tiempo_extra: totalTiempoExtra,
        total_tiempo_retardo: totalTiempoRetardo,
        R: chequeo.dataValues.R,
        SR: chequeo.dataValues.SR,
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
    const accesosAusencias = chequeosEmpleado.map((chequeos) => {
      const resultadoAusencia = ausencias.find((ausencia) => {
        return (
          ausencia.fk_cat_empleado === chequeos.fk_cat_empleado &&
          new Date(ausencia.dataValues.inicio_semana).toISOString() ===
            new Date(chequeos.inicio_semana).toISOString()
        );
      });

      return {
        horas_semanales: chequeos.horas_semanales,
        jornada: chequeos.jornada,
        inicio_semana: chequeos.inicio_semana,
        total_tiempo_extra: chequeos.total_tiempo_extra,
        total_tiempo_retardo: chequeos.total_tiempo_retardo,
        tiempo_trabajado: resultadoAusencia
          ? restarHoras(
              restarHoras(
                chequeos.tiempo_trabajado,
                `0${resultadoAusencia.dataValues.A * chequeos.jornada}:00:00`
              ),
              `0${resultadoAusencia.dataValues.As * 5}:00:00`
            )
          : chequeos.tiempo_trabajado,
        fk_cat_empleado: chequeos.fk_cat_empleado,
        R: chequeos.R,
        SR: chequeos.SR,
        A: resultadoAusencia ? resultadoAusencia.dataValues.A : "0",
        As: resultadoAusencia ? resultadoAusencia.dataValues.As : "0",
        empleado: chequeos.empleado,
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

// EXPORTAMOS LAS FUNCIONES PARA SU USO EN OTROS ARCHIVOS.
module.exports = {
  registroChequeoGet,
  registroChequeoPost,
  notificarNoChequeoPost,
  reportePost,
  reporteEventosYTiempoPost,
  reporteEventosEmpleadoPost,
};
