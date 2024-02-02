// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require("express");
// IMPORTACIÓN DEL OPERADOR 'Op' DE SEQUELIZE PARA REALIZAR OPERACIONES COMPLEJAS.
const { Op } = require("sequelize");
// IMPORTACIÓN DE LOS MODELOS DE BASE DE DATOS.
const Permisos = require("../../models/modelos/catalogos/permisos");
const DetallePermisosEmpleado = require("../../models/modelos/detalles/detalle_permisos_empleado");
const DetalleUsuarioRol = require("../../models/modelos/detalles/detalle_usuario_rol");
const Empleado = require("../../models/modelos/catalogos/empleado");
const Persona = require("../../models/modelos/catalogos/persona");
const Roles = require("../../models/modelos/catalogos/roles");
const Usuario = require("../../models/modelos/usuario");

const pool = require("../../database/config");
/**
 * OBTIENE TODOS LOS PERMISOS CON ESTATUS ACTIVO.
 * @async
 * @function permisosGet
 * @param {request} req - OBJETO DE SOLICITUD HTTP.
 * @param {response} res - OBJETO DE RESPUESTA HTTP.
 * @returns {Object} RESPUESTA JSON CON LOS PERMISOS OBTENIDOS.
 */
const permisoGet = async (req = request, res = response) => {
  try {
    // DEFINE EL CRITERIO DE BÚSQUEDA PARA PERMISOS ACTIVOS.
    const query = { estatus: 1 };
    // REALIZA LA CONSULTA A LA BASE DE DATOS PARA OBTENER LOS PERMISOS ACTIVOS.
    const permisos = await Permisos.findAll({
      where: query,
    });

    // RESPONDE CON UN OBJETO JSON QUE CONTIENE LOS PERMISOS OBTENIDOS.
    res.status(200).json({
      ok: true,
      results: permisos,
    });
  } catch (error) {
    // MANEJO DE ERRORES: IMPRIME EL ERROR EN LA CONSOLA Y RESPONDE CON UN ERROR HTTP 500.
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "HA OCURRIDO UN ERROR, HABLE CON EL ADMINISTRADOR.",
    });
  }
};

