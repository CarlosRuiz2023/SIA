// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require("express");

// IMPORTACIÓN DE LOS MODELOS NECESARIOS PARA REALIZAR CONSULTAS EN LA BASE DE DATOS.
const Etapa = require("../../models/modelos/catalogos/etapa");
const DetalleEtapaActividad = require("../../models/modelos/detalles/detalle_etapa_actividad");
const Actividades = require("../../models/modelos/catalogos/actividades");

/**
 * OBTIENE TODOS LOS CLIENTES ACTIVOS DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const etapasGet = async (req = request, res = response) => {
  try {
    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER CLIENTES ACTIVOS.
    const query = { estatus: 1 };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO CLIENTES Y SUS RELACIONES.
    const etapas = await Etapa.findAll({
      where: query,
      include: [
        {
          model: DetalleEtapaActividad,
          as: "etapa_actividads",
          include: [{ model: Actividades, as: "cat_actividade" }],
        },
      ],
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      results: etapas,
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
 * OBTIENE UN CLIENTE ESPECÍFICO POR SU ID, SI ESTÁ ACTIVO.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const etapaIdGet = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL CLIENTE DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER UN CLIENTE ESPECÍFICO Y ACTIVO.
    const query = {
      id_cat_etapa: id,
      estatus: 1,
    };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UN CLIENTE Y SUS RELACIONES.
    const etapas = await Etapa.findOne({
      where: query,
      include: [
        {
          model: DetalleEtapaActividad,
          as: "etapa_actividads",
          include: [{ model: Actividades, as: "cat_actividade" }],
        },
      ],
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      results: etapas,
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
 * REGISTRA UN NUEVO CLIENTE EN LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const etapasPost = async (req = request, res = response) => {
  try {
    // EXTRAEMOS LOS DATOS NECESARIOS DEL CUERPO DE LA SOLICITUD.
    const { etapa_nombre, descripcion } = req.body;

    // CREAMOS UNA NUEVA PERSONA EN LA BASE DE DATOS.
    const etapa = await Etapa.create({
      etapa: etapa_nombre,
      descripcion,
      estatus: 1,
    });

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DEL REGISTRO.
    res.status(201).json({
      ok: true,
      msg: "Etapa guardada correctamente",
      results: etapa,
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
 * ACTUALIZA LA INFORMACIÓN DE UN CLIENTE EXISTENTE EN LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta y cuerpo.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const etapaPut = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL CLIENTE DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // EXTRAEMOS LOS DATOS DEL CUERPO DE LA SOLICITUD.
    const { etapa_nombre, descripcion } = req.body;

    // OBTENEMOS EL CLIENTE EXISTENTE Y SUS RELACIONES.
    const etapa = await Etapa.findByPk(id);

    // ACTUALIZAMOS LA INFORMACIÓN DE CLIENTE, PERSONA Y USUARIO.
    etapa.etapa = etapa_nombre;
    etapa.descripcion = descripcion;

    // GUARDAMOS LOS CAMBIOS EN LA BASE DE DATOS.
    await etapa.save();

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DE LA ACTUALIZACIÓN.
    res.status(200).json({
      ok: true,
      msg: "Etapa actualizada correctamente",
      results: etapa,
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
 * ELIMINA LÓGICAMENTE UN CLIENTE DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const etapaDelete = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL CLIENTE DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // OBTENEMOS EL CLIENTE EXISTENTE.
    const etapa = await Etapa.findByPk(id);

    // CAMBIAMOS EL ESTATUS DEL CLIENTE A 0 PARA ELIMINARLO LÓGICAMENTE.
    etapa.estatus = 0;
    await etapa.save();

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DE LA ELIMINACIÓN.
    res.status(200).json({
      ok: true,
      msg: "Etapa eliminada correctamente",
      results: etapa,
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
 * REGISTRA UN NUEVO CLIENTE EN LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const etapaActividadesPost = async (req = request, res = response) => {
  try {
    // EXTRAEMOS LOS DATOS NECESARIOS DEL CUERPO DE LA SOLICITUD.
    const { id_etapa, actividades } = req.body;

    const fechaActual = new Date().toISOString().slice(0, 10);
    // OBTIENE LOS REGISTROS ACTUALES ASOCIADOS AL ROL.
    const informacionEtapa = await DetalleEtapaActividad.findAll({
      where: {
        fk_cat_etapa: id_etapa,
      },
    });

    // MAPEA LOS REGISTROS ACTUALES A SUS RESPECTIVOS IDS DE PERMISOS.
    const actividadesActuales = informacionEtapa.map(
      (etapa) => etapa.fk_cat_actividad
    );

    // ENCUENTRA LOS PERMISOS A AGREGAR Y ELIMINAR.
    const actividadesAgregar = actividades.filter(
      (actividad) => !actividadesActuales.includes(actividad)
    );
    const actividadesEliminar = actividadesActuales.filter(
      (actividad) => !actividades.includes(actividad)
    );
    console.log(actividadesEliminar);

    // ELIMINA PERMISOS NO NECESARIOS.
    await DetalleEtapaActividad.destroy({
      where: {
        fk_cat_etapa: id_etapa,
        fk_cat_actividad: actividadesEliminar,
      },
    });

    // CREA NUEVOS REGISTROS PARA LOS PERMISOS A AGREGAR.
    await DetalleEtapaActividad.bulkCreate(
      actividadesAgregar.map((actividad) => ({
        fk_cat_etapa: id_etapa,
        fk_cat_actividad: actividad,
        fecha: fechaActual,
        estatus: 1,
      }))
    );

    // OBTIENE ROLES ACTUALIZADOS.
    const detalle_etapa_actividad = await DetalleEtapaActividad.findAll({
      include: [
        {
          model: Etapa,
        },
        {
          model: Actividades,
        },
      ],
    });

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DEL REGISTRO.
    res.status(201).json({
      ok: true,
      msg: "Etapa-Actividades actualizada correctamente",
      results: detalle_etapa_actividad,
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
  etapasGet,
  etapasPost,
  etapaPut,
  etapaDelete,
  etapaIdGet,
  etapaActividadesPost,
};
