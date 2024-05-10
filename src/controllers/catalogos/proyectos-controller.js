// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require("express");

// IMPORTACIÓN DE LOS MODELOS NECESARIOS PARA REALIZAR CONSULTAS EN LA BASE DE DATOS.
const Proyectos = require("../../models/modelos/catalogos/proyectos");
const DetalleProyectoEquipoTrabajo = require("../../models/modelos/detalles/detalle_proyecto_equipo_trabajo");
const EquipoTrabajo = require("../../models/modelos/catalogos/equipoTrabajo");
const DetalleProyectoEtapa = require("../../models/modelos/detalles/detalle_proyecto_etapa");
const Etapa = require("../../models/modelos/catalogos/etapa");
const DetalleClienteProyectos = require("../../models/modelos/detalles/detalle_cliente_proyectos");

/**
 * OBTIENE TODOS LOS PROYECTOS ACTIVOS DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const proyectosGet = async (req = request, res = response) => {
  try {
    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER PROYECTOS ACTIVOS.
    const query = { estatus: 1 };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO PROYECTOS Y SUS RELACIONES.
    const proyectos = await Proyectos.findAll({
      where: query,
      include: [
        {
          model: DetalleProyectoEquipoTrabajo,
          as: "proyecto_equipos_trabajos",
          include: [{ model: EquipoTrabajo, as: "cat_equipo_trabajo" }],
        },
        {
          model: DetalleProyectoEtapa,
          as: "proyecto_etapas",
          include: [
            {
              model: Etapa,
              as: "cat_etapa",
            },
          ],
        },
      ],
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      results: proyectos,
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
 * OBTIENE UN PROYECTO ESPECÍFICO POR SU ID, SI ESTÁ ACTIVO.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con proyecto tipo JSON.
 */
