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

// DEFINICIÓN DE RUTA PARA OBTENER TODAS LAS AUSENCIAS
router.get(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE ACCESO AL SERVICIO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    validarCampos,
  ],
  ausenciasGet
);

// DEFINICIÓN DE RUTA PARA AGREGAR UNA AUSENCIA
router.post(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UNA AUSENCIA
    validarJWT,
    tienePermiso("Escribir", sub_modulo),
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

// DEFINICIÓN DE RUTA PARA OBTENER UNA AUSENCIA POR ID
router.get(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    check("id").custom(existeAusenciaPorId),
    validarCampos,
  ],
  ausenciaIdGet
);

// DEFINICIÓN DE RUTA PARA OBTENER AUSENCIAS POR EMPLEADO
router.get(
  "/empleado/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    check("id").custom(existeEmpleadoPorId),
    validarCampos,
  ],
  ausenciasIdGet
);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR UNA AUSENCIA POR ID
router.put(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE ACTUALIZAR UNA AUSENCIA
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
