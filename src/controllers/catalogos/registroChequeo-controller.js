// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require("express");

// IMPORTACIÓN DE LOS MODELOS NECESARIOS PARA REALIZAR CONSULTAS EN LA BASE DE DATOS.
const DetalleDiasEntradaSalida = require("../../models/modelos/detalles/detalle_dias_entrada_salida");
const EntradaSalida = require("../../models/modelos/catalogos/entradaSalida");
const Dias = require("../../models/modelos/catalogos/dias");
const TipoHorario = require("../../models/modelos/catalogos/tipoHorario");
const RegistroChequeo = require("../../models/modelos/catalogos/registroChequeo");
const Eventos = require("../../models/modelos/catalogos/eventos");
const Empleado = require("../../models/modelos/catalogos/empleado");
const PuestoTrabajo = require("../../models/modelos/catalogos/puestoTrabajo");

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
 * REGISTRA UN NUEVO CLIENTE EN LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const registroChequeoPost = async (req = request, res = response) => {
  try {
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
    const entradaSalida = await EntradaSalida.findByPk(entrada_salida);
    const tiempoRetardo = restarHoras(hora, entradaSalida.hora);
    // CREAMOS UNA NUEVA PERSONA EN LA BASE DE DATOS.
    let registroChequeo = {};
    try {
      registroChequeo = await RegistroChequeo.create({
        fecha: fecha,
        hora: hora,
        tiempo_retardo: tiempoRetardo,
        fk_cat_eventos: evento,
        fk_cat_empleado: id_empleado,
        fk_detalle_dias_entrada_salida:
          detalleDiasEntradaSalida.id_detalle_entrada_salida,
      });
    } catch (err) {
      registroChequeo = await RegistroChequeo.create({
        fecha: fecha,
        hora: hora,
        tiempo_retardo: "00:00:00",
        fk_cat_eventos: evento,
        fk_cat_empleado: id_empleado,
        fk_detalle_dias_entrada_salida:
          detalleDiasEntradaSalida.id_detalle_entrada_salida,
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

function restarHoras(hora1, hora2) {
  var partsHora1 = hora1.split(":");
  var partsHora2 = hora2.split(":");

  var h1 = parseInt(partsHora1[0]);
  var m1 = parseInt(partsHora1[1]);
  var s1 = parseInt(partsHora1[2]);

  var h2 = parseInt(partsHora2[0]);
  var m2 = parseInt(partsHora2[1]);
  var s2 = parseInt(partsHora2[2]);

  var h = h1 - h2;
  var m = m1 - m2;
  var s = s1 - s2;

  if (s < 0) {
    s += 60;
    m--;
  }
  if (m < 0) {
    m += 60;
    h--;
  }

  return (
    (h < 10 ? "0" + h : h) +
    ":" +
    (m < 10 ? "0" + m : m) +
    ":" +
    (s < 10 ? "0" + s : s)
  );
}

// EXPORTAMOS LAS FUNCIONES PARA SU USO EN OTROS ARCHIVOS.
module.exports = {
  registroChequeoGet,
  registroChequeoPost,
};
