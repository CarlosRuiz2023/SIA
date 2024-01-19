// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

// IMPORTACIÓN DE LOS MODELOS NECESARIOS PARA REALIZAR CONSULTAS EN LA BASE DE DATOS.
const Empleado = require("../../models/modelos/catalogos/empleado");
const Ausencia = require("../../models/modelos/catalogos/ausencias");
const RegistroChequeo = require("../../models/modelos/catalogos/registroChequeo");

/**
 * OBTIENE TODOS LOS EMPLEADOS ACTIVOS DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const ausenciasGet = async (req = request, res = response) => {
  try {
    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO EMPLEADOS Y SUS RELACIONES.
    const ausencias = await Ausencia.findAll({
      include: [{ model: Empleado, as: "empleado" }],
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      ausencias,
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
 * OBTIENE UN EMPLEADO ESPECÍFICO POR SU ID, SI ESTÁ ACTIVO.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const ausenciaIdGet = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL EMPLEADO DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER UN EMPLEADO ESPECÍFICO Y ACTIVO.
    const query = {
      id_cat_ausencia: id,
    };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UN EMPLEADO Y SUS RELACIONES.
    const ausencias = await Ausencia.findOne({
      where: query,
      include: [{ model: Empleado, as: "empleado" }],
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      ausencias,
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
 * OBTIENE UN EMPLEADO ESPECÍFICO POR SU ID, SI ESTÁ ACTIVO.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const ausenciasIdGet = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL EMPLEADO DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER UN EMPLEADO ESPECÍFICO Y ACTIVO.
    const query = {
      fk_cat_empleado: id,
    };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UN EMPLEADO Y SUS RELACIONES.
    const ausencias = await Ausencia.findOne({
      where: query,
      include: [{ model: Empleado, as: "empleado" }],
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      ausencias,
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
 * OBTIENE UN EMPLEADO ESPECÍFICO POR SU ID, SI ESTÁ ACTIVO.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
// REGISTRA UN NUEVO EMPLEADO EN LA BASE DE DATOS.
const ausenciasPost = async (req = request, res = response) => {
  try {
    // EXTRAEMOS LOS DATOS NECESARIOS DEL CUERPO DE LA SOLICITUD.
    const { fecha, descripcion, id_empleado } = req.body;

    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER UN EMPLEADO ESPECÍFICO Y ACTIVO.
    const query = {
      fecha: fecha,
      fk_cat_empleado: id_empleado,
    };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UN EMPLEADO Y SUS RELACIONES.
    const registros = await RegistroChequeo.findOne({
      where: query,
    });

    if (registros) {
      // RETORNA LA RESPUESTA CON LOS DATOS DEL EMPLEADO CREADO.
      return res.status(400).json({
        ok: true,
        msg: "Ausencia no registrada debido a que el empleado ha checado ese dia",
      });
    }

    // CREA UNA NUEVA PERSONA EN LA BASE DE DATOS.
    const ausencia = await Ausencia.create({
      fecha,
      descripcion,
      fk_cat_empleado: id_empleado,
    });

    // RETORNA LA RESPUESTA CON LOS DATOS DEL EMPLEADO CREADO.
    res.status(201).json({
      ok: true,
      msg: "Ausencia registrada correctamente",
      ausencia,
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
 * OBTIENE UN EMPLEADO ESPECÍFICO POR SU ID, SI ESTÁ ACTIVO.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
// ACTUALIZA LA INFORMACIÓN DE UN EMPLEADO EXISTENTE EN LA BASE DE DATOS.
const ausenciasPut = async (req = request, res = response) => {
  try {
    // OBTIENE EL ID DEL EMPLEADO DESDE LOS PARÁMETROS DE RUTA Y LOS DATOS ACTUALIZADOS DESDE EL CUERPO DE LA SOLICITUD.
    const { id } = req.params;
    const { fecha, descripcion, id_empleado } = req.body;

    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER UN EMPLEADO ESPECÍFICO Y ACTIVO.
    const query = {
      fecha: fecha,
      fk_cat_empleado: id_empleado,
    };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UN EMPLEADO Y SUS RELACIONES.
    const registros = await RegistroChequeo.findOne({
      where: query,
    });

    if (registros) {
      // RETORNA LA RESPUESTA CON LOS DATOS DEL EMPLEADO CREADO.
      return res.status(400).json({
        ok: true,
        msg: "Ausencia no registrada debido a que el empleado ha checado ese dia",
      });
    }

    // VERIFICA SI EL EMPLEADO EXISTE EN LA BASE DE DATOS.
    const ausencia = await Ausencia.findByPk(id, {
      include: [{ model: Empleado, as: "empleado" }],
    });

    // ACTUALIZA LOS CAMPOS DIRECTOS DEL MODELO EMPLEADO.
    ausencia.fecha = fecha;
    ausencia.descripcion = descripcion;
    ausencia.fk_cat_empleado = id_empleado;

    // GUARDA LOS CAMBIOS EN LA BASE DE DATOS.
    await ausencia.save();

    // RETORNA LA RESPUESTA CON LOS DATOS DEL EMPLEADO ACTUALIZADO.
    res.status(200).json({
      ok: true,
      msg: "Ausencia actualizado correctamente",
      empleado: ausencia,
    });
  } catch (error) {
    // MANEJO DE ERRORES, IMPRIMIMOS EL ERROR EN LA CONSOLA Y ENVIAMOS UNA RESPUESTA DE ERROR AL CLIENTE.
    console.log(error);
    res.status(500).json({
      msg: "Ha ocurrido un error, hable con el Administrador.",
    });
  }
};

// EXPORTA LOS MÉTODOS PARA SER UTILIZADOS EN OTROS ARCHIVOS.
module.exports = {
  ausenciasGet,
  ausenciasPost,
  ausenciasPut,
  ausenciasIdGet,
  ausenciaIdGet,
};
