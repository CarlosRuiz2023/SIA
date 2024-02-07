// IMPORTACIÓN DE LAS BIBLIOTECAS NECESARIAS
const { Router } = require("express");
const { check } = require("express-validator");

// IMPORTACIÓN DE LOS CONTROLADORES Y MIDDLEWARES NECESARIOS
const { validarCampos } = require("../../middlewares/validar-campos");
const {
  ausenciasGet,
  ausenciasPut,
  ausenciasPost,
  ausenciaIdGet,
  ausenciasIdGet,
} = require("../../controllers/catalogos/ausencias-controller");
const {
  existeAusenciaPorId,
  existeEmpleadoPorId,
  existePermisoPorId,
} = require("../../helpers/db-validators");
const { tienePermiso } = require("../../middlewares/validar-roles");
const { validarJWT } = require("../../middlewares/validar-jwt");

// CREACIÓN DEL ENRUTADOR
const router = Router();

const sub_modulo = "Ausencias";

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS CLIENTES
router.get(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    validarCampos,
  ],
  ausenciasGet
);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO CLIENTE
router.post(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Escribir", sub_modulo),
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    check("fecha", "Formato de fecha incorrecto").custom((value) => {
      return /\d{4}-\d{2}-\d{2}/.test(value);
    }),
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    check("id_empleado").custom(existeEmpleadoPorId),
    check("id_permiso").custom(existePermisoPorId),
    validarCampos,
  ],
  ausenciasPost
);

// DEFINICIÓN DE RUTA PARA OBTENER UN CLIENTE POR ID
router.get(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    check("id").custom(existeAusenciaPorId),
    validarCampos,
  ],
  ausenciaIdGet
);

// DEFINICIÓN DE RUTA PARA OBTENER UN CLIENTE POR ID
router.get(
  "/empleado/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    check("id").custom(existeEmpleadoPorId),
    validarCampos,
  ],
  ausenciasIdGet
);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR UN CLIENTE POR ID
router.put(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Modificar", sub_modulo),
    check("id").custom(existeAusenciaPorId),
    check("fecha", "Formato de fecha incorrecto").custom((value) => {
      return /\d{4}-\d{2}-\d{2}/.test(value);
    }),
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    check("id_empleado").custom(existeEmpleadoPorId),
    check("id_permiso").custom(existePermisoPorId),
    check("estatus", "El estatus debe ser un numero entre 0 y 1")
      .isNumeric()
      .isInt({ min: 0, max: 1 }),
    validarCampos,
  ],
  ausenciasPut
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
