// IMPORTACIÓN DE LAS BIBLIOTECAS NECESARIAS
const { Router } = require("express");
const { check } = require("express-validator");

// IMPORTACIÓN DE LOS CONTROLADORES Y MIDDLEWARES NECESARIOS
const { validarCampos } = require("../../middlewares/validar-campos");
const {
  equipoTrabajoGet,
  equipoTrabajoPost,
  equipoTrabajoIdGet,
  equipoTrabajoPut,
  equipoTrabajoDelete,
  equipoTrabajoActivarPut,
} = require("../../controllers/catalogos/equipoTrabajo-controller");
const {
  existeEquipoTrabajoPorId,
  existenEmpleadosPorId,
} = require("../../helpers/db-validators");
const { validarJWT } = require("../../middlewares/validar-jwt");
const { tienePermiso } = require("../../middlewares/validar-roles");

// CREACIÓN DEL ENRUTADOR
const router = Router();

const sub_modulo = "Equipos de trabajo";

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS EQUIPOS DE TRABAJO
router.get(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE OBTENER EQUIPOS DE TRABAJO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    validarCampos,
  ],
  equipoTrabajoGet
);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO EQUIPO DE TRABAJO
router.post(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN EQUIPO DE TRABAJO
    validarJWT,
    tienePermiso("Escribir", sub_modulo),
    check("equipo_trabajo", "El Equipo Trabajo es obligatorio").not().isEmpty(),
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  equipoTrabajoPost
);

// DEFINICIÓN DE RUTA PARA OBTENER UN EQUIPO DE TRABAJO POR ID
router.get(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    check("id").custom(existeEquipoTrabajoPorId),
    validarCampos,
  ],
  equipoTrabajoIdGet
);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR UN EQUIPO DE TRABAJO POR ID
router.put(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE ACTUALIZAR UN EQUIPO DE TRABAJO
    validarJWT,
    tienePermiso("Modificar", sub_modulo),
    check("equipo_trabajo", "El Equipo Trabajo es obligatorio").not().isEmpty(),
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    check("empleados").custom(existenEmpleadosPorId),
    validarCampos,
  ],
  equipoTrabajoPut
);

// DEFINICIÓN DE RUTA PARA ELIMINAR UN EQUIPO DE TRABAJO POR ID
router.delete(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE ELIMINAR UN EQUIPO DE TRABAJO
    validarJWT,
    tienePermiso("Eliminar", sub_modulo),
    check("id").custom(existeEquipoTrabajoPorId),
    validarCampos,
  ],
  equipoTrabajoDelete
);

// DEFINICIÓN DE RUTA PARA ACTIVAR UN EQUIPO DE TRABAJO POR ID
router.put(
  "/activar/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE ACTIVAR UN EQUIPO DE TRABAJO
    validarJWT,
    tienePermiso("Modificar", sub_modulo),
    check("id").custom(existeEquipoTrabajoPorId),
    validarCampos,
  ],
  equipoTrabajoActivarPut
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
