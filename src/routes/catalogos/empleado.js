// IMPORTACIÓN DE LAS BIBLIOTECAS NECESARIAS
const { Router } = require("express");
const { check } = require("express-validator");

// IMPORTACIÓN DE LOS CONTROLADORES Y MIDDLEWARES NECESARIOS
const { validarCampos } = require("../../middlewares/validar-campos");
const {
  empleadosGet,
  empleadoPost,
  empleadoIdGet,
  empleadoPut,
  empleadoDelete,
  empleadoActivarPut,
  reporteGeneralPost,
} = require("../../controllers/catalogos/empleado-controller");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS EMPLEADOS
router.get("/", empleadosGet);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO EMPLEADO
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("contrasenia", "El password debe de ser más de 6 letras").isLength({
      min: 6,
    }),
    check("correo", "El correo no es válido").isEmail(),
    validarCampos,
  ],
  empleadoPost
);

// DEFINICIÓN DE RUTA PARA OBTENER UN EMPLEADO POR ID
router.get(
  "/:id",
  [check("id", "El id es obligatorio").not().isEmpty()],
  empleadoIdGet
);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR UN EMPLEADO POR ID
router.put(
  "/:id",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("contrasenia", "El password debe de ser más de 6 letras").isLength({
      min: 6,
    }),
    check("correo", "El correo no es válido").isEmail(),
    validarCampos,
  ],
  empleadoPut
);

// DEFINICIÓN DE RUTA PARA ELIMINAR UN EMPLEADO POR ID
router.delete(
  "/:id",
  [check("id", "El id es obligatorio").not().isEmpty()],
  empleadoDelete
);

// DEFINICIÓN DE RUTA PARA ACTIVAR UN EMPLEADO POR ID
router.put(
  "/activar/:id",
  [check("id", "El id es obligatorio").not().isEmpty()],
  empleadoActivarPut
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
