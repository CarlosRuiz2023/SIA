// IMPORTACIÓN DE LAS BIBLIOTECAS NECESARIAS
const { Router } = require("express");
const { check } = require("express-validator");

// IMPORTACIÓN DE LOS CONTROLADORES Y MIDDLEWARES NECESARIOS
const { validarCampos } = require("../../middlewares/validar-campos");
const {
  proyectosGet,
  proyectosPost,
  proyectoIdGet,
  proyectoPut,
  proyectoDelete,
} = require("../../controllers/catalogos/proyectos-controller");
const { existeProyectoPorId } = require("../../helpers/db-validators");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS CLIENTES
router.get("/", proyectosGet);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO CLIENTE
router.post(
  "/",
  [
    check("proyecto_nombre", "El proyecto_nombre es obligatorio")
      .not()
      .isEmpty(),
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    check("fecha_inicio", "Formato de fecha_inicio incorrecto").custom(
      (value) => {
        return /\d{4}-\d{2}-\d{2}/.test(value);
      }
    ),
    check("fecha_fin", "Formato de fecha_fin incorrecto").custom((value) => {
      return /\d{4}-\d{2}-\d{2}/.test(value);
    }),
    check(
      "horas_maximas",
      "Las horas_maximas deben de ser un numero."
    ).isNumeric(),
    validarCampos,
  ],
  proyectosPost
);

// DEFINICIÓN DE RUTA PARA OBTENER UN CLIENTE POR ID
router.get(
  "/:id",
  [check("id").custom(existeProyectoPorId), validarCampos],
  proyectoIdGet
);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR UN CLIENTE POR ID
router.put(
  "/:id",
  [
    check("id").custom(existeProyectoPorId),
    check("proyecto_nombre", "El proyecto_nombre es obligatorio")
      .not()
      .isEmpty(),
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    check("fecha_inicio", "Formato de fecha_inicio incorrecto").custom(
      (value) => {
        return /\d{4}-\d{2}-\d{2}/.test(value);
      }
    ),
    check("fecha_fin", "Formato de fecha_fin incorrecto").custom((value) => {
      return /\d{4}-\d{2}-\d{2}/.test(value);
    }),
    check(
      "horas_maximas",
      "Las horas_maximas deben de ser un numero."
    ).isNumeric(),
    validarCampos,
  ],
  proyectoPut
);

// DEFINICIÓN DE RUTA PARA ELIMINAR UN CLIENTE POR ID
router.delete(
  "/:id",
  [check("id").custom(existeProyectoPorId), validarCampos],
  proyectoDelete
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
