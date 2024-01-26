// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require("express");

// IMPORTACIÓN DE LOS MODELOS NECESARIOS PARA REALIZAR CONSULTAS EN LA BASE DE DATOS.
const Proyectos = require("../../models/modelos/catalogos/proyectos");
const DetalleProyectoEquipoTrabajo = require("../../models/modelos/detalles/detalle_proyecto_equipo_trabajo");
const EquipoTrabajo = require("../../models/modelos/catalogos/equipoTrabajo");
const DetalleProyectoEtapa = require("../../models/modelos/detalles/detalle_proyecto_etapa");
const Etapa = require("../../models/modelos/catalogos/etapa");

/**
 * OBTIENE TODOS LOS CLIENTES ACTIVOS DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const proyectosGet = async (req = request, res = response) => {
  try {
    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER CLIENTES ACTIVOS.
    const query = { estatus: 1 };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO CLIENTES Y SUS RELACIONES.
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
 * OBTIENE UN CLIENTE ESPECÍFICO POR SU ID, SI ESTÁ ACTIVO.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const proyectoIdGet = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL CLIENTE DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER UN CLIENTE ESPECÍFICO Y ACTIVO.
    const query = {
      id_cat_proyecto: id,
      estatus: 1,
    };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UN CLIENTE Y SUS RELACIONES.
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
 * REGISTRA UN NUEVO CLIENTE EN LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
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
    } = req.body;

    // CREAMOS UNA NUEVA PERSONA EN LA BASE DE DATOS.
    const proyecto = await Proyectos.create({
      proyecto: proyecto_nombre,
      descripcion,
      estatus: 1,
      fecha_inicio,
      fecha_fin,
      horas_maximas,
    });

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DEL REGISTRO.
    res.status(201).json({
      ok: true,
      msg: "Proyecto guardado correctamente",
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
 * ACTUALIZA LA INFORMACIÓN DE UN CLIENTE EXISTENTE EN LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta y cuerpo.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const proyectoPut = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL CLIENTE DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // EXTRAEMOS LOS DATOS DEL CUERPO DE LA SOLICITUD.
    const {
      proyecto_nombre,
      descripcion,
      fecha_inicio,
      fecha_fin,
      horas_maximas,
    } = req.body;

    // OBTENEMOS EL CLIENTE EXISTENTE Y SUS RELACIONES.
    const proyecto = await Proyectos.findByPk(id);

    // ACTUALIZAMOS LA INFORMACIÓN DE CLIENTE, PERSONA Y USUARIO.
    proyecto.proyecto = proyecto_nombre;
    proyecto.descripcion = descripcion;
    proyecto.fecha_inicio = fecha_inicio;
    proyecto.fecha_fin = fecha_fin;
    proyecto.horas_maximas = horas_maximas;

    // GUARDAMOS LOS CAMBIOS EN LA BASE DE DATOS.
    await proyecto.save();

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DE LA ACTUALIZACIÓN.
    res.status(200).json({
      ok: true,
      msg: "Proyecto actualizado correctamente",
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
 * ELIMINA LÓGICAMENTE UN CLIENTE DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const proyectoDelete = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL CLIENTE DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // OBTENEMOS EL CLIENTE EXISTENTE.
    const proyecto = await Proyectos.findByPk(id);

    // CAMBIAMOS EL ESTATUS DEL CLIENTE A 0 PARA ELIMINARLO LÓGICAMENTE.
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
 * REGISTRA UN NUEVO CLIENTE EN LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const proyectoEquipoTrabajoPost = async (req = request, res = response) => {
  try {
    // EXTRAEMOS LOS DATOS NECESARIOS DEL CUERPO DE LA SOLICITUD.
    const { id_proyecto, equipos_trabajo } = req.body;

    // ELIMINA PERMISOS NO NECESARIOS.
    await DetalleProyectoEquipoTrabajo.destroy({
      where: {
        fk_cat_proyecto: id_proyecto,
      },
    });

    // ASOCIA LOS ROLES AL USUARIO MEDIANTE LA TABLA INTERMEDIA.
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
 * REGISTRA UN NUEVO CLIENTE EN LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const proyectoEtapaPost = async (req = request, res = response) => {
  try {
    // EXTRAEMOS LOS DATOS NECESARIOS DEL CUERPO DE LA SOLICITUD.
    const { id_proyecto, etapas } = req.body;

    // ELIMINA PERMISOS NO NECESARIOS.
    await DetalleProyectoEtapa.destroy({
      where: {
        fk_cat_proyecto: id_proyecto,
      },
    });

    // ASOCIA LOS ROLES AL USUARIO MEDIANTE LA TABLA INTERMEDIA.
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
