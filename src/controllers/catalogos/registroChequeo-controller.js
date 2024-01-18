// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require("express");
// IMPORTACIÓN DEL OPERADOR 'Op' DE SEQUELIZE PARA REALIZAR OPERACIONES COMPLEJAS.
const { Op } = require("sequelize");
// IMPORTACIÓN DEL MODELO 'TRANSPORTER' DESDE LA RUTA CORRESPONDIENTE.
const { transporter } = require("../../helpers/enviar-emails");
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
const {
  sumarHoras,
  restarHoras,
} = require("../../helpers/operacionesHorarias");
const Persona = require("../../models/modelos/catalogos/persona");
const Cliente = require("../../models/modelos/catalogos/cliente");

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
      registroChequeo,
    });
  } catch (error) {
    // MANEJO DE ERRORES, IMPRIMIMOS EL ERROR EN LA CONSOLA Y ENVIAMOS UNA RESPUESTA DE ERROR AL CLIENTE.
    console.log(error);
    res.status(500).json({
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
      registroChequeo,
    });
  } catch (error) {
    // MANEJO DE ERRORES, IMPRIMIMOS EL ERROR EN LA CONSOLA Y ENVIAMOS UNA RESPUESTA DE ERROR AL CLIENTE.
    console.log(error);
    res.status(500).json({
      msg: "Ha ocurrido un error, hable con el Administrador.",
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
    const { fecha, hora, evento, id_empleado, dia, entrada_salida } = req.body;

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

    let hora_llegada = "";
    switch (entrada_salida) {
      case 1:
        hora_llegada = sumarHoras(
          entradaSalida.hora,
          tolerancia.tiempo_tolerancia
        );
        break;
      case 3:
        hora_llegada = sumarHoras(entradaSalida.hora, "00:15:00");
        break;
      default:
        hora_llegada = entradaSalida.hora;
        break;
    }

    const tiempoRetardo = restarHoras(hora, hora_llegada);

    let registroChequeo = {};
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

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DEL REGISTRO.
    res.status(201).json({
      ok: true,
      msg: "Chequeo guardado correctamente",
      registroChequeo,
    });
  } catch (error) {
    // MANEJO DE ERRORES, IMPRIMIMOS EL ERROR EN LA CONSOLA Y ENVIAMOS UNA RESPUESTA DE ERROR AL CLIENTE.
    console.log(error);
    res.status(500).json({
      msg: "Ha ocurrido un error, hable con el Administrador.",
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

    if (tipo === 1) {
      const asunto = "Entrada de comida no checada";
      const mensaje = `<div style="background-color:#e0e0e0; padding: 20px; border-radius: 5px;"> <h3 style="color: #808080;">Hola ${name},</h3> <p style="line-height: 1.5;"> Notamos que aún no has registrado tu regreso de comer el día de hoy. Te recomendamos checarla y completarla lo antes posible para tener un registro preciso de tu tiempo diario. </p> <p style="line-height: 1.5;"><b>No dejes pasar más tiempo, ingresa a tu cuenta y capture su entrada despues de comer.</b></p> </div>`;

      const mailOptions = {
        from: '"Soporte" <soporte@midominio.com>',
        to: correo,
        subject: asunto,
        html: mensaje,
      };

      await transporter.sendMail(mailOptions);

      res.json({ ok: "Email sent successfully" });
    } else {
      const asunto = "Salida de la empresa no checada";
      const mensaje = `<div style="background-color:#e0e0e0; padding: 20px; border-radius: 5px;"> <h3 style="color: #808080;">Hola ${name},</h3> <p style="line-height: 1.5;"> Notamos que aún no has registrado tu salida de la empresa el día de hoy. Te recomendamos checarla y completarla lo antes posible para tener un registro preciso de tu tiempo diario. </p> <p style="line-height: 1.5;"><b>No dejes pasar más tiempo, ingresa a tu cuenta y capture su salida de la empresa.</b></p> </div>`;

      const mailOptions = {
        from: '"Soporte" <soporte@midominio.com>',
        to: correo,
        subject: asunto,
        html: mensaje,
      };

      await transporter.sendMail(mailOptions);

      res.json({ ok: "Email sent successfully" });
    }
  } catch (error) {
    console.error("Error sending email:", error.toString());
  }
};

// EXPORTAMOS LAS FUNCIONES PARA SU USO EN OTROS ARCHIVOS.
module.exports = {
  registroChequeoGet,
  registroChequeoPost,
  notificarNoChequeoPost,
  reportePost,
};
