// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require("express");

// IMPORTACIÓN DE LOS MODELOS NECESARIOS PARA REALIZAR CONSULTAS EN LA BASE DE DATOS.
const Etapa = require("../../models/modelos/catalogos/etapa");
const DetalleEtapaActividad = require("../../models/modelos/detalles/detalle_etapa_actividad");
const Actividades = require("../../models/modelos/catalogos/actividades");

/**
 * OBTIENE TODAS LAS ETAPAS ACTIVAS DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con etapas tipo JSON.
 */
const etapasGet = async (req = request, res = response) => {
  try {
    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER ETAPAS ACTIVAS.
    const query = { estatus: 1 };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO ETAPAS Y SUS RELACIONES.
    const etapas = await Etapa.findAll({
      where: query,
      include: [
        {
          model: DetalleEtapaActividad,
          as: "etapa_actividades",
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
 * OBTIENE UNA ETAPA ESPECÍFICA POR SU ID, SI ESTÁ ACTIVA.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con etapa tipo JSON.
 */
const etapaIdGet = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DE LA ETAPA DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER UNA ETAPA EN ESPECÍFICO Y ACTIVA.
    const query = {
      id_cat_etapa: id,
      estatus: 1,
    };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UNA ETAPA Y SUS RELACIONES.
    const etapas = await Etapa.findOne({
      where: query,
      include: [
        {
          model: DetalleEtapaActividad,
          as: "etapa_actividades",
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
 * REGISTRA UNA NUEVA ETAPA EN LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con etapa tipo JSON.
 */
const etapasPost = async (req = request, res = response) => {
  try {
    // EXTRAEMOS LOS DATOS NECESARIOS DEL CUERPO DE LA SOLICITUD.
    const { etapa_nombre, descripcion } = req.body;

    // CREAMOS UNA NUEVA ETAPA EN LA BASE DE DATOS.
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
 * ACTUALIZA LA INFORMACIÓN DE UNA ETAPA EXISTENTE EN LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta y cuerpo.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con etapa tipo JSON.
 */
const etapaPut = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DE LA ETAPA DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // EXTRAEMOS LOS DATOS DEL CUERPO DE LA SOLICITUD.
    const { etapa_nombre, descripcion } = req.body;

    // OBTENEMOS LA ETAPA EXISTENTE Y SUS RELACIONES.
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
 * ELIMINA LÓGICAMENTE UNA ETAPA DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con etapa tipo JSON.
 */
const etapaDelete = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DE LA ETAPA DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // OBTENEMOS LA ETAPA EXISTENTE.
    const etapa = await Etapa.findByPk(id);

    // CAMBIAMOS EL ESTATUS DE LA ETAPA A 0 PARA ELIMINARLO LÓGICAMENTE.
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
 * ASIGNAMOS ACTIVIDADES A UNA ETAPA EN ESPECIFICO.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con detalles de la etapa actualizada tipo JSON.
 */
const etapaActividadesPost = async (req = request, res = response) => {
  try {
    // EXTRAEMOS LOS DATOS NECESARIOS DEL CUERPO DE LA SOLICITUD.
    const { id_etapa, actividades } = req.body;

    const fechaActual = new Date().toISOString().slice(0, 10);
    // OBTIENE LOS REGISTROS ACTUALES ASOCIADOS A LA ETAPA.
    const informacionEtapa = await DetalleEtapaActividad.findAll({
      where: {
        fk_cat_etapa: id_etapa,
      },
    });

    // MAPEA LOS REGISTROS ACTUALES A SUS RESPECTIVOS IDS DE ACTIVIDADES.
    const actividadesActuales = informacionEtapa.map(
      (etapa) => etapa.fk_cat_actividad
    );

    // ENCUENTRA LAS ACTIVIDADES A AGREGAR Y ELIMINAR.
    const actividadesAgregar = actividades.filter(
      (actividad) => !actividadesActuales.includes(actividad)
    );
    const actividadesEliminar = actividadesActuales.filter(
      (actividad) => !actividades.includes(actividad)
    );
    console.log(actividadesEliminar);

    // ELIMINA ACTIVIADES EXCLUIDAS.
    await DetalleEtapaActividad.destroy({
      where: {
        fk_cat_etapa: id_etapa,
        fk_cat_actividad: actividadesEliminar,
      },
    });

    // CREA NUEVOS REGISTROS PARA LAS ACTIVIDADES ASIGNADAS A DICHA ETAPA.
    await DetalleEtapaActividad.bulkCreate(
      actividadesAgregar.map((actividad) => ({
        fk_cat_etapa: id_etapa,
        fk_cat_actividad: actividad,
        fecha: fechaActual,
        estatus: 1,
      }))
    );

    // OBTIENE ACTIVIDADES ACTUALIZADAS.
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
