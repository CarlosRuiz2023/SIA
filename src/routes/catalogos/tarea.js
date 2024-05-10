// IMPORTACIÓN DE LAS BIBLIOTECAS NECESARIAS
const { Router } = require("express");
const { check } = require("express-validator");

// IMPORTACIÓN DE LOS CONTROLADORES Y MIDDLEWARES NECESARIOS
const { validarCampos } = require("../../middlewares/validar-campos");
const {
  tareasPost,
  tareasIdGet,
  tareaPut,
  tareaDelete,
  tareasFaltantesIdGet,
} = require("../../controllers/catalogos/tarea-controller");
const {
  existeTareaPorId,
  existeActividadPorId,
  existeEmpleadoPorId,
} = require("../../helpers/db-validators");
const { validarJWT } = require("../../middlewares/validar-jwt");
const { tienePermiso } = require("../../middlewares/validar-roles");

// CREACIÓN DEL ENRUTADOR
const router = Router();

const sub_modulo = "Reportes de actividades";

// DEFINICIÓN DE RUTA PARA AGREGAR UNA NUEVA TAREA
router.post(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UNA TAREA
    validarJWT,
    tienePermiso("Escribir", sub_modulo),
    check("id_actividad").custom(existeActividadPorId),
    check("tarea", "La descripcion es obligatoria").not().isEmpty(),
    check("duracion", "Formato de hora incorrecto").custom((value) => {
      return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(value);
    }),
    validarCampos,
  ],
  tareasPost
);

// DEFINICIÓN DE RUTA PARA OBTENER UNA TAREA POR ID
router.get(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    check("id").custom(existeActividadPorId),
    validarCampos,
  ],
  tareasIdGet
);

// DEFINICIÓN DE RUTA PARA OBTENER UNA TAREA POR ID
router.get(
  "/faltantes/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    check("id").custom(existeActividadPorId),
    validarCampos,
  ],
  tareasFaltantesIdGet
);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR UNA TAREA POR ID
router.put(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE ACTUALIZAR UNA TAREA
    validarJWT,
    tienePermiso("Modificar", sub_modulo),
    check("id_actividad").custom(existeActividadPorId),
    check("id_empleado").custom(existeEmpleadoPorId),
    check("tarea", "La descripcion es obligatoria").not().isEmpty(),
    check("duracion", "Formato de hora incorrecto").custom((value) => {
      return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(value);
    }),
    check("estatus", "El estatus debe ser un numero entre 1 y 2")
      .isNumeric()
      .isInt({ min: 1, max: 2 }),
    validarCampos,
  ],
  tareaPut
);

// DEFINICIÓN DE RUTA PARA ELIMINAR UNA TAREA POR ID
router.delete(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE ELIMINAR UNA TAREA
    validarJWT,
    tienePermiso("Eliminar", sub_modulo),
    check("id").custom(existeTareaPorId),
    validarCampos,
  ],
  tareaDelete
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