/**
 * OBTIENE TODOS LOS CLIENTES ACTIVOS DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const permisosGet = async (req = request, res = response) => {
  try {
    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO CLIENTES Y SUS RELACIONES.
    const detallePermisosEmpleado = await DetallePermisosEmpleado.findAll({
      include: [
        {
          model: Empleado,
          as: "empleado",
          include: [
            { model: Persona, as: "persona" },
            {
              model: Usuario,
              as: "usuario",
              include: [
                {
                  model: DetalleUsuarioRol,
                  as: "detalle_usuario_rols",
                  include: [{ model: Roles, as: "cat_role" }],
                },
              ],
            },
          ],
        },
        { model: Permisos, as: "permiso" },
      ],
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      results: detallePermisosEmpleado,
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
const permisoIdGet = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL CLIENTE DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER UN CLIENTE ESPECÍFICO Y ACTIVO.
    const query = {
      id_detalle_permisos_empleado: id,
    };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UN CLIENTE Y SUS RELACIONES.
    const detallePermisosEmpleado = await DetallePermisosEmpleado.findAll({
      where: query,
      include: [
        { model: Empleado, as: "empleado" },
        { model: Permisos, as: "permiso" },
      ],
    });

    // SI NO SE ENCUENTRA EL CLIENTE, SE RETORNA UNA RESPUESTA DE ERROR.
    if (!detallePermisosEmpleado) {
      return res.status(404).json({
        ok: false,
        msg: "DetallePermisosEmpleado no encontrado.",
      });
    }

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      results: detallePermisosEmpleado,
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
const permisosIdGet = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL CLIENTE DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER UN CLIENTE ESPECÍFICO Y ACTIVO.
    const query = {
      fk_cat_empleado: id,
    };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UN CLIENTE Y SUS RELACIONES.
    const detallePermisosEmpleado = await DetallePermisosEmpleado.findAll({
      include: [
        { model: Empleado, as: "empleado" },
        { model: Permisos, as: "permiso" },
      ],
    });

    // SI NO SE ENCUENTRA EL CLIENTE, SE RETORNA UNA RESPUESTA DE ERROR.
    if (!detallePermisosEmpleado) {
      return res.status(404).json({
        ok: false,
        msg: "DetallePermisosEmpleado no encontrado.",
      });
    }

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      results: detallePermisosEmpleado,
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
const permisoPost = async (req = request, res = response) => {
  try {
    // EXTRAEMOS LOS DATOS NECESARIOS DEL CUERPO DE LA SOLICITUD.
    const {
      fecha_permiso,
      tiempo_horas,
      id_cat_empleado,
      id_cat_permiso,
      detalle = "",
    } = req.body;

    const date = new Date();

    const fecha_solicitada = date.toISOString().slice(0, 10);
    const hora_solicitada = date.toTimeString().slice(0, 8);

    // Verificar si hay permisos existentes en los últimos 3 días hábiles
    const tresDiasAntes = new Date(fecha_permiso);
    tresDiasAntes.setDate(tresDiasAntes.getDate() - 3);

    // Verificar si hay permisos existentes en los últimos 3 días hábiles
    const tresDiasExtras = new Date(fecha_permiso);
    tresDiasExtras.setDate(tresDiasExtras.getDate() + 3);

    const existenPermisosAnteriores = await DetallePermisosEmpleado.findOne({
      where: {
        fk_cat_empleado: id_cat_empleado,
        estatus: 1,
        fecha_permiso: {
          [Op.gte]: tresDiasAntes,
          [Op.lte]: tresDiasExtras,
        },
      },
    });

    if (existenPermisosAnteriores) {
      // Hay permisos existentes en los últimos 3 días hábiles
      return res.status(400).json({
        ok: false,
        results: {
          msg: "No se puede completar el permiso. Ya hay permisos en los últimos 3 días hábiles.",
        },
      });
    }

    // CREAMOS UNA NUEVA PERSONA EN LA BASE DE DATOS.
    const detallePermisosEmpleado = await DetallePermisosEmpleado.create({
      fecha_permiso,
      tiempo_horas,
      estatus: 1,
      fk_cat_empleado: id_cat_empleado,
      fk_cat_permiso: id_cat_permiso,
      detalle,
      fecha_solicitada: fecha_solicitada,
      hora_solicitada: hora_solicitada,
    });

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DEL REGISTRO.
    res.status(201).json({
      ok: true,
      results: {
        msg: "Permiso del empleado registrado correctamente",
        detallePermisosEmpleado,
      },
    });
  } catch (error) {
    // MANEJO DE ERRORES, IMPRIMIMOS EL ERROR EN LA CONSOLA Y ENVIAMOS UNA RESPUESTA DE ERROR AL CLIENTE.
    console.log(error);
    res.status(500).json({
      ok: false,
      results: {
        msg: "Ha ocurrido un error, hable con el Administrador.",
      },
    });
  }
};

/**
 * ACTUALIZA LA INFORMACIÓN DE UN CLIENTE EXISTENTE EN LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta y cuerpo.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const permisoPut = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL CLIENTE DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // EXTRAEMOS LOS DATOS DEL CUERPO DE LA SOLICITUD.
    const { estatus, id_cat_permiso, detalle = "" } = req.body;

    // OBTENEMOS EL CLIENTE EXISTENTE Y SUS RELACIONES.
    const detallePermisosEmpleado = await DetallePermisosEmpleado.findByPk(id);

    // SI NO SE ENCUENTRA EL CLIENTE, SE RETORNA UNA RESPUESTA DE ERROR.
    if (!detallePermisosEmpleado) {
      return res.status(404).json({
        ok: false,
        results: {
          msg: "Permiso no encontrado",
        },
      });
    }

    // ACTUALIZAMOS LA INFORMACIÓN DE CLIENTE, PERSONA Y USUARIO.
    detallePermisosEmpleado.estatus = estatus;
    detallePermisosEmpleado.fk_cat_permiso = id_cat_permiso;
    detallePermisosEmpleado.detalle = detalle;

    // GUARDAMOS LOS CAMBIOS EN LA BASE DE DATOS.
    await detallePermisosEmpleado.save();

    // RETORNAMOS UNA RESPUESTA INDICANDO EL ÉXITO DE LA ACTUALIZACIÓN.
    res.status(200).json({
      ok: true,
      msg: "Permiso del empleado actualizado correctamente",
      results: detallePermisosEmpleado,
    });
  } catch (error) {
    // MANEJO DE ERRORES, IMPRIMIMOS EL ERROR EN LA CONSOLA Y ENVIAMOS UNA RESPUESTA DE ERROR AL CLIENTE.
    console.log(error);
    res.status(500).json({
      ok: false,
      results: {
        msg: "Ha ocurrido un error, hable con el Administrador.",
      },
    });
  }
};

// EXPORTA LOS MÉTODOS PARA SER UTILIZADOS EN OTROS ARCHIVOS.
module.exports = {
  permisoGet,
  permisoIdGet,
  permisosGet,
  permisosIdGet,
  permisoPost,
  permisoPut,
};
