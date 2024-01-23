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
const { existeEquipoTrabajoPorId } = require("../../helpers/db-validators");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS CLIENTES
router.get("/", equipoTrabajoGet);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO CLIENTE
router.post(
  "/",
  /* [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido_Paterno", "El apellido paterno es obligatorio")
      .not()
      .isEmpty(),
    check("apellido_Materno", "El apellido materno es obligatorio")
      .not()
      .isEmpty(),
    check("direccion", "La direccion es obligatoria").not().isEmpty(),
    check("empresa", "La empresa es obligatoria").not().isEmpty(),
    check("correo", "El correo no es válido").isEmail(),
    check("contrasenia", "El password debe de ser más de 6 letras").isLength({
      min: 6,
    }),
    validarCampos,
  ], */
  equipoTrabajoPost
);

// DEFINICIÓN DE RUTA PARA OBTENER UN CLIENTE POR ID
router.get(
  "/:id",
  [check("id").custom(existeEquipoTrabajoPorId), validarCampos],
  equipoTrabajoIdGet
);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR UN CLIENTE POR ID
router.put(
  "/:id",
  /* [
    check("id").custom(existeClientePorId),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido_Paterno", "El apellido paterno es obligatorio")
      .not()
      .isEmpty(),
    check("apellido_Materno", "El apellido materno es obligatorio")
      .not()
      .isEmpty(),
    check("direccion", "La direccion es obligatoria").not().isEmpty(),
    check("empresa", "La empresa es obligatoria").not().isEmpty(),
    check("correo", "El correo no es válido").isEmail(),
    validarCampos,
  ], */
  equipoTrabajoPut
);

// DEFINICIÓN DE RUTA PARA ELIMINAR UN CLIENTE POR ID
router.delete(
  "/:id",
  [check("id").custom(existeEquipoTrabajoPorId), validarCampos],
  equipoTrabajoDelete
);

// DEFINICIÓN DE RUTA PARA ACTIVAR UN CLIENTE POR ID
router.put(
  "/activar/:id",
  [check("id").custom(existeEquipoTrabajoPorId), validarCampos],
  equipoTrabajoActivarPut
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
