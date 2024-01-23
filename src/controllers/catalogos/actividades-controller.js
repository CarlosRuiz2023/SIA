// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require("express");

// IMPORTACIÓN DE LOS MODELOS NECESARIOS PARA REALIZAR CONSULTAS EN LA BASE DE DATOS.
const Actividades = require("../../models/modelos/catalogos/actividades");

/**
 * OBTIENE TODOS LOS CLIENTES ACTIVOS DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const actividadesGet = async (req = request, res = response) => {
  try {
    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER CLIENTES ACTIVOS.
    const query = { estatus: 1 };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO CLIENTES Y SUS RELACIONES.
    const actividades = await Actividades.findAll({
      where: query,
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      actividades,
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
const actividadIdGet = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL CLIENTE DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER UN CLIENTE ESPECÍFICO Y ACTIVO.
    const query = {
      id_cat_actividad: id,
      estatus: 1,
    };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UN CLIENTE Y SUS RELACIONES.
    const actividades = await Actividades.findOne({
      where: query,
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      actividades,
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
const actividadesPost = async (req = request, res = response) => {
  try {
    // EXTRAEMOS LOS DATOS NECESARIOS DEL CUERPO DE LA SOLICITUD.
    const { actividad_nombre, descripcion } = req.body;

    const date = new Date();
    const fecha_solicitada = date.toISOString().slice(0, 10);

    // CREAMOS UNA NUEVA PERSONA EN LA BASE DE DATOS.
    const actividad = await Actividades.create({
      actividad: actividad_nombre,
      descripcion,
      estatus: 1,
    });

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DEL REGISTRO.
    res.status(201).json({
      ok: true,
      msg: "Actividad guardada correctamente",
      actividad,
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
const actividadPut = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL CLIENTE DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // EXTRAEMOS LOS DATOS DEL CUERPO DE LA SOLICITUD.
    const { actividad_nombre, descripcion } = req.body;

    // OBTENEMOS EL CLIENTE EXISTENTE Y SUS RELACIONES.
    const actividad = await Actividades.findByPk(id);

    // ACTUALIZAMOS LA INFORMACIÓN DE CLIENTE, PERSONA Y USUARIO.
    actividad.actividad = actividad_nombre;
    actividad.descripcion = descripcion;

    // GUARDAMOS LOS CAMBIOS EN LA BASE DE DATOS.
    await actividad.save();

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DE LA ACTUALIZACIÓN.
    res.status(200).json({
      ok: true,
      msg: "Actividad actualizada correctamente",
      cliente: actividad,
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
const actividadDelete = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL CLIENTE DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // OBTENEMOS EL CLIENTE EXISTENTE.
    const actividad = await Actividades.findByPk(id);

    // CAMBIAMOS EL ESTATUS DEL CLIENTE A 0 PARA ELIMINARLO LÓGICAMENTE.
    actividad.estatus = 0;
    await actividad.save();

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DE LA ELIMINACIÓN.
    res.status(200).json({
      ok: true,
      msg: "Actividad eliminada correctamente",
      cliente: actividad,
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
  actividadesGet,
  actividadesPost,
  actividadPut,
  actividadDelete,
  actividadIdGet,
};
