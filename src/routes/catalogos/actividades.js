// IMPORTACIÓN DE LAS BIBLIOTECAS NECESARIAS
const { Router } = require("express");
const { check } = require("express-validator");

// IMPORTACIÓN DE LOS CONTROLADORES Y MIDDLEWARES NECESARIOS
const { validarCampos } = require("../../middlewares/validar-campos");
const {
  actividadesGet,
  actividadesPost,
  actividadIdGet,
  actividadPut,
  actividadDelete,
  reporteActividadesPost,
  reporteActividadesPdfPost,
} = require("../../controllers/catalogos/actividades-controller");
const {
  existeActividadPorId,
  existeEquipoTrabajoPorId,
} = require("../../helpers/db-validators");
const { tienePermiso } = require("../../middlewares/validar-roles");
const { validarJWT } = require("../../middlewares/validar-jwt");

// CREACIÓN DEL ENRUTADOR
const router = Router();
const sub_modulo = "Reportes de actividades";

// DEFINICIÓN DE RUTA PARA OBTENER TODAS LAS ACTIVIDADES
router.get(
  "/",
  [
    // VALIDACIONES PARA OBTENER ACTIVIDADES
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    validarCampos,
  ],
  actividadesGet
);

// DEFINICIÓN DE RUTA PARA AGREGAR UNA NUEVA ACTIVIDAD
router.post(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UNA ACTIVIDAD
    validarJWT,
    tienePermiso("Escribir", sub_modulo),
    check("actividad_nombre", "La actividad_nombre es obligatoria")
      .not()
      .isEmpty(),
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    check("equipo_trabajo").custom(existeEquipoTrabajoPorId),
    validarCampos,
  ],
  actividadesPost
);

// DEFINICIÓN DE RUTA PARA OBTENER UNA ACTIVIDAD POR ID
router.get(
  "/:id",
  [
    // VALIDACIONES PARA OBTENER LA ACTIVIDAD
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    check("id").custom(existeActividadPorId),
    validarCampos,
  ],
  actividadIdGet
);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR UNA ACTIVIDAD POR ID
router.put(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE ACTUALIZAR UNA ACTIVIDAD
    validarJWT,
    tienePermiso("Modificar", sub_modulo),
    check("id").custom(existeActividadPorId),
    check("actividad_nombre", "La actividad_nombre es obligatoria")
      .not()
      .isEmpty(),
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    check("equipo_trabajo").custom(existeEquipoTrabajoPorId),
    validarCampos,
  ],
  actividadPut
);

// DEFINICIÓN DE RUTA PARA ELIMINAR UNA ACTIVIDAD POR ID
router.delete(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE ELIMINAR UNA ACTIVIDAD
    validarJWT,
    tienePermiso("Eliminar", sub_modulo),
    check("id").custom(existeActividadPorId),
    validarCampos,
  ],
  actividadDelete
);

// DEFINICIÓN DE RUTA PARA GENERAR REPORTE DE ACTIVIDADES HTML
router.post(
  "/reporte/",
  [
    // VALIDACIONES PARA LOS DATOS
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    check("fecha_inicio", "Formato de fecha_inicio incorrecto").custom(
      (value) => {
        return /\d{4}-\d{2}-\d{2}/.test(value);
      }
    ),
    check("fecha_fin", "Formato de fecha_fin incorrecto").custom((value) => {
      return /\d{4}-\d{2}-\d{2}/.test(value);
    }),
    check("id", "El tipo debe ser un numero").isNumeric(),
    check("tipo", "El tipo debe ser un numero entre 1 y 3")
      .isNumeric()
      .isInt({ min: 1, max: 3 }),
    validarCampos,
  ],
  reporteActividadesPost
);

// DEFINICIÓN DE RUTA PARA GENERAR UN REPORTE DE ACTIVIDADES PDF
router.post(
  "/reportePdf/",
  [
    // VALIDACIONES PARA LOS DATOS
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    check("fecha_inicio", "Formato de fecha_inicio incorrecto").custom(
      (value) => {
        return /\d{4}-\d{2}-\d{2}/.test(value);
      }
    ),
    check("fecha_fin", "Formato de fecha_fin incorrecto").custom((value) => {
      return /\d{4}-\d{2}-\d{2}/.test(value);
    }),
    check("id", "El tipo debe ser un numero").isNumeric(),
    check("tipo", "El tipo debe ser un numero entre 1 y 3")
      .isNumeric()
      .isInt({ min: 1, max: 3 }),
    validarCampos,
  ],
  reporteActividadesPdfPost
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
