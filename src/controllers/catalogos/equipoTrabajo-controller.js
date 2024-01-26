// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require("express");

// IMPORTACIÓN DE LOS MODELOS NECESARIOS PARA REALIZAR CONSULTAS EN LA BASE DE DATOS.
const EquipoTrabajo = require("../../models/modelos/catalogos/equipoTrabajo");
const Empleado = require("../../models/modelos/catalogos/empleado");
const DetalleEmpleadoEquipoTrabajo = require("../../models/modelos/detalles/detalle_empleado_equipo_trabajo");
const Persona = require("../../models/modelos/catalogos/persona");
const DetalleProyectoEquipoTrabajo = require("../../models/modelos/detalles/detalle_proyecto_equipo_trabajo");
const DetalleProyectoEtapa = require("../../models/modelos/detalles/detalle_proyecto_etapa");
const Etapa = require("../../models/modelos/catalogos/etapa");
const DetalleEtapaActividad = require("../../models/modelos/detalles/detalle_etapa_actividad");
const Actividades = require("../../models/modelos/catalogos/actividades");
const Proyectos = require("../../models/modelos/catalogos/proyectos");

/**
 * OBTIENE TODOS LOS CLIENTES ACTIVOS DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const equipoTrabajoGet = async (req = request, res = response) => {
  try {
    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER CLIENTES ACTIVOS.
    const query = { estatus: 1 };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO CLIENTES Y SUS RELACIONES.
    const equipo_trabajo = await EquipoTrabajo.findAll({
      where: query,
      include: [
        {
          model: DetalleEmpleadoEquipoTrabajo,
          as: "detalle_empleados",
          include: [
            {
              model: Empleado,
              as: "cat_empleado",
              include: [
                {
                  model: Persona,
                  as: "persona",
                },
              ],
            },
          ],
        },
        {
          model: DetalleProyectoEquipoTrabajo,
          as: "proyecto_equipos_trabajos",
          include: [
            {
              model: Proyectos,
              as: "cat_proyecto",
            },
          ],
        },
      ],
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      results: equipo_trabajo,
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
 * OBTIENE TODOS LOS CLIENTES ACTIVOS DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const equipoTrabajoActividadesGet = async (req = request, res = response) => {
  try {
    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER CLIENTES ACTIVOS.
    const query = { fk_cat_equipo_trabajo: 1 };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO CLIENTES Y SUS RELACIONES.
    const equipo_trabajo = await DetalleProyectoEquipoTrabajo.findAll({
      where: query,
      include: [
        {
          model: Proyectos,
          include: [
            {
              model: DetalleProyectoEtapa,
              as: "proyecto_etapas",
              include: [
                {
                  model: Etapa,
                  include: [
                    {
                      model: DetalleEtapaActividad,
                      as: "etapa_actividads",
                      include: [{ model: Actividades }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      results: equipo_trabajo,
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
const equipoTrabajoIdGet = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL CLIENTE DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER UN CLIENTE ESPECÍFICO Y ACTIVO.
    const query = {
      id_cat_equipo_trabajo: id,
      estatus: 1,
    };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UN CLIENTE Y SUS RELACIONES.
    const equipo_trabajo = await EquipoTrabajo.findOne({
      where: query,
      include: [
        {
          model: DetalleEmpleadoEquipoTrabajo,
          as: "detalle_empleados",
          include: [
            {
              model: Empleado,
              as: "cat_empleado",
              include: [
                {
                  model: Persona,
                  as: "persona",
                },
              ],
            },
          ],
        },
      ],
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      results: equipo_trabajo,
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
const equipoTrabajoPost = async (req = request, res = response) => {
  try {
    // EXTRAEMOS LOS DATOS NECESARIOS DEL CUERPO DE LA SOLICITUD.
    const { equipo_trabajo, descripcion } = req.body;

    // CREAMOS UNA NUEVA PERSONA EN LA BASE DE DATOS.
    const equipoTrabajo = await EquipoTrabajo.create({
      equipo_trabajo,
      descripcion,
      estatus: 1,
    });

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DEL REGISTRO.
    res.status(201).json({
      ok: true,
      msg: "Equipo de Trabajo guardado correctamente",
      results: equipoTrabajo,
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
const equipoTrabajoPut = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL CLIENTE DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // EXTRAEMOS LOS DATOS DEL CUERPO DE LA SOLICITUD.
    const { equipo_trabajo, descripcion, empleados } = req.body;

    // OBTENEMOS EL CLIENTE EXISTENTE Y SUS RELACIONES.
    const equipoTrabajo = await EquipoTrabajo.findByPk(id);

    // ACTUALIZAMOS LA INFORMACIÓN DE CLIENTE, PERSONA Y USUARIO.
    equipoTrabajo.equipo_trabajo = equipo_trabajo;
    equipoTrabajo.descripcion = descripcion;

    // GUARDAMOS LOS CAMBIOS EN LA BASE DE DATOS.
    await equipoTrabajo.save();

    // ELIMINA PERMISOS NO NECESARIOS.
    await DetalleEmpleadoEquipoTrabajo.destroy({
      where: {
        fk_cat_equipo_trabajo: equipoTrabajo.id_cat_equipo_trabajo,
      },
    });

    // ASOCIA LOS ROLES AL USUARIO MEDIANTE LA TABLA INTERMEDIA.
    await Promise.all(
      empleados.map(async (empleado) => {
        await DetalleEmpleadoEquipoTrabajo.create({
          fk_cat_empleado: empleado,
          fk_cat_equipo_trabajo: equipoTrabajo.id_cat_equipo_trabajo,
        });
      })
    );

    const equipoTrabajoFinal = await EquipoTrabajo.findAll({
      include: [
        {
          model: DetalleEmpleadoEquipoTrabajo,
          as: "detalle_empleados",
          include: [
            {
              model: Empleado,
              as: "cat_empleado",
              include: [
                {
                  model: Persona,
                  as: "persona",
                },
              ],
            },
          ],
        },
      ],
    });

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DE LA ACTUALIZACIÓN.
    res.status(200).json({
      ok: true,
      msg: "Equipo Trabajo actualizado correctamente",
      results: equipoTrabajoFinal,
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
const equipoTrabajoDelete = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL CLIENTE DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // OBTENEMOS EL CLIENTE EXISTENTE.
    const equipo_trabajo = await EquipoTrabajo.findByPk(id);

    // CAMBIAMOS EL ESTATUS DEL CLIENTE A 0 PARA ELIMINARLO LÓGICAMENTE.
    equipo_trabajo.estatus = 0;
    await equipo_trabajo.save();

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DE LA ELIMINACIÓN.
    res.status(200).json({
      ok: true,
      msg: "Equipo de Trabajo eliminado correctamente",
      results: equipo_trabajo,
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
 * ACTIVA UN CLIENTE INACTIVO CAMBIANDO SU ESTATUS A 1.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const equipoTrabajoActivarPut = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL CLIENTE DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // OBTENEMOS EL CLIENTE EXISTENTE.
    const equipo_trabajo = await EquipoTrabajo.findByPk(id);

    // CAMBIAMOS EL ESTATUS DEL CLIENTE A 1 PARA ACTIVARLO.
    equipo_trabajo.estatus = 1;
    await equipo_trabajo.save();

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DE LA ACTIVACIÓN.
    res.status(200).json({
      ok: true,
      msg: "Equipo de Trabajo activado correctamente",
      results: equipo_trabajo,
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
  equipoTrabajoGet,
  equipoTrabajoPost,
  equipoTrabajoPut,
  equipoTrabajoDelete,
  equipoTrabajoIdGet,
  equipoTrabajoActivarPut,
  equipoTrabajoActividadesGet,
};
