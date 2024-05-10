// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require("express");
// IMPORTACIÓN DEL OPERADOR 'Op' DE SEQUELIZE PARA REALIZAR OPERACIONES COMPLEJAS.
const { Op } = require("sequelize");
const fs = require("fs");
const pdf = require("html-pdf");

// IMPORTACIÓN DE LOS MODELOS NECESARIOS PARA REALIZAR CONSULTAS EN LA BASE DE DATOS.
const Actividades = require("../../models/modelos/catalogos/actividades");
const DetalleEtapaActividad = require("../../models/modelos/detalles/detalle_etapa_actividad");
const DetalleActividadTarea = require("../../models/modelos/detalles/detalle_actividad_tarea");
const DetalleProyectoEquipoTrabajo = require("../../models/modelos/detalles/detalle_proyecto_equipo_trabajo");
const DetalleProyectoEtapa = require("../../models/modelos/detalles/detalle_proyecto_etapa");
const DetalleEmpleadoEquipoTrabajo = require("../../models/modelos/detalles/detalle_empleado_equipo_trabajo");
const DetalleClienteProyectos = require("../../models/modelos/detalles/detalle_cliente_proyectos");
const pool = require("../../database/config");
const EquipoTrabajo = require("../../models/modelos/catalogos/equipoTrabajo");
const Proyectos = require("../../models/modelos/catalogos/proyectos");
const Empleado = require("../../models/modelos/catalogos/empleado");
const Etapa = require("../../models/modelos/catalogos/etapa");
const Cliente = require("../../models/modelos/catalogos/cliente");
const Persona = require("../../models/modelos/catalogos/persona");

