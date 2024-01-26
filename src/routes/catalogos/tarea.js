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

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO CLIENTE
router.post(
  "/",
  [
    check("id_actividad").custom(existeActividadPorId),
    check("tarea", "La descripcion es obligatoria").not().isEmpty(),
    check("duracion", "Formato de hora incorrecto").custom((value) => {
      return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(value);
    }),
    validarCampos,
  ],
  tareasPost
);

// DEFINICIÓN DE RUTA PARA OBTENER UN CLIENTE POR ID
router.get(
  "/:id",
  [check("id").custom(existeActividadPorId), validarCampos],
  tareasIdGet
);

// DEFINICIÓN DE RUTA PARA OBTENER UN CLIENTE POR ID
router.get(
  "/faltantes/:id",
  [check("id").custom(existeActividadPorId), validarCampos],
  tareasFaltantesIdGet
);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR UN CLIENTE POR ID
router.put(
  "/:id",
  [
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

// DEFINICIÓN DE RUTA PARA ELIMINAR UN CLIENTE POR ID
router.delete(
  "/:id",
  [check("id").custom(existeTareaPorId), validarCampos],
  tareaDelete
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
