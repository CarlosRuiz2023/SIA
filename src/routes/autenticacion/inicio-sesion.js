// IMPORTACIÓN DE LAS BIBLIOTECAS NECESARIAS
const { Router } = require("express");
const { check } = require("express-validator");

// IMPORTACIONES DE MIDDLEWARES Y DE CONTROLADORES
const { validarCampos } = require("../../middlewares/validar-campos");
const {
  inicioSesion,
  recuperarContrasenia,
  cambiarContrasenia,
  bloquearUsuario,
  usuarioActivar,
  cerrarSesion,
} = require("../../controllers/autentificacion/inicio-sesion-controller");
const {
  emailExistente,
  usuarioActivo,
} = require("../../helpers/db-validators");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA INICIAR SESIÓN
router.post(
  "/inicioSesion",
  [
    // VALIDACIONES PARA LOS DATOS DE INICIO DE SESIÓN
    check("correo", "El correo es obligatorio").isEmail(),
    check("correo").custom(emailExistente),
    check("correo").custom(usuarioActivo),
    check("contrasenia", "La contraseña es obligatoria").not().isEmpty(),
    // MIDDLEWARE PARA VALIDAR CAMPOS
    validarCampos,
  ],
  inicioSesion
);

// DEFINICIÓN DE RUTA PARA RECUPERAR CONTRASEÑA
router.post(
  "/recuperarContrasenia",
  [
    // VALIDACIONES PARA LOS DATOS DE INICIO DE SESIÓN
    check("correo", "El correo es obligatorio").isEmail(),
    check("correo").custom(emailExistente),
    // MIDDLEWARE PARA VALIDAR CAMPOS
    validarCampos,
  ],
  recuperarContrasenia
);

// DEFINICIÓN DE RUTA PARA BLOQUEAR AL USUARIO
router.post(
  "/bloquearUsuario",
  [
    // VALIDACIONES PARA LOS DATOS DE INICIO DE SESIÓN
    check("correo", "El correo es obligatorio").isEmail(),
    check("correo").custom(emailExistente),
    // MIDDLEWARE PARA VALIDAR CAMPOS
    validarCampos,
  ],
  bloquearUsuario
);

// DEFINICIÓN DE RUTA PARA ACTIVAR USUARIO
router.post(
  "/activarUsuario",
  [
    // VALIDACIONES PARA LOS DATOS DE INICIO DE SESIÓN
    check("correo", "El correo es obligatorio").isEmail(),
    check("correo").custom(emailExistente),
    // MIDDLEWARE PARA VALIDAR CAMPOS
    validarCampos,
  ],
  usuarioActivar
);

router.get(
  "/cambiarContrasenia/:correo",
  [
    check("correo", "El id es obligatorio").not().isEmpty(),
    check("correo").custom(emailExistente),
    check("password", "El password debe de ser más de 6 letras").isLength({
      min: 6,
    }),
    check(
      "passwordConfirm",
      "El password debe de ser más de 6 letras"
    ).isLength({ min: 6 }),
    validarCampos,
  ],
  cambiarContrasenia
);

// DEFINICIÓN DE RUTA PARA CERRAR SESIÓN
router.post(
  "/cerrarSesion",
  [
    // VALIDACIONES PARA LOS DATOS DE CERRAR DE SESIÓN
    check("correo", "El correo es obligatorio").isEmail(),
    check("correo").custom(emailExistente),
    // MIDDLEWARE PARA VALIDAR CAMPOS
    validarCampos,
  ],
  cerrarSesion
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
