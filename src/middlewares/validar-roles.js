const { response } = require("express");
const DetalleUsuarioRol = require("../models/modelos/detalles/detalle_usuario_rol");
const Roles = require("../models/modelos/catalogos/roles");

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

module.exports = {
  esAdminRole,
  tieneRole,
};
