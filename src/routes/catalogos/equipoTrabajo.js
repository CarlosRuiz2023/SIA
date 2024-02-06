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
const { esAdminRole, tieneRole } = require("../../middlewares/validar-roles");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS CLIENTES
router.get(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    //tieneRole("FROND END", "BACK END"),
    esAdminRole,
    validarCampos,
  ],
  equipoTrabajoGet
);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO CLIENTE
router.post(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    //tieneRole("FROND END", "BACK END"),
    esAdminRole,
    check("equipo_trabajo", "El Equipo Trabajo es obligatorio").not().isEmpty(),
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  equipoTrabajoPost
);

// DEFINICIÓN DE RUTA PARA OBTENER UN CLIENTE POR ID
router.get(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    //tieneRole("FROND END", "BACK END"),
    esAdminRole,
    check("id").custom(existeEquipoTrabajoPorId),
    validarCampos,
  ],
  equipoTrabajoIdGet
);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR UN CLIENTE POR ID
router.put(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    //tieneRole("FROND END", "BACK END"),
    esAdminRole,
    check("equipo_trabajo", "El Equipo Trabajo es obligatorio").not().isEmpty(),
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    check("empleados").custom(existenEmpleadosPorId),
    validarCampos,
  ],
  equipoTrabajoPut
);

// DEFINICIÓN DE RUTA PARA ELIMINAR UN CLIENTE POR ID
router.delete(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    //tieneRole("FROND END", "BACK END"),
    esAdminRole,
    check("id").custom(existeEquipoTrabajoPorId),
    validarCampos,
  ],
  equipoTrabajoDelete
);

// DEFINICIÓN DE RUTA PARA ACTIVAR UN CLIENTE POR ID
router.put(
  "/activar/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    //tieneRole("FROND END", "BACK END"),
    esAdminRole,
    check("id").custom(existeEquipoTrabajoPorId),
    validarCampos,
  ],
  equipoTrabajoActivarPut
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
