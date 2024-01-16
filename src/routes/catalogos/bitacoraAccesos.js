// IMPORTACIÓN DE LAS BIBLIOTECAS NECESARIAS
const { Router } = require("express");
const { check } = require("express-validator");

// IMPORTACIONES DE MIDDLEWARES Y DE CONTROLADORES
const { validarCampos } = require("../../middlewares/validar-campos");

// IMPORTACIÓN DE LOS CONTROLADORES RELACIONADOS CON LA BITÁCORA DE ACCESOS
const {
  bitacoraAccesoGet,
  bitacoraAccesosPost,
} = require("../../controllers/catalogos/bitacoraAccesos-controller");
const { existeEmpleadoPorId } = require("../../helpers/db-validators");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER DATOS DE LA BITÁCORA DE ACCESO
router.post("/datos", bitacoraAccesoGet);

// DEFINICIÓN DE RUTA PARA AGREGAR DATOS A LA BITÁCORA DE ACCESO
router.post(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    check("fecha_inicio", "La fecha_inicio es obligatoria").not().isEmpty(),
    check("hora", "La hora es obligatoria").not().isEmpty(),
    check("plataforma_web", "La plataforma_web debe ser un numero entre 0 y 1")
      .isNumeric()
      .isInt({ min: 0, max: 1 }),
    check(
      "plataforma_movil",
      "La plataforma_movil debe ser un numero entre 0 y 1"
    )
      .isNumeric()
      .isInt({ min: 0, max: 1 }),
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    check("direccion_ip", "La direccion_ip es obligatoria").not().isEmpty(),
    check("fk_cat_empleado", "El fk_cat_empleado es obligatoria").isNumeric(),
    check("fk_cat_empleado").custom(existeEmpleadoPorId),
    // MIDDLEWARE PARA VALIDAR CAMPOS
    validarCampos,
  ],
  bitacoraAccesosPost
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