/**
 * OBTIENE TODOS LAS ACTIVIDADES ACTIVAS DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const actividadesGet = async (req = request, res = response) => {
  try {
    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER ACTIVIDADES ACTIVAS.
    const query = { estatus: 1 };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO ACTIVIDADES Y SUS RELACIONES.
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
 * OBTIENE UNA ACTIVIDAD ESPECÍFICA POR SU ID, SI ESTÁ ACTIVA.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const actividadIdGet = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DE LA ACTIVIDAD DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER UNA ACTIVIDAD ESPECÍFICA Y ACTIVA.
    const query = {
      id_cat_actividad: id,
      estatus: 1,
    };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UNA ACTIVIDAD Y SUS RELACIONES.
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
 * REGISTRA UNA NUEVA ACTIVIDAD EN LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const actividadesPost = async (req = request, res = response) => {
  try {
    // EXTRAEMOS LOS DATOS NECESARIOS DEL CUERPO DE LA SOLICITUD.
    const { actividad_nombre, descripcion, equipo_trabajo } = req.body;

    // CREAMOS UNA NUEVA ACTIVIDAD EN LA BASE DE DATOS.
    const actividad = await Actividades.create({
      actividad: actividad_nombre,
      descripcion,
      fk_cat_equipo_trabajo: equipo_trabajo,
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
 * ACTUALIZA LA INFORMACIÓN DE UNA ACTIVIDAD EXISTENTE EN LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta y cuerpo.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const actividadPut = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DE LA ACTIVIDAD DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // EXTRAEMOS LOS DATOS DEL CUERPO DE LA SOLICITUD.
    const { actividad_nombre, descripcion, equipo_trabajo } = req.body;

    // OBTENEMOS LA ACTIVIDAD EXISTENTE Y SUS RELACIONES.
    const actividad = await Actividades.findByPk(id);

    // ACTUALIZAMOS LA INFORMACIÓN DE LA ACTIVIDAD.
    actividad.actividad = actividad_nombre;
    actividad.descripcion = descripcion;
    actividad.fk_cat_equipo_trabajo = equipo_trabajo;
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
 * ELIMINA LÓGICAMENTE UNA ACTIVIDAD DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const actividadDelete = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DE LA ACTIVIDAD DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // OBTENEMOS LA ACTIVIDAD EXISTENTE.
    const actividad = await Actividades.findByPk(id);

    // CAMBIAMOS EL ESTATUS DE LA ACTIVIDAD A 0 PARA ELIMINARLO LÓGICAMENTE.
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
 * GENERAMOS UN REPORTE DE ACTIVIDADES SEGUN SUS ESPECIFICACIONES
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
    let proyectos = [];
    let actividades = [];
    let etapas = [];
    let ACTIVIDADES = [];
    let actividadesIds = [];
    let proyectosIds = [];
    let etapasIds = [];
    let proyectosACTIVIDADES = [];
    let etapasProyectos = [];
    let actividadesEtapas = [];
    let informes = [];

    switch (tipo) {
      case 1:
        const empleado = await Empleado.findOne({
          where: {
            id_cat_empleado: {
              [Op.eq]: id,
            },
            estatus: 1,
          },
          include: [
            {
              model: Persona,
              as: "persona",
            },
          ],
        });

        if (!empleado) {
          //RETORNAMOS MENSAJE DE ERROR
          return res.status(400).json({
            ok: false,
            results: {
              msg: `El empleado con el ID ${id} no existe o se encuentra desactivado`,
            },
          });
        }

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
                  where: { estatus: 1 },
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
              where: { estatus: 1 },
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

        resultado = await DetalleClienteProyectos.findAll({
          where: { fk_cat_proyecto: { [Op.in]: proyectosIds } },
          include: [
            {
              model: Proyectos,
              as: "cat_proyecto",
              where: { estatus: 1 },
            },
            {
              model: Cliente,
              as: "cat_cliente",
              include: [{ model: Persona, as: "persona" }],
            },
          ],
        });
        for (let cliente of resultado) {
          ACTIVIDADES.push({
            nombre_cliente: cliente.cat_cliente.persona.nombre,
            id_proyecto: cliente.fk_cat_proyecto,
          });
        }

        resultado = await DetalleProyectoEtapa.findAll({
          where: { fk_cat_proyecto: { [Op.in]: proyectosIds } },
          include: [
            {
              model: Etapa,
              as: "cat_etapa",
              where: { estatus: 1 },
            },
          ],
        });
        for (let etapa of resultado) {
          const etapa1 = etapa.cat_etapa;
          etapas.push({
            id_etapa: etapa1.id_cat_etapa,
            id_proyecto: etapa.fk_cat_proyecto,
          });
        }
        etapasIds = etapas.map((etapa) => etapa.id_etapa);
        resultado = await DetalleEtapaActividad.findAll({
          where: { fk_cat_etapa: { [Op.in]: etapasIds } },
          include: [
            {
              model: Actividades,
              as: "cat_actividade",
              where: {
                fk_cat_equipo_trabajo: { [Op.in]: equipos },
                estatus: 1,
              },
            },
          ],
          where: { estatus: { [Op.ne]: 0 } },
        });
        for (let actividad of resultado) {
          actividades.push({
            id_actividad: actividad.fk_cat_actividad,
            nombre: actividad.cat_actividade.actividad,
            etapa: actividad.fk_cat_etapa,
            fecha: actividad.fecha,
          });
        }
        actividadesIds = actividades.map((actividad) => actividad.id_actividad);
        resultado = await DetalleActividadTarea.findAll({
          attributes: [
            "fk_cat_actividad",
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
                CASE WHEN fk_cat_empleado = ${id} AND estatus = 1 THEN 1 ELSE NULL END
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
                    CASE WHEN fk_cat_empleado = ${id} AND estatus = 1 THEN "duracion" ELSE '00:00:00' END `)
                  ),
                  "interval"
                ),
                "'HH24:MI:SS'"
              ),
              "tiempo_invertido",
            ],
          ],
          group: ["fk_cat_actividad"],
          where: {
            fk_cat_actividad: {
              [Op.in]: actividadesIds,
            },
          },
        });
        // Mapeamos los resultados para reorganizar la estructura
        proyectosACTIVIDADES = proyectos.map((proyecto) => {
          const resultadoACTIVIDADES = ACTIVIDADES.find((cliente) => {
            return cliente.id_proyecto === proyecto.id_proyecto;
          });

          return {
            id_proyecto: proyecto.id_proyecto,
            nombre_proyecto: proyecto.nombre,
            nombre_cliente: resultadoACTIVIDADES.nombre_cliente,
          };
        });
        // Mapeamos los resultados para reorganizar la estructura
        etapasProyectos = etapas.map((etapa) => {
          const resultadoProyectos = proyectosACTIVIDADES.find((proyecto) => {
            return proyecto.id_proyecto === etapa.id_proyecto;
          });

          return {
            id_proyecto: etapa.id_proyecto,
            id_etapa: etapa.id_etapa,
            nombre_proyecto: resultadoProyectos.nombre_proyecto,
            nombre_cliente: resultadoProyectos.nombre_cliente,
          };
        });
        // Mapeamos los resultados para reorganizar la estructura
        actividadesEtapas = actividades.map((actividad) => {
          const resultadoEtapas = etapasProyectos.find((etapas) => {
            return etapas.id_etapa === actividad.etapa;
          });

          return {
            id_proyecto: resultadoEtapas.id_proyecto,
            id_etapa: resultadoEtapas.id_etapa,
            id_actividad: actividad.id_actividad,
            nombre_proyecto: resultadoEtapas.nombre_proyecto,
            nombre_actividad: actividad.nombre,
            fecha_actividad: actividad.fecha,
            nombre_cliente: resultadoEtapas.nombre_cliente,
          };
        });
        // Mapeamos los resultados para reorganizar la estructura
        informes = resultado.map((tarea) => {
          const resultadoActividades = actividadesEtapas.find((actividad) => {
            return actividad.id_actividad === tarea.fk_cat_actividad;
          });

          return {
            id_proyecto: resultadoActividades.id_proyecto,
            id_etapa: resultadoActividades.id_etapa,
            id_actividad: resultadoActividades.id_actividad,
            nombre_proyecto: resultadoActividades.nombre_proyecto,
            nombre_actividad: resultadoActividades.nombre_actividad,
            fecha_actividad: resultadoActividades.fecha,
            cantidad_tareas: tarea.dataValues.cantidad_tareas,
            tareas_completadas: tarea.dataValues.tareas_completadas,
            tareas_empleado: tarea.dataValues.tareas_empleado,
            tiempo_invertido: tarea.dataValues.tiempo_invertido,
            nombre_cliente: resultadoActividades.nombre_cliente,
          };
        });
        // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
        res.render(
          "../../../public/reporteEmpleado.ejs",
          {
            informes,
            nombre_empleado: `${empleado.persona.nombre} ${empleado.persona.apellido_Paterno} ${empleado.persona.apellido_Materno}`,
            id_empleado: id,
            fecha_inicio,
            fecha_fin,
          },
          (err, html) => {
            res.send(html);
          }
        );
        break;
      case 2:
        // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UN EQUIPO DE TRABAJO Y SUS RELACIONES.
        const equipo_trabajo = await EquipoTrabajo.findOne({
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
          where: { id_cat_equipo_trabajo: id, estatus: 1 },
        });

        if (!equipo_trabajo) {
          //RETORNAMOS MENSAJE DE ERROR
          return res.status(400).json({
            ok: false,
            results: {
              msg: `El equipo_trabajo con el ID ${id} no existe o se encuentra inactivo`,
            },
          });
        }
        console.log(equipo_trabajo.detalle_empleados);

        const empleadosIds = equipo_trabajo.detalle_empleados.map(
          (equipo) => equipo.fk_cat_empleado
        );

        const empleadosNombres = equipo_trabajo.detalle_empleados.map(
          (equipo) =>
            `${equipo.cat_empleado.persona.nombre} ${equipo.cat_empleado.persona.apellido_Paterno} ${equipo.cat_empleado.persona.apellido_Materno}`
        );

        resultado = await DetalleProyectoEquipoTrabajo.findAll({
          include: [
            {
              model: Proyectos,
              as: "cat_proyecto",
              where: { estatus: 1 },
            },
          ],
          where: {
            fk_cat_equipo_trabajo: {
              [Op.eq]: id,
            },
          },
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

        resultado = await DetalleClienteProyectos.findAll({
          where: { fk_cat_proyecto: { [Op.in]: proyectosIds } },
          include: [
            {
              model: Proyectos,
              as: "cat_proyecto",
              where: { estatus: 1 },
            },
            {
              model: Cliente,
              as: "cat_cliente",
              include: [{ model: Persona, as: "persona" }],
            },
          ],
        });
        for (let cliente of resultado) {
          ACTIVIDADES.push({
            nombre_cliente: cliente.cat_cliente.persona.nombre,
            id_proyecto: cliente.fk_cat_proyecto,
          });
        }

        resultado = await DetalleProyectoEtapa.findAll({
          where: { fk_cat_proyecto: { [Op.in]: proyectosIds } },
          include: [
            {
              model: Etapa,
              as: "cat_etapa",
              where: { estatus: 1 },
            },
          ],
        });
        for (let etapa of resultado) {
          const etapa1 = etapa.cat_etapa;
          etapas.push({
            id_etapa: etapa1.id_cat_etapa,
            id_proyecto: etapa.fk_cat_proyecto,
          });
        }
        etapasIds = etapas.map((etapa) => etapa.id_etapa);
        resultado = await DetalleEtapaActividad.findAll({
          where: { fk_cat_etapa: { [Op.in]: etapasIds } },
          include: [
            {
              model: Actividades,
              as: "cat_actividade",
              where: {
                fk_cat_equipo_trabajo: { [Op.eq]: id },
                estatus: 1,
              },
            },
          ],
          where: { estatus: { [Op.ne]: 0 } },
        });
        for (let actividad of resultado) {
          actividades.push({
            id_actividad: actividad.fk_cat_actividad,
            nombre: actividad.cat_actividade.actividad,
            etapa: actividad.fk_cat_etapa,
            fecha: actividad.fecha,
          });
        }
        actividadesIds = actividades.map((actividad) => actividad.id_actividad);
        resultado = await DetalleActividadTarea.findAll({
          attributes: [
            "fk_cat_actividad",
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
                  CASE WHEN fk_cat_empleado IN (${empleadosIds.join(",")})
                       AND estatus = 1 THEN 1
                       ELSE NULL
                  END
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
                    CASE WHEN fk_cat_empleado IN (${empleadosIds.join(
                      ","
                    )}) AND estatus = 1 THEN "duracion" ELSE '00:00:00' END `)
                  ),
                  "interval"
                ),
                "'HH24:MI:SS'"
              ),
              "tiempo_invertido",
            ],
          ],
          group: ["fk_cat_actividad"],
          where: {
            fk_cat_actividad: {
              [Op.in]: actividadesIds,
            },
          },
        });
        // Mapeamos los resultados para reorganizar la estructura
        proyectosACTIVIDADES = proyectos.map((proyecto) => {
          const resultadoACTIVIDADES = ACTIVIDADES.find((cliente) => {
            return cliente.id_proyecto === proyecto.id_proyecto;
          });

          return {
            id_proyecto: proyecto.id_proyecto,
            nombre_proyecto: proyecto.nombre,
            nombre_cliente: resultadoACTIVIDADES.nombre_cliente,
          };
        });
        // Mapeamos los resultados para reorganizar la estructura
        etapasProyectos = etapas.map((etapa) => {
          const resultadoProyectos = proyectosACTIVIDADES.find((proyecto) => {
            return proyecto.id_proyecto === etapa.id_proyecto;
          });

          return {
            id_proyecto: etapa.id_proyecto,
            id_etapa: etapa.id_etapa,
            nombre_proyecto: resultadoProyectos.nombre_proyecto,
            nombre_cliente: resultadoProyectos.nombre_cliente,
          };
        });
        // Mapeamos los resultados para reorganizar la estructura
        actividadesEtapas = actividades.map((actividad) => {
          const resultadoEtapas = etapasProyectos.find((etapas) => {
            return etapas.id_etapa === actividad.etapa;
          });

          return {
            id_proyecto: resultadoEtapas.id_proyecto,
            id_etapa: resultadoEtapas.id_etapa,
            id_actividad: actividad.id_actividad,
            nombre_proyecto: resultadoEtapas.nombre_proyecto,
            nombre_actividad: actividad.nombre,
            fecha_actividad: actividad.fecha,
            nombre_cliente: resultadoEtapas.nombre_cliente,
          };
        });
        // Mapeamos los resultados para reorganizar la estructura
        informes = resultado.map((tarea) => {
          const resultadoActividades = actividadesEtapas.find((actividad) => {
            return actividad.id_actividad === tarea.fk_cat_actividad;
          });

          return {
            id_proyecto: resultadoActividades.id_proyecto,
            id_etapa: resultadoActividades.id_etapa,
            id_actividad: resultadoActividades.id_actividad,
            nombre_proyecto: resultadoActividades.nombre_proyecto,
            nombre_actividad: resultadoActividades.nombre_actividad,
            fecha_actividad: resultadoActividades.fecha,
            cantidad_tareas: tarea.dataValues.cantidad_tareas,
            tareas_completadas: tarea.dataValues.tareas_completadas,
            tareas_empleado: tarea.dataValues.tareas_empleado,
            tiempo_invertido: tarea.dataValues.tiempo_invertido,
            nombre_cliente: resultadoActividades.nombre_cliente,
          };
        });
        // RETORNAMOS LOS DATOS OBTENIDOS RENDERIZANDO LA RESPUESTA.
        res.render(
          "../../../public/reporteEquipoTrabajo.ejs",
          {
            informes,
            equipo_trabajo,
            empleados: empleadosNombres,
            id_equipo: id,
            fecha_inicio,
            fecha_fin,
          },
          (err, html) => {
            res.send(html);
          }
        );
        break;
      case 3:
        const proyecto = await Proyectos.findOne({
          where: {
            id_cat_proyecto: {
              [Op.eq]: id,
            },
          },
        });

        if (!proyecto) {
          //RETORNAMOS MENSAJE DE ERROR
          return res.status(400).json({
            ok: false,
            results: {
              msg: `El proyecto con el ID ${id} no existe intente de nuevo`,
            },
          });
        }

        resultado = await DetalleClienteProyectos.findOne({
          where: { fk_cat_proyecto: { [Op.eq]: id } },
          include: [
            {
              model: Proyectos,
              as: "cat_proyecto",
              where: { estatus: 1 },
            },
            {
              model: Cliente,
              as: "cat_cliente",
              include: [{ model: Persona, as: "persona" }],
            },
          ],
        });
        ACTIVIDADES.push({
          nombre_cliente: resultado.cat_cliente.persona.nombre,
          id_proyecto: resultado.fk_cat_proyecto,
        });

        resultado = await DetalleProyectoEtapa.findAll({
          where: { fk_cat_proyecto: id },
          include: [
            {
              model: Etapa,
              as: "cat_etapa",
              where: { estatus: 1 },
            },
          ],
        });
        for (let etapa of resultado) {
          const etapa1 = etapa.cat_etapa;
          etapas.push({
            id_etapa: etapa1.id_cat_etapa,
            id_proyecto: etapa.fk_cat_proyecto,
          });
        }
        etapasIds = etapas.map((etapa) => etapa.id_etapa);
        resultado = await DetalleEtapaActividad.findAll({
          include: [
            {
              model: Actividades,
              as: "cat_actividade",
              where: { estatus: 1 },
              include: [{ model: EquipoTrabajo, as: "equipo_trabajo" }],
            },
          ],
          where: {
            fk_cat_etapa: { [Op.in]: etapasIds },
            estatus: { [Op.ne]: 0 },
          },
        });
        for (let actividad of resultado) {
          actividades.push({
            id_actividad: actividad.fk_cat_actividad,
            nombre: actividad.cat_actividade.actividad,
            etapa: actividad.fk_cat_etapa,
            fecha: actividad.fecha,
            id_equipo: actividad.cat_actividade.fk_cat_equipo_trabajo,
            equipo: actividad.cat_actividade.equipo_trabajo.equipo_trabajo,
          });
        }
        actividadesIds = actividades.map((actividad) => actividad.id_actividad);
        resultado = await DetalleActividadTarea.findAll({
          attributes: [
            "fk_cat_actividad",
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
                CASE WHEN fk_cat_empleado IS NOT NULL AND estatus = 1 THEN 1 ELSE NULL END
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
                    CASE WHEN fk_cat_empleado IS NOT NULL AND estatus = 1 THEN "duracion" ELSE '00:00:00' END `)
                  ),
                  "interval"
                ),
                "'HH24:MI:SS'"
              ),
              "tiempo_invertido",
            ],
          ],
          group: ["fk_cat_actividad"],
          where: {
            fk_cat_actividad: {
              [Op.in]: actividadesIds,
            },
          },
        });
        // Mapeamos los resultados para reorganizar la estructura
        proyectosACTIVIDADES = {
          id_proyecto: proyecto.id_cat_proyecto,
          nombre_proyecto: proyecto.proyecto,
          nombre_cliente: ACTIVIDADES[0].nombre_cliente,
        };
        // Mapeamos los resultados para reorganizar la estructura
        etapasProyectos = etapas.map((etapa) => {
          return {
            id_proyecto: etapa.id_proyecto,
            id_etapa: etapa.id_etapa,
            nombre_proyecto: proyectosACTIVIDADES.nombre_proyecto,
            nombre_cliente: proyectosACTIVIDADES.nombre_cliente,
          };
        });
        // Mapeamos los resultados para reorganizar la estructura
        actividadesEtapas = actividades.map((actividad) => {
          const resultadoEtapas = etapasProyectos.find((etapas) => {
            return etapas.id_etapa === actividad.etapa;
          });

          return {
            id_proyecto: resultadoEtapas.id_proyecto,
            id_etapa: resultadoEtapas.id_etapa,
            id_actividad: actividad.id_actividad,
            id_equipo: actividad.id_equipo,
            equipo: actividad.equipo,
            nombre_proyecto: resultadoEtapas.nombre_proyecto,
            nombre_actividad: actividad.nombre,
            fecha: actividad.fecha,
            nombre_cliente: resultadoEtapas.nombre_cliente,
          };
        });
        // Mapeamos los resultados para reorganizar la estructura
        informes = resultado.map((tarea) => {
          const resultadoActividades = actividadesEtapas.find((actividad) => {
            return actividad.id_actividad === tarea.fk_cat_actividad;
          });

          return {
            id_proyecto: resultadoActividades.id_proyecto,
            id_etapa: resultadoActividades.id_etapa,
            id_actividad: resultadoActividades.id_actividad,
            id_equipo: resultadoActividades.id_equipo,
            equipo: resultadoActividades.equipo,
            nombre_proyecto: resultadoActividades.nombre_proyecto,
            nombre_actividad: resultadoActividades.nombre_actividad,
            fecha_actividad: resultadoActividades.fecha,
            cantidad_tareas: tarea.dataValues.cantidad_tareas,
            tareas_completadas: tarea.dataValues.tareas_completadas,
            tareas_empleado: tarea.dataValues.tareas_empleado,
            tiempo_invertido: tarea.dataValues.tiempo_invertido,
            nombre_cliente: resultadoActividades.nombre_cliente,
          };
        });
        // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
        res.render(
          "../../../public/reporteProyecto.ejs",
          {
            informes,
            nombre_proyecto: proyecto.proyecto,
            fecha_inicio,
            fecha_fin,
          },
          (err, html) => {
            res.send(html);
          }
        );
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

/**
 * GENERAMOS UN REPORTE DE LAS ACTIVIDADES SEGUN SEA EL TIPO Y SUS ESPECIFICACIONES.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const reporteActividadesPdfPost = async (req, res) => {
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
    let proyectos = [];
    let actividades = [];
    let etapas = [];
    let ACTIVIDADES = [];
    let actividadesIds = [];
    let proyectosIds = [];
    let etapasIds = [];
    let proyectosACTIVIDADES = [];
    let etapasProyectos = [];
    let actividadesEtapas = [];
    let informes = [];

    switch (tipo) {
      case 1:
        const empleado = await Empleado.findOne({
          where: {
            id_cat_empleado: {
              [Op.eq]: id,
            },
            estatus: 1,
          },
          include: [
            {
              model: Persona,
              as: "persona",
            },
          ],
        });

        if (!empleado) {
          //RETORNAMOS MENSAJE DE ERROR
          return res.status(400).json({
            ok: false,
            results: {
              msg: `El empleado con el ID ${id} no existe o se encuentra desactivado`,
            },
          });
        }

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
                  where: { estatus: 1 },
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
              where: { estatus: 1 },
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

        resultado = await DetalleClienteProyectos.findAll({
          where: { fk_cat_proyecto: { [Op.in]: proyectosIds } },
          include: [
            {
              model: Proyectos,
              as: "cat_proyecto",
              where: { estatus: 1 },
            },
            {
              model: Cliente,
              as: "cat_cliente",
              include: [{ model: Persona, as: "persona" }],
            },
          ],
        });
        for (let cliente of resultado) {
          ACTIVIDADES.push({
            nombre_cliente: cliente.cat_cliente.persona.nombre,
            id_proyecto: cliente.fk_cat_proyecto,
          });
        }

        resultado = await DetalleProyectoEtapa.findAll({
          where: { fk_cat_proyecto: { [Op.in]: proyectosIds } },
          include: [
            {
              model: Etapa,
              as: "cat_etapa",
              where: { estatus: 1 },
            },
          ],
        });
        for (let etapa of resultado) {
          const etapa1 = etapa.cat_etapa;
          etapas.push({
            id_etapa: etapa1.id_cat_etapa,
            id_proyecto: etapa.fk_cat_proyecto,
          });
        }
        etapasIds = etapas.map((etapa) => etapa.id_etapa);
        resultado = await DetalleEtapaActividad.findAll({
          where: { fk_cat_etapa: { [Op.in]: etapasIds } },
          include: [
            {
              model: Actividades,
              as: "cat_actividade",
              where: {
                fk_cat_equipo_trabajo: { [Op.in]: equipos },
                estatus: 1,
              },
            },
          ],
          where: { estatus: { [Op.ne]: 0 } },
        });
        for (let actividad of resultado) {
          actividades.push({
            id_actividad: actividad.fk_cat_actividad,
            nombre: actividad.cat_actividade.actividad,
            etapa: actividad.fk_cat_etapa,
            fecha: actividad.fecha,
          });
        }
        actividadesIds = actividades.map((actividad) => actividad.id_actividad);
        resultado = await DetalleActividadTarea.findAll({
          attributes: [
            "fk_cat_actividad",
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
                CASE WHEN fk_cat_empleado = ${id} AND estatus = 1 THEN 1 ELSE NULL END
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
                    CASE WHEN fk_cat_empleado = ${id} AND estatus = 1 THEN "duracion" ELSE '00:00:00' END `)
                  ),
                  "interval"
                ),
                "'HH24:MI:SS'"
              ),
              "tiempo_invertido",
            ],
          ],
          group: ["fk_cat_actividad"],
          where: {
            fk_cat_actividad: {
              [Op.in]: actividadesIds,
            },
          },
        });
        // Mapeamos los resultados para reorganizar la estructura
        proyectosACTIVIDADES = proyectos.map((proyecto) => {
          const resultadoACTIVIDADES = ACTIVIDADES.find((cliente) => {
            return cliente.id_proyecto === proyecto.id_proyecto;
          });

          return {
            id_proyecto: proyecto.id_proyecto,
            nombre_proyecto: proyecto.nombre,
            nombre_cliente: resultadoACTIVIDADES.nombre_cliente,
          };
        });
        // Mapeamos los resultados para reorganizar la estructura
        etapasProyectos = etapas.map((etapa) => {
          const resultadoProyectos = proyectosACTIVIDADES.find((proyecto) => {
            return proyecto.id_proyecto === etapa.id_proyecto;
          });

          return {
            id_proyecto: etapa.id_proyecto,
            id_etapa: etapa.id_etapa,
            nombre_proyecto: resultadoProyectos.nombre_proyecto,
            nombre_cliente: resultadoProyectos.nombre_cliente,
          };
        });
        // Mapeamos los resultados para reorganizar la estructura
        actividadesEtapas = actividades.map((actividad) => {
          const resultadoEtapas = etapasProyectos.find((etapas) => {
            return etapas.id_etapa === actividad.etapa;
          });

          return {
            id_proyecto: resultadoEtapas.id_proyecto,
            id_etapa: resultadoEtapas.id_etapa,
            id_actividad: actividad.id_actividad,
            nombre_proyecto: resultadoEtapas.nombre_proyecto,
            nombre_actividad: actividad.nombre,
            fecha_actividad: actividad.fecha,
            nombre_cliente: resultadoEtapas.nombre_cliente,
          };
        });
        // Mapeamos los resultados para reorganizar la estructura
        informes = resultado.map((tarea) => {
          const resultadoActividades = actividadesEtapas.find((actividad) => {
            return actividad.id_actividad === tarea.fk_cat_actividad;
          });

          return {
            id_proyecto: resultadoActividades.id_proyecto,
            id_etapa: resultadoActividades.id_etapa,
            id_actividad: resultadoActividades.id_actividad,
            nombre_proyecto: resultadoActividades.nombre_proyecto,
            nombre_actividad: resultadoActividades.nombre_actividad,
            fecha_actividad: resultadoActividades.fecha,
            cantidad_tareas: tarea.dataValues.cantidad_tareas,
            tareas_completadas: tarea.dataValues.tareas_completadas,
            tareas_empleado: tarea.dataValues.tareas_empleado,
            tiempo_invertido: tarea.dataValues.tiempo_invertido,
            nombre_cliente: resultadoActividades.nombre_cliente,
          };
        });
        // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
        res.render(
          "../../../public/reporteEmpleado1.ejs",
          {
            informes,
            nombre_empleado: `${empleado.persona.nombre} ${empleado.persona.apellido_Paterno} ${empleado.persona.apellido_Materno}`,
            id_empleado: id,
            fecha_inicio,
            fecha_fin,
          },
          async (err, html) => {
            // Opciones para la generación del PDF
            const options = { format: "HTML" };
            // Generar el PDF y guardarlo en un archivo
            pdf
              .create(html, options)
              .toFile("reporteEmpleado.pdf", function (err, res) {
                if (err) return console.log(err);
                //console.log("PDF generado correctamente!");
              });
            // Llamar a la función esperarSegundos antes de generar el PDF
            await esperarSegundos(3); // Espera 5 segundos
            // Leer el contenido del PDF generado
            const pdfBuffer = fs.readFileSync("./reporteEmpleado.pdf");
            // Establecer headers
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
              "Content-Disposition",
              "attachment; filename=mi-reporte.pdf"
            );
            // Enviar el buffer del PDF como respuesta
            res.send(pdfBuffer);
          }
        );
        break;
      case 2:
        // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UN CLIENTE Y SUS RELACIONES.
        const equipo_trabajo = await EquipoTrabajo.findOne({
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
          where: { id_cat_equipo_trabajo: id, estatus: 1 },
        });

        if (!equipo_trabajo) {
          //RETORNAMOS MENSAJE DE ERROR
          return res.status(400).json({
            ok: false,
            results: {
              msg: `El equipo_trabajo con el ID ${id} no existe o se encuentra inactivo`,
            },
          });
        }

        const empleadosIds = equipo_trabajo.detalle_empleados.map(
          (equipo) => equipo.fk_cat_empleado
        );

        const empleadosNombres = equipo_trabajo.detalle_empleados.map(
          (equipo) =>
            `${equipo.cat_empleado.persona.nombre} ${equipo.cat_empleado.persona.apellido_Paterno} ${equipo.cat_empleado.persona.apellido_Materno}`
        );

        resultado = await DetalleProyectoEquipoTrabajo.findAll({
          include: [
            {
              model: Proyectos,
              as: "cat_proyecto",
              where: { estatus: 1 },
            },
          ],
          where: {
            fk_cat_equipo_trabajo: {
              [Op.eq]: id,
            },
          },
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

        resultado = await DetalleClienteProyectos.findAll({
          where: { fk_cat_proyecto: { [Op.in]: proyectosIds } },
          include: [
            {
              model: Proyectos,
              as: "cat_proyecto",
              where: { estatus: 1 },
            },
            {
              model: Cliente,
              as: "cat_cliente",
              include: [{ model: Persona, as: "persona" }],
            },
          ],
        });
        for (let cliente of resultado) {
          ACTIVIDADES.push({
            nombre_cliente: cliente.cat_cliente.persona.nombre,
            id_proyecto: cliente.fk_cat_proyecto,
          });
        }

        resultado = await DetalleProyectoEtapa.findAll({
          where: { fk_cat_proyecto: { [Op.in]: proyectosIds } },
          include: [
            {
              model: Etapa,
              as: "cat_etapa",
              where: { estatus: 1 },
            },
          ],
        });
        for (let etapa of resultado) {
          const etapa1 = etapa.cat_etapa;
          etapas.push({
            id_etapa: etapa1.id_cat_etapa,
            id_proyecto: etapa.fk_cat_proyecto,
          });
        }
        etapasIds = etapas.map((etapa) => etapa.id_etapa);
        resultado = await DetalleEtapaActividad.findAll({
          where: { fk_cat_etapa: { [Op.in]: etapasIds } },
          include: [
            {
              model: Actividades,
              as: "cat_actividade",
              where: {
                fk_cat_equipo_trabajo: { [Op.eq]: id },
                estatus: 1,
              },
            },
          ],
          where: { estatus: { [Op.ne]: 0 } },
        });
        for (let actividad of resultado) {
          actividades.push({
            id_actividad: actividad.fk_cat_actividad,
            nombre: actividad.cat_actividade.actividad,
            etapa: actividad.fk_cat_etapa,
            fecha: actividad.fecha,
          });
        }
        actividadesIds = actividades.map((actividad) => actividad.id_actividad);
        resultado = await DetalleActividadTarea.findAll({
          attributes: [
            "fk_cat_actividad",
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
                  CASE WHEN fk_cat_empleado IN (${empleadosIds.join(",")})
                       AND estatus = 1 THEN 1
                       ELSE NULL
                  END
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
                    CASE WHEN fk_cat_empleado IN (${empleadosIds.join(
                      ","
                    )}) AND estatus = 1 THEN "duracion" ELSE '00:00:00' END `)
                  ),
                  "interval"
                ),
                "'HH24:MI:SS'"
              ),
              "tiempo_invertido",
            ],
          ],
          group: ["fk_cat_actividad"],
          where: {
            fk_cat_actividad: {
              [Op.in]: actividadesIds,
            },
          },
        });
        // Mapeamos los resultados para reorganizar la estructura
        proyectosACTIVIDADES = proyectos.map((proyecto) => {
          const resultadoACTIVIDADES = ACTIVIDADES.find((cliente) => {
            return cliente.id_proyecto === proyecto.id_proyecto;
          });

          return {
            id_proyecto: proyecto.id_proyecto,
            nombre_proyecto: proyecto.nombre,
            nombre_cliente: resultadoACTIVIDADES.nombre_cliente,
          };
        });
        // Mapeamos los resultados para reorganizar la estructura
        etapasProyectos = etapas.map((etapa) => {
          const resultadoProyectos = proyectosACTIVIDADES.find((proyecto) => {
            return proyecto.id_proyecto === etapa.id_proyecto;
          });

          return {
            id_proyecto: etapa.id_proyecto,
            id_etapa: etapa.id_etapa,
            nombre_proyecto: resultadoProyectos.nombre_proyecto,
            nombre_cliente: resultadoProyectos.nombre_cliente,
          };
        });
        // Mapeamos los resultados para reorganizar la estructura
        actividadesEtapas = actividades.map((actividad) => {
          const resultadoEtapas = etapasProyectos.find((etapas) => {
            return etapas.id_etapa === actividad.etapa;
          });

          return {
            id_proyecto: resultadoEtapas.id_proyecto,
            id_etapa: resultadoEtapas.id_etapa,
            id_actividad: actividad.id_actividad,
            nombre_proyecto: resultadoEtapas.nombre_proyecto,
            nombre_actividad: actividad.nombre,
            fecha_actividad: actividad.fecha,
            nombre_cliente: resultadoEtapas.nombre_cliente,
          };
        });
        // Mapeamos los resultados para reorganizar la estructura
        informes = resultado.map((tarea) => {
          const resultadoActividades = actividadesEtapas.find((actividad) => {
            return actividad.id_actividad === tarea.fk_cat_actividad;
          });

          return {
            id_proyecto: resultadoActividades.id_proyecto,
            id_etapa: resultadoActividades.id_etapa,
            id_actividad: resultadoActividades.id_actividad,
            nombre_proyecto: resultadoActividades.nombre_proyecto,
            nombre_actividad: resultadoActividades.nombre_actividad,
            fecha_actividad: resultadoActividades.fecha,
            cantidad_tareas: tarea.dataValues.cantidad_tareas,
            tareas_completadas: tarea.dataValues.tareas_completadas,
            tareas_empleado: tarea.dataValues.tareas_empleado,
            tiempo_invertido: tarea.dataValues.tiempo_invertido,
            nombre_cliente: resultadoActividades.nombre_cliente,
          };
        });
        // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
        res.render(
          "../../../public/reporteEquipoTrabajo1.ejs",
          {
            informes,
            equipo_trabajo,
            empleados: empleadosNombres,
            id_equipo: id,
            fecha_inicio,
            fecha_fin,
          },
          async (err, html) => {
            // Opciones para la generación del PDF
            const options = { format: "HTML" };
            // Generar el PDF y guardarlo en un archivo
            pdf
              .create(html, options)
              .toFile("reporteEquipo.pdf", function (err, res) {
                if (err) return console.log(err);
                //console.log("PDF generado correctamente!");
              });
            // Llamar a la función esperarSegundos antes de generar el PDF
            await esperarSegundos(3); // Espera 5 segundos
            // Leer el contenido del PDF generado
            const pdfBuffer = fs.readFileSync("./reporteEquipo.pdf");
            // Establecer headers
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
              "Content-Disposition",
              "attachment; filename=mi-reporte.pdf"
            );
            // Enviar el buffer del PDF como respuesta
            res.send(pdfBuffer);
          }
        );
        break;
      case 3:
        const proyecto = await Proyectos.findOne({
          where: {
            id_cat_proyecto: {
              [Op.eq]: id,
            },
          },
        });

        if (!proyecto) {
          //RETORNAMOS MENSAJE DE ERROR
          return res.status(400).json({
            ok: false,
            results: {
              msg: `El proyecto con el ID ${id} no existe intente de nuevo`,
            },
          });
        }

        resultado = await DetalleClienteProyectos.findOne({
          where: { fk_cat_proyecto: { [Op.eq]: id } },
          include: [
            {
              model: Proyectos,
              as: "cat_proyecto",
              where: { estatus: 1 },
            },
            {
              model: Cliente,
              as: "cat_cliente",
              include: [{ model: Persona, as: "persona" }],
            },
          ],
        });
        ACTIVIDADES.push({
          nombre_cliente: resultado.cat_cliente.persona.nombre,
          id_proyecto: resultado.fk_cat_proyecto,
        });

        resultado = await DetalleProyectoEtapa.findAll({
          where: { fk_cat_proyecto: id },
          include: [
            {
              model: Etapa,
              as: "cat_etapa",
              where: { estatus: 1 },
            },
          ],
        });
        for (let etapa of resultado) {
          const etapa1 = etapa.cat_etapa;
          etapas.push({
            id_etapa: etapa1.id_cat_etapa,
            id_proyecto: etapa.fk_cat_proyecto,
          });
        }
        etapasIds = etapas.map((etapa) => etapa.id_etapa);
        resultado = await DetalleEtapaActividad.findAll({
          include: [
            {
              model: Actividades,
              as: "cat_actividade",
              where: { estatus: 1 },
              include: [{ model: EquipoTrabajo, as: "equipo_trabajo" }],
            },
          ],
          where: {
            fk_cat_etapa: { [Op.in]: etapasIds },
            estatus: { [Op.ne]: 0 },
          },
        });
        for (let actividad of resultado) {
          actividades.push({
            id_actividad: actividad.fk_cat_actividad,
            nombre: actividad.cat_actividade.actividad,
            etapa: actividad.fk_cat_etapa,
            fecha: actividad.fecha,
            id_equipo: actividad.cat_actividade.fk_cat_equipo_trabajo,
            equipo: actividad.cat_actividade.equipo_trabajo.equipo_trabajo,
          });
        }
        actividadesIds = actividades.map((actividad) => actividad.id_actividad);
        resultado = await DetalleActividadTarea.findAll({
          attributes: [
            "fk_cat_actividad",
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
                CASE WHEN fk_cat_empleado IS NOT NULL AND estatus = 1 THEN 1 ELSE NULL END
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
                    CASE WHEN fk_cat_empleado IS NOT NULL AND estatus = 1 THEN "duracion" ELSE '00:00:00' END `)
                  ),
                  "interval"
                ),
                "'HH24:MI:SS'"
              ),
              "tiempo_invertido",
            ],
          ],
          group: ["fk_cat_actividad"],
          where: {
            fk_cat_actividad: {
              [Op.in]: actividadesIds,
            },
          },
        });
        // Mapeamos los resultados para reorganizar la estructura
        proyectosACTIVIDADES = {
          id_proyecto: proyecto.id_cat_proyecto,
          nombre_proyecto: proyecto.proyecto,
          nombre_cliente: ACTIVIDADES[0].nombre_cliente,
        };
        // Mapeamos los resultados para reorganizar la estructura
        etapasProyectos = etapas.map((etapa) => {
          return {
            id_proyecto: etapa.id_proyecto,
            id_etapa: etapa.id_etapa,
            nombre_proyecto: proyectosACTIVIDADES.nombre_proyecto,
            nombre_cliente: proyectosACTIVIDADES.nombre_cliente,
          };
        });
        // Mapeamos los resultados para reorganizar la estructura
        actividadesEtapas = actividades.map((actividad) => {
          const resultadoEtapas = etapasProyectos.find((etapas) => {
            return etapas.id_etapa === actividad.etapa;
          });

          return {
            id_proyecto: resultadoEtapas.id_proyecto,
            id_etapa: resultadoEtapas.id_etapa,
            id_actividad: actividad.id_actividad,
            id_equipo: actividad.id_equipo,
            equipo: actividad.equipo,
            nombre_proyecto: resultadoEtapas.nombre_proyecto,
            nombre_actividad: actividad.nombre,
            fecha: actividad.fecha,
            nombre_cliente: resultadoEtapas.nombre_cliente,
          };
        });
        // Mapeamos los resultados para reorganizar la estructura
        informes = resultado.map((tarea) => {
          const resultadoActividades = actividadesEtapas.find((actividad) => {
            return actividad.id_actividad === tarea.fk_cat_actividad;
          });

          return {
            id_proyecto: resultadoActividades.id_proyecto,
            id_etapa: resultadoActividades.id_etapa,
            id_actividad: resultadoActividades.id_actividad,
            id_equipo: resultadoActividades.id_equipo,
            equipo: resultadoActividades.equipo,
            nombre_proyecto: resultadoActividades.nombre_proyecto,
            nombre_actividad: resultadoActividades.nombre_actividad,
            fecha_actividad: resultadoActividades.fecha,
            cantidad_tareas: tarea.dataValues.cantidad_tareas,
            tareas_completadas: tarea.dataValues.tareas_completadas,
            tareas_empleado: tarea.dataValues.tareas_empleado,
            tiempo_invertido: tarea.dataValues.tiempo_invertido,
            nombre_cliente: resultadoActividades.nombre_cliente,
          };
        });
        // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
        res.render(
          "../../../public/reporteProyecto1.ejs",
          {
            informes,
            nombre_proyecto: proyecto.proyecto,
            fecha_inicio,
            fecha_fin,
          },
          async (err, html) => {
            // Opciones para la generación del PDF
            const options = { format: "HTML" };
            // Generar el PDF y guardarlo en un archivo
            pdf
              .create(html, options)
              .toFile("reporteProyecto.pdf", function (err, res) {
                if (err) return console.log(err);
                //console.log("PDF generado correctamente!");
              });
            // Llamar a la función esperarSegundos antes de generar el PDF
            await esperarSegundos(3); // Espera 5 segundos
            // Leer el contenido del PDF generado
            const pdfBuffer = fs.readFileSync("./reporteProyecto.pdf");
            // Establecer headers
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
              "Content-Disposition",
              "attachment; filename=mi-reporte.pdf"
            );
            // Enviar el buffer del PDF como respuesta
            res.send(pdfBuffer);
          }
        );
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
function esperarSegundos(segundos) {
  return new Promise((resolve) => {
    setTimeout(resolve, segundos * 1000);
  });
}

// EXPORTAMOS LAS FUNCIONES PARA SU USO EN OTROS ARCHIVOS.
module.exports = {
  actividadesGet,
  actividadesPost,
  actividadPut,
  actividadDelete,
  actividadIdGet,
  reporteActividadesPost,
  reporteActividadesPdfPost,
};
