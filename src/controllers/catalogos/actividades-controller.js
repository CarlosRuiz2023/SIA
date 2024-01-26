// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require("express");
// IMPORTACIÓN DEL OPERADOR 'Op' DE SEQUELIZE PARA REALIZAR OPERACIONES COMPLEJAS.
const { Op } = require("sequelize");

// IMPORTACIÓN DE LOS MODELOS NECESARIOS PARA REALIZAR CONSULTAS EN LA BASE DE DATOS.
const Actividades = require("../../models/modelos/catalogos/actividades");
const DetalleEtapaActividad = require("../../models/modelos/detalles/detalle_etapa_actividad");
const DetalleActividadTarea = require("../../models/modelos/detalles/detalle_actividad_tarea");
const DetalleProyectoEquipoTrabajo = require("../../models/modelos/detalles/detalle_proyecto_equipo_trabajo");
const DetalleProyectoEtapa = require("../../models/modelos/detalles/detalle_proyecto_etapa");
const DetalleEmpleadoEquipoTrabajo = require("../../models/modelos/detalles/detalle_empleado_equipo_trabajo");
const pool = require("../../database/config");
const EquipoTrabajo = require("../../models/modelos/catalogos/equipoTrabajo");
const Proyectos = require("../../models/modelos/catalogos/proyectos");
const Empleado = require("../../models/modelos/catalogos/empleado");
const Etapa = require("../../models/modelos/catalogos/etapa");

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
      results: actividades,
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
      results: actividades,
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
      results: actividad,
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
      results: actividad,
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
      results: actividad,
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
 * OBTIENE LOS REGISTROS DE LA BITÁCORA DE ACCESOS SEGÚN LOS PARÁMETROS ESPECIFICADOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const reporteActividadesPost = async (req, res) => {
  try {
    // EXTRAEMOS LOS PARÁMETROS DE LA SOLICITUD.
    const { fecha_inicio, fecha_fin, tipo = 1, id } = req.body;
    const query = {};

    // AGREGAMOS CONDICIONES A LA CONSULTA DE ACUERDO A LOS PARÁMETROS RECIBIDOS.
    if (fecha_inicio && fecha_fin) {
      query.fecha = {
        [Op.gte]: fecha_inicio,
        [Op.lte]: fecha_fin,
      };
    }

    let resultado = {};
    let equipos = [];
    let empleados = [];
    let proyectos = [];
    let actividades = [];
    let etapas = [];
    let actividadesIds = [];
    let proyectosIds = [];
    let etapasIds = [];

    switch (tipo) {
      case 1:
        resultado = await Empleado.findAll({
          where: {
            id_cat_empleado: {
              [Op.eq]: id,
            },
          },
          include: [
            {
              model: DetalleEmpleadoEquipoTrabajo,
              as: "detalle_empleados",
              include: [
                {
                  model: EquipoTrabajo,
                  as: "cat_equipo_trabajo",
                },
              ],
            },
          ],
        });

        for (let empleado of resultado) {
          for (let detalles of empleado.detalle_empleados) {
            equipos.push(detalles.cat_equipo_trabajo.id_cat_equipo_trabajo);
          }
        }
        resultado = await DetalleProyectoEquipoTrabajo.findAll({
          where: { fk_cat_equipo_trabajo: { [Op.in]: equipos } },
          include: [
            {
              model: Proyectos,
              as: "cat_proyecto",
            },
          ],
        });
        for (let equipo_trabajo of resultado) {
          const proyecto = equipo_trabajo.cat_proyecto;
          proyectos.push({
            id_proyecto: proyecto.id_cat_proyecto,
            nombre: proyecto.proyecto,
            equipo_trabajo: equipo_trabajo.fk_cat_equipo_trabajo,
          });
        }
        proyectosIds = proyectos.map((proyecto) => proyecto.id_proyecto);

        resultado = await DetalleProyectoEtapa.findAll({
          where: { fk_cat_proyecto: { [Op.in]: proyectosIds } },
          include: [
            {
              model: Etapa,
              as: "cat_etapa",
            },
          ],
        });
        for (let etapa of resultado) {
          const etapa1 = etapa.cat_etapa;
          etapas.push({
            id_etapa: etapa1.id_cat_etapa,
            proyecto: etapa.fk_cat_proyecto,
          });
        }
        etapasIds = etapas.map((etapa) => etapa.id_etapa);
        resultado = await DetalleEtapaActividad.findAll({
          where: { fk_cat_etapa: { [Op.in]: etapasIds } },
          include: [
            {
              model: Actividades,
              as: "cat_actividade",
            },
          ],
        });
        for (let actividad of resultado) {
          actividades.push({
            id_actividad: actividad.fk_cat_actividad,
            etapa: actividad.fk_cat_etapa,
          });
        }
        actividadesIds = actividades.map((actividad) => actividad.id_actividad);

        resultado = await DetalleActividadTarea.findAll({
          attributes: [
            "fk_cat_actividad",
            "fk_cat_empleado",
            [
              pool.fn("COUNT", pool.col("id_detalle_actividad_tarea")),
              "cantidad_tareas",
            ],
            [
              pool.fn(
                "COUNT",
                pool.literal(`
                CASE WHEN estatus = 1 THEN 1 ELSE NULL END
              `)
              ),
              "tareas_completadas",
            ],
            [
              pool.fn(
                "COUNT",
                pool.literal(`
                CASE WHEN fk_cat_empleado = ${id} THEN 1 ELSE NULL END
              `)
              ),
              "tareas_empleado",
            ],
            [
              pool.fn(
                "TO_CHAR",
                pool.cast(
                  pool.fn(
                    "SUM",
                    pool.literal(`
                    CASE WHEN fk_cat_empleado = ${id} THEN "duracion" ELSE '00:00:00' END `)
                  ),
                  "interval"
                ),
                "'HH24:MI:SS'"
              ),
              "tiempo_invertido",
            ],
          ],
          group: ["fk_cat_actividad", "fk_cat_empleado"],
          where: {
            fk_cat_actividad: {
              [Op.in]: actividadesIds,
            },
          },
        });
        // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
        res.status(200).json({
          ok: true,
          results: {
            equipos, // Array de equipos obtenidos
            proyectos, // Array de proyectos obtenidos
            etapas, // Array de etapas obtenidas
            actividades, // Array de actividades obtenidas
            actividadesInformes: resultado, // Resultado final obtenido
          },
        });
        break;
      case 2:
        resultado = await EquipoTrabajo.findAll({
          where: { id_cat_equipo_trabajo: id },
          include: [
            {
              model: DetalleEmpleadoEquipoTrabajo,
              as: "detalle_empleados",
              include: [
                {
                  model: Empleado,
                  as: "cat_empleado",
                },
              ],
            },
          ],
        });
        console.log(resultado);
        for (let equipo_trabajo of resultado) {
          for (let detalles of equipo_trabajo.detalle_empleados) {
            empleados.push(detalles.fk_cat_empleado);
          }
        } /**Asta aqui llegue */
        resultado = await DetalleProyectoEquipoTrabajo.findAll({
          where: { fk_cat_equipo_trabajo: { [Op.in]: equipos } },
          include: [
            {
              model: Proyectos,
              as: "cat_proyecto",
            },
          ],
        });
        for (let equipo_trabajo of resultado) {
          const proyecto = equipo_trabajo.cat_proyecto;
          proyectos.push({
            id_proyecto: proyecto.id_cat_proyecto,
            nombre: proyecto.proyecto,
            equipo_trabajo: equipo_trabajo.fk_cat_equipo_trabajo,
          });
        }
        proyectosIds = proyectos.map((proyecto) => proyecto.id_proyecto);

        resultado = await DetalleProyectoEtapa.findAll({
          where: { fk_cat_proyecto: { [Op.in]: proyectosIds } },
          include: [
            {
              model: Etapa,
              as: "cat_etapa",
            },
          ],
        });
        for (let etapa of resultado) {
          const etapa1 = etapa.cat_etapa;
          etapas.push({
            id_etapa: etapa1.id_cat_etapa,
            proyecto: etapa.fk_cat_proyecto,
          });
        }
        etapasIds = etapas.map((etapa) => etapa.id_etapa);
        resultado = await DetalleEtapaActividad.findAll({
          where: { fk_cat_etapa: { [Op.in]: etapasIds } },
          include: [
            {
              model: Actividades,
              as: "cat_actividade",
            },
          ],
        });
        for (let actividad of resultado) {
          actividades.push({
            id_actividad: actividad.fk_cat_actividad,
            etapa: actividad.fk_cat_etapa,
          });
        }
        actividadesIds = actividades.map((actividad) => actividad.id_actividad);

        resultado = await DetalleActividadTarea.findAll({
          attributes: [
            "fk_cat_actividad",
            "fk_cat_empleado",
            [
              pool.fn("COUNT", pool.col("id_detalle_actividad_tarea")),
              "cantidad_tareas",
            ],
            [
              pool.fn(
                "COUNT",
                pool.literal(`
                CASE WHEN estatus = 1 THEN 1 ELSE NULL END
              `)
              ),
              "tareas_completadas",
            ],
            [
              pool.fn(
                "COUNT",
                pool.literal(`
                CASE WHEN fk_cat_empleado = ${id} THEN 1 ELSE NULL END
              `)
              ),
              "tareas_empleado",
            ],
            [
              pool.fn(
                "TO_CHAR",
                pool.cast(
                  pool.fn(
                    "SUM",
                    pool.literal(`
                    CASE WHEN fk_cat_empleado = ${id} THEN "duracion" ELSE '00:00:00' END `)
                  ),
                  "interval"
                ),
                "'HH24:MI:SS'"
              ),
              "tiempo_invertido",
            ],
          ],
          group: ["fk_cat_actividad", "fk_cat_empleado"],
          where: {
            fk_cat_actividad: {
              [Op.in]: actividadesIds,
            },
          },
        });
        // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
        res.status(200).json({
          ok: true,
          results: {
            equipos, // Array de equipos obtenidos
            proyectos, // Array de proyectos obtenidos
            etapas, // Array de etapas obtenidas
            actividades, // Array de actividades obtenidas
            actividadesInformes: resultado, // Resultado final obtenido
          },
        });
        break;
      case 3:
        break;
      default:
        break;
    }
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
  actividadesGet,
  actividadesPost,
  actividadPut,
  actividadDelete,
  actividadIdGet,
  reporteActividadesPost,
};
