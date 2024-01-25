// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require("express");

// IMPORTACIÓN DE LOS MODELOS NECESARIOS PARA REALIZAR CONSULTAS EN LA BASE DE DATOS.
const Tarea = require("../../models/modelos/detalles/detalle_actividad_tarea");

/**
 * OBTIENE UN CLIENTE ESPECÍFICO POR SU ID, SI ESTÁ ACTIVO.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const tareasIdGet = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL CLIENTE DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER UN CLIENTE ESPECÍFICO Y ACTIVO.
    const query = {
      fk_cat_actividad: id,
    };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UN CLIENTE Y SUS RELACIONES.
    const tareas = await Tarea.findOne({
      where: query,
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      tareas,
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
 * OBTIENE UN CLIENTE ESPECÍFICO POR SU ID, SI ESTÁ ACTIVO.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const tareasFaltantesIdGet = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL CLIENTE DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER UN CLIENTE ESPECÍFICO Y ACTIVO.
    const query = {
      fk_cat_actividad: id,
      estatus: 0,
    };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UN CLIENTE Y SUS RELACIONES.
    const tareas = await Tarea.findOne({
      where: query,
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      tareas,
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
const tareasPost = async (req = request, res = response) => {
  try {
    // EXTRAEMOS LOS DATOS NECESARIOS DEL CUERPO DE LA SOLICITUD.
    const { id_actividad, tarea, duracion } = req.body;

    // CREAMOS UNA NUEVA PERSONA EN LA BASE DE DATOS.
    const detalle_actividad_tarea = await Tarea.create({
      fk_cat_actividad: id_actividad,
      fk_cat_empleado: null,
      tarea,
      estatus: 0,
      duracion,
    });

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DEL REGISTRO.
    res.status(201).json({
      ok: true,
      msg: "Tarea guardada correctamente",
      actividad: tarea,
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
 * ACTUALIZA LA INFORMACIÓN DE UN CLIENTE EXISTENTE EN LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta y cuerpo.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const tareaPut = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL CLIENTE DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // EXTRAEMOS LOS DATOS DEL CUERPO DE LA SOLICITUD.
    const { id_actividad, id_empleado, tarea, duracion, estatus } = req.body;

    // OBTENEMOS EL CLIENTE EXISTENTE Y SUS RELACIONES.
    const detalle_actividad_tarea = await Tarea.findByPk(id);

    // ACTUALIZAMOS LA INFORMACIÓN DE CLIENTE, PERSONA Y USUARIO.
    detalle_actividad_tarea.fk_cat_actividad = id_actividad;
    detalle_actividad_tarea.fk_cat_empleado = id_empleado;
    detalle_actividad_tarea.tarea = tarea;
    detalle_actividad_tarea.estatus = estatus;
    detalle_actividad_tarea.duracion = duracion;

    // GUARDAMOS LOS CAMBIOS EN LA BASE DE DATOS.
    await detalle_actividad_tarea.save();

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DE LA ACTUALIZACIÓN.
    res.status(200).json({
      ok: true,
      msg: "Tarea actualizada correctamente",
      detalle_actividad_tarea,
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
 * ELIMINA LÓGICAMENTE UN CLIENTE DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const tareaDelete = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL CLIENTE DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // OBTENEMOS EL CLIENTE EXISTENTE.
    const tarea = await Tarea.findByPk(id);

    // CAMBIAMOS EL ESTATUS DEL CLIENTE A 0 PARA ELIMINARLO LÓGICAMENTE.
    tarea.estatus = 0;
    await tarea.save();

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DE LA ELIMINACIÓN.
    res.status(200).json({
      ok: true,
      msg: "Tarea eliminada correctamente",
      tarea,
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
  tareasPost,
  tareaPut,
  tareaDelete,
  tareasIdGet,
  tareasFaltantesIdGet,
};
