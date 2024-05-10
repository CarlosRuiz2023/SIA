const { response } = require("express");
// IMPORTACIÓN DEL OPERADOR 'Op' DE SEQUELIZE PARA REALIZAR OPERACIONES COMPLEJAS.
const { Op } = require("sequelize");

const DetalleUsuarioRol = require("../models/modelos/detalles/detalle_usuario_rol");
const Roles = require("../models/modelos/catalogos/roles");
const DetalleRolSubModulo = require("../models/modelos/detalles/detalle_rol_sub_modulo");
const Permiso = require("../models/modelos/catalogos/permiso");
const SubModulo = require("../models/modelos/catalogos/subModulos");

const esAdminRole = async (req, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: "Se quiere verificar el role sin validar el token primero ",
    });
  }

  //leer el usuario que corresponde al uid
  const { id_cat_usuario } = req.usuario;
  const detalleUsuarioRol = await DetalleUsuarioRol.findAll({
    include: [{ model: Roles, as: "cat_role" }],
    where: { fk_cat_usuario: id_cat_usuario },
  });

  //console.log(detalleUsuarioRol[0].cat_role.rol);

  let validador = false;

  // Itera sobre los resultados y suma los valores
  detalleUsuarioRol.forEach((rol) => {
    if (rol.cat_role.rol.includes("ADMINISTRADOR")) {
      validador = true;
    }
  });

  if (!validador) {
    return res.status(401).json({
      msg: `El usuario no es administrador - No puede hacer esto`,
    });
  }

  next();
};

const tieneRole = (...roles) => {
  return async (req, res = response, next) => {
    if (!req.usuario) {
      return res.status(500).json({
        msg: "Se quiere verificar el role sin validar el token primero ",
      });
    }

    //leer el usuario que corresponde al uid
    const { id_cat_usuario } = req.usuario;
    const detalleUsuarioRol = await DetalleUsuarioRol.findAll({
      include: [{ model: Roles, as: "cat_role" }],
      where: { fk_cat_usuario: id_cat_usuario },
    });

    //console.log(detalleUsuarioRol[0].cat_role.rol);

    let validador = false;

    // Itera sobre los resultados y suma los valores
    detalleUsuarioRol.forEach((rol) => {
      if (roles.includes(rol.cat_role.rol)) {
        validador = true;
      }
    });

    if (!validador) {
      return res.status(401).json({
        msg: `El servicio requiere uno de estos roles ${roles}`,
      });
    }
    next();
  };
};

const tienePermiso = (permiso, sub_modulo) => {
  return async (req, res = response, next) => {
    if (!req.usuario) {
      return res.status(500).json({
        msg: "Se quiere verificar el role sin validar el token primero ",
      });
    }

    //leer el usuario que corresponde al uid
    const { id_cat_usuario } = req.usuario;
    const detalleUsuarioRol = await DetalleUsuarioRol.findAll({
      include: [{ model: Roles, as: "cat_role" }],
      where: { fk_cat_usuario: id_cat_usuario },
    });

    // Crear un array para almacenar los IDs de los roles
    const roles = detalleUsuarioRol.map((rol) => rol.cat_role.id_cat_rol);
    const detalleRolSubModulo = await DetalleRolSubModulo.findOne({
      include: [
        { model: Permiso, as: "cat_permiso", where: { permiso } },
        { model: SubModulo, as: "cat_sub_modulo", where: { sub_modulo } },
      ],
      where: {
        fk_cat_rol: {
          [Op.in]: roles,
        },
        estatus: 1,
      },
    });

    if (!detalleRolSubModulo) {
      return res.status(401).json({
        msg: `El usuario no tiene permiso de ${permiso} para el sub_modulo ${sub_modulo}`,
      });
    }
    next();
  };
};

module.exports = {
  esAdminRole,
  tieneRole,
  tienePermiso,
};
