const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/modelos/usuario");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(400).json({
      ok: false,
      results: {
        msg: "No hay token en la peticion",
      },
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    //leer el usuario que corresponde al uid
    const usuario = await Usuario.findByPk(uid);

    if (!usuario) {
      console.log("Token no valido - usuario no existe DB");
      return res.status(401).json({
        ok: false,
        results: {
          msg: "Token no valido",
        },
      });
    }

    //Verificar si el uid tiene estado en true
    if (usuario.estatus !== 1) {
      console.log("Token no valido - estatus del usuario no activo");
      return res.status(401).json({
        ok: false,
        results: {
          msg: "Token no valido - usuario con estatus:false",
        },
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    //console.log(error);
    res.status(401).json({
      ok: false,
      results: {
        msg: "Token no valido",
      },
    });
  }
};

module.exports = {
  validarJWT,
};