const proyectoIdGet = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL PROYECTO DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER UN PROYECTO ESPECÍFICO Y ACTIVO.
    const query = {
      id_cat_proyecto: id,
      estatus: 1,
    };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UN PROYECTO Y SUS RELACIONES.
    const proyectos = await Proyectos.findOne({
      where: query,
      include: [
        {
          model: DetalleProyectoEquipoTrabajo,
          as: "proyecto_equipos_trabajos",
          include: [{ model: EquipoTrabajo, as: "cat_equipo_trabajo" }],
        },
        {
          model: DetalleProyectoEtapa,
          as: "proyecto_etapas",
          include: [
            {
              model: Etapa,
              as: "cat_etapa",
            },
          ],
        },
      ],
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      results: proyectos,
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
 * REGISTRA UN NUEVO PROYECTO EN LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con proyecto tipo JSON.
 */
const proyectosPost = async (req = request, res = response) => {
  try {
    // EXTRAEMOS LOS DATOS NECESARIOS DEL CUERPO DE LA SOLICITUD.
    const {
      proyecto_nombre,
      descripcion,
      fecha_inicio,
      fecha_fin,
      horas_maximas,
      id_cliente,
    } = req.body;

    // CREAMOS UN NUEVO PROYECTO EN LA BASE DE DATOS.
    const proyecto = await Proyectos.create({
      proyecto: proyecto_nombre,
      descripcion,
      estatus: 1,
      fecha_inicio,
      fecha_fin,
      horas_maximas,
    });

    const detalleClienteProyectos = await DetalleClienteProyectos.create({
      fk_cat_cliente: id_cliente,
      fk_cat_proyecto: proyecto.id_cat_proyecto,
    });

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DEL REGISTRO.
    res.status(201).json({
      ok: true,
      results: {
        msg: "Proyecto guardado correctamente",
        proyecto,
        detalleClienteProyectos,
      },
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
 * ACTUALIZA LA INFORMACIÓN DE UN PROYECTO EXISTENTE EN LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta y cuerpo.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con proyecto actualizado tipo JSON.
 */
const proyectoPut = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL PROYECTO DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // EXTRAEMOS LOS DATOS DEL CUERPO DE LA SOLICITUD.
    const {
      proyecto_nombre,
      descripcion,
      fecha_inicio,
      fecha_fin,
      horas_maximas,
      id_cliente,
    } = req.body;

    // OBTENEMOS EL PROYECTO EXISTENTE Y SUS RELACIONES.
    const proyecto = await Proyectos.findByPk(id);

    // ACTUALIZAMOS LA INFORMACIÓN DEL PROYECTO.
    proyecto.proyecto = proyecto_nombre;
    proyecto.descripcion = descripcion;
    proyecto.fecha_inicio = fecha_inicio;
    proyecto.fecha_fin = fecha_fin;
    proyecto.horas_maximas = horas_maximas;

    // GUARDAMOS LOS CAMBIOS EN LA BASE DE DATOS.
    await proyecto.save();

    // OBTENEMOS EL DETALLE_CLIENTE_PROYECTOS EXISTENTE Y SUS RELACIONES.
    const detalleClienteProyectos = await DetalleClienteProyectos.findOne({
      fk_cat_proyecto: id,
    });

    // ACTUALIZAMOS LA INFORMACIÓN DEL DETALLE_CLIENTE_PROYECTOS.
    detalleClienteProyectos.fk_cat_cliente = id_cliente;

    // GUARDAMOS LOS CAMBIOS EN LA BASE DE DATOS.
    await detalleClienteProyectos.save();

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DE LA ACTUALIZACIÓN.
    res.status(200).json({
      ok: true,
      results: {
        msg: "Proyecto actualizado correctamente",
        proyecto,
        detalleClienteProyectos,
      },
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
 * ELIMINA LÓGICAMENTE UN PROYECTO DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con proyecto tipo JSON.
 */
const proyectoDelete = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL PROYECTO DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // OBTENEMOS EL PROYECTO EXISTENTE.
    const proyecto = await Proyectos.findByPk(id);

    // CAMBIAMOS EL ESTATUS DEL PROYECTO A 0 PARA ELIMINARLO LÓGICAMENTE.
    proyecto.estatus = 0;
    await proyecto.save();

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DE LA ELIMINACIÓN.
    res.status(200).json({
      ok: true,
      msg: "Proyecto eliminado correctamente",
      results: proyecto,
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
 * ASIGNAR UN PROYECTO A UN EQUIPO DE TRABAJO.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con detalle_proyecto_equipo_trabajo tipo JSON.
 */
const proyectoEquipoTrabajoPost = async (req = request, res = response) => {
  try {
    // EXTRAEMOS LOS DATOS NECESARIOS DEL CUERPO DE LA SOLICITUD.
    const { id_proyecto, equipos_trabajo } = req.body;

    // ELIMINA PROYECTOS NO NECESARIOS.
    await DetalleProyectoEquipoTrabajo.destroy({
      where: {
        fk_cat_proyecto: id_proyecto,
      },
    });

    // ASOCIA LOS PROYECTOS AL EQUIPO DE TRABAJO MEDIANTE LA TABLA INTERMEDIA.
    await Promise.all(
      equipos_trabajo.map(async (equipo_trabajo) => {
        await DetalleProyectoEquipoTrabajo.create({
          fk_cat_proyecto: id_proyecto,
          fk_cat_equipo_trabajo: equipo_trabajo,
        });
      })
    );

    const detalle_proyecto_equipo_trabajo =
      await DetalleProyectoEquipoTrabajo.findAll({
        include: [
          {
            model: Proyectos,
          },
          {
            model: EquipoTrabajo,
          },
        ],
      });

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DEL REGISTRO.
    res.status(201).json({
      ok: true,
      msg: "Proyecto-Equipos de Trabajo actualizado correctamente",
      results: detalle_proyecto_equipo_trabajo,
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
 * ASIGNA UNA ETAPA A UN PROYECTO EN ESPECIFICO.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con detalle_proyecto_etapa tipo JSON.
 */
const proyectoEtapaPost = async (req = request, res = response) => {
  try {
    // EXTRAEMOS LOS DATOS NECESARIOS DEL CUERPO DE LA SOLICITUD.
    const { id_proyecto, etapas } = req.body;

    // ELIMINA ETAPAS NO NECESARIOS.
    await DetalleProyectoEtapa.destroy({
      where: {
        fk_cat_proyecto: id_proyecto,
      },
    });

    // ASOCIA LAS ETAPAS AL PROYECTO MEDIANTE LA TABLA INTERMEDIA.
    await Promise.all(
      etapas.map(async (etapa) => {
        await DetalleProyectoEtapa.create({
          fk_cat_proyecto: id_proyecto,
          fk_cat_etapa: etapa,
        });
      })
    );

    const detalle_proyecto_etapa = await DetalleProyectoEtapa.findAll({
      include: [
        {
          model: Proyectos,
        },
        {
          model: Etapa,
        },
      ],
    });

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DEL REGISTRO.
    res.status(201).json({
      ok: true,
      msg: "Proyecto-Etapas actualizado correctamente",
      results: detalle_proyecto_etapa,
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
  proyectosGet,
  proyectosPost,
  proyectoPut,
  proyectoDelete,
  proyectoIdGet,
  proyectoEquipoTrabajoPost,
  proyectoEtapaPost,
};
