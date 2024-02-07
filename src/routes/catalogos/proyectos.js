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
  proyectoEtapaPost,
  proyectoEquipoTrabajoPost,
} = require("../../controllers/catalogos/proyectos-controller");
const {
  existeProyectoPorId,
  existenEquiposTrabajoPorId,
  existenEtapasPorId,
} = require("../../helpers/db-validators");
const { tienePermiso } = require("../../middlewares/validar-roles");
const { validarJWT } = require("../../middlewares/validar-jwt");

// CREACIÓN DEL ENRUTADOR
const router = Router();

const sub_modulo = "Reportes de actividades";

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS CLIENTES
router.get(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    // MIDDLEWARE PARA VALIDAR CAMPOS
    validarCampos,
  ],
  proyectosGet
);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO CLIENTE
router.post(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Escribir", sub_modulo),
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
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    check("id").custom(existeProyectoPorId),
    // MIDDLEWARE PARA VALIDAR CAMPOS
    validarCampos,
  ],
  proyectoIdGet
);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR UN CLIENTE POR ID
router.put(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Modificar", sub_modulo),
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
    // MIDDLEWARE PARA VALIDAR CAMPOS
    validarCampos,
  ],
  proyectoPut
);

// DEFINICIÓN DE RUTA PARA ELIMINAR UN CLIENTE POR ID
router.delete(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Eliminar", sub_modulo),
    check("id").custom(existeProyectoPorId),
    validarCampos,
  ],
  proyectoDelete
);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR UN CLIENTE POR ID
router.post(
  "/equipoTrabajo",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Modificar", sub_modulo),
    check("id_proyecto").custom(existeProyectoPorId),
    check("equipos_trabajo").custom(existenEquiposTrabajoPorId),
    validarCampos,
  ],
  proyectoEquipoTrabajoPost
);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR UN CLIENTE POR ID
router.post(
  "/etapas",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Modificar", sub_modulo),
    check("id_proyecto").custom(existeProyectoPorId),
    check("etapas").custom(existenEtapasPorId),
    validarCampos,
  ],
  proyectoEtapaPost
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
