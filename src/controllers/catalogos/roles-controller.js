// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require("express");
// IMPORTACIÓN DE MODELOS DE BASE DE DATOS.
const Roles = require("../../models/modelos/catalogos/roles");
const Permiso = require("../../models/modelos/catalogos/permiso");
const DetalleRolSubModulo = require("../../models/modelos/detalles/detalle_rol_sub_modulo");

/**
 * OBTIENE TODOS LOS ROLES CON LOS PERMISOS ASOCIADOS.
 * @async
 * @function rolesGet
 * @param {request} req - OBJETO DE SOLICITUD HTTP.
 * @param {response} res - OBJETO DE RESPUESTA HTTP.
 * @returns {Object} RESPUESTA JSON CON LOS ROLES Y PERMISOS OBTENIDOS.
 */
const rolesGet = async (req = request, res = response) => {
  try {
    // OBTENER ROLES CON DETALLES DE PERMISOS
    const roles = await DetalleRolSubModulo.findAll({
      include: [
        {
          model: Roles,
          attributes: ["id_cat_rol"],
        },
      ],
      include: [
        {
          model: Permiso,
          attributes: ["id_cat_permiso", "permiso"],
        },
      ],
    });

    // RESPONDER CON UN OBJETO JSON QUE CONTIENE LOS ROLES Y PERMISOS OBTENIDOS.
    res.status(200).json({
      roles,
    });
  } catch (error) {
    // MANEJO DE ERRORES: IMPRIME EL ERROR EN LA CONSOLA Y RESPONDE CON UN ERROR HTTP 500.
    console.log(error);
    res.status(500).json({
      msg: "HA OCURRIDO UN ERROR, HABLE CON EL ADMINISTRADOR.",
    });
  }
};

/**
 * ACTUALIZA LOS PERMISOS ASOCIADOS A LOS ROLES.
 * @async
 * @function rolesPermisosPut
 * @param {request} req - OBJETO DE SOLICITUD HTTP.
 * @param {response} res - OBJETO DE RESPUESTA HTTP.
 * @returns {Object} RESPUESTA JSON CON EL RESULTADO DE LA ACTUALIZACIÓN.
 */
const rolesPermisosPut = async (req, res) => {
  try {
    // OBTIENE LA INFORMACIÓN DE PERMISOS Y ROLES DEL CUERPO DE LA SOLICITUD.
    const { id_detalle_rol_sub_modulo, estatus } = req.body;

    // Actualizar en la BD
    await DetalleRolSubModulo.update(
      {
        estatus: estatus,
      },
      {
        where: {
          id_detalle_rol_sub_modulo: id_detalle_rol_sub_modulo,
        },
      }
    );

    const detalleRolSubModulo = await DetalleRolSubModulo.findByPk(
      id_detalle_rol_sub_modulo
    );

    // RESPONDE CON UN OBJETO JSON QUE CONTIENE UN MENSAJE Y LOS ROLES ACTUALIZADOS.
    res.json({
      msg: "Permiso actualizado correctamente",
      detalleRolSubModulo: detalleRolSubModulo,
    });
  } catch (error) {
    // MANEJO DE ERRORES: IMPRIME EL ERROR EN LA CONSOLA Y RESPONDE CON UN ERROR HTTP 500.
    console.log(error);
    res.status(500).json({
      msg: "HA OCURRIDO UN ERROR, HABLE CON EL ADMINISTRADOR.",
    });
  }
};

/**
 * OBTIENE TODOS LOS ROLES CON ESTATUS ACTIVO.
 * @async
 * @function rolesTodosGet
 * @param {request} req - OBJETO DE SOLICITUD HTTP.
 * @param {response} res - OBJETO DE RESPUESTA HTTP.
 * @returns {Object} RESPUESTA JSON CON LOS ROLES ACTIVOS OBTENIDOS.
 */
const rolesTodosGet = async (req = request, res = response) => {
  try {
    // DEFINE EL CRITERIO DE BÚSQUEDA PARA ROLES ACTIVOS.
    const query = { estatus: 1 };
    // REALIZA LA CONSULTA A LA BASE DE DATOS PARA OBTENER LOS ROLES ACTIVOS.
    const roles = await Roles.findAll({
      where: query,
    });

    // RESPONDE CON UN OBJETO JSON QUE CONTIENE LOS ROLES ACTIVOS OBTENIDOS.
    res.status(200).json({
      ok: true,
      roles,
    });
  } catch (error) {
    // MANEJO DE ERRORES: IMPRIME EL ERROR EN LA CONSOLA Y RESPONDE CON UN ERROR HTTP 500.
    console.log(error);
    res.status(500).json({
      msg: "HA OCURRIDO UN ERROR, HABLE CON EL ADMINISTRADOR.",
    });
  }
};

// EXPORTA LOS MÉTODOS PARA SER UTILIZADOS EN OTROS ARCHIVOS.
module.exports = {
  rolesGet,
  rolesTodosGet,
  rolesPermisosPut,
};
