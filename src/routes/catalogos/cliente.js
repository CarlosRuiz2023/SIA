// IMPORTACIÓN DE LAS BIBLIOTECAS NECESARIAS
const { Router } = require("express");
const { check } = require("express-validator");

// IMPORTACIÓN DE LOS CONTROLADORES Y MIDDLEWARES NECESARIOS
const { validarCampos } = require("../../middlewares/validar-campos");
const {
  clientesGet,
  clientePut,
  clientePost,
  clienteIdGet,
  clienteActivarPut,
  clienteDelete,
} = require("../../controllers/catalogos/cliente-controller");
const {
  existeClientePorId,
  emailExiste,
  emailInexiste,
} = require("../../helpers/db-validators");
const { tienePermiso } = require("../../middlewares/validar-roles");
const { validarJWT } = require("../../middlewares/validar-jwt");

// CREACIÓN DEL ENRUTADOR
const router = Router();
const sub_modulo = "Lista de clientes";

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS CLIENTES
router.get(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    validarCampos,
  ],
  clientesGet
);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO CLIENTE
router.post(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN CLIENTE
    validarJWT,
    tienePermiso("Escribir", sub_modulo),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido_Paterno", "El apellido paterno es obligatorio")
      .not()
      .isEmpty(),
    check("direccion", "La direccion es obligatoria").not().isEmpty(),
    check("empresa", "La empresa es obligatoria").not().isEmpty(),
    check("correo", "El correo no es válido").isEmail(),
    check("correo").custom(emailExiste),
    check("contrasenia", "El password debe de ser más de 6 letras").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  clientePost
);

// DEFINICIÓN DE RUTA PARA OBTENER UN CLIENTE POR ID
router.get(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    check("id").custom(existeClientePorId),
    validarCampos,
  ],
  clienteIdGet
);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR UN CLIENTE POR ID
router.put(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE ACTUALIZAR UN CLIENTE
    validarJWT,
    tienePermiso("Modificar", sub_modulo),
    check("id").custom(existeClientePorId),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido_Paterno", "El apellido paterno es obligatorio")
      .not()
      .isEmpty(),
    check("direccion", "La direccion es obligatoria").not().isEmpty(),
    check("empresa", "La empresa es obligatoria").not().isEmpty(),
    check("correo", "El correo no es válido").isEmail(),
    check("correo").custom((correo, { req }) => {
      const id = req.params.id; // Obtén el ID de los parámetros de la ruta
      return emailInexiste(correo, id);
    }),
    check("contrasenia", "El password debe de ser más de 6 letras").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  clientePut
);

// DEFINICIÓN DE RUTA PARA ELIMINAR UN CLIENTE POR ID
router.delete(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE ELIMINAR CLIENTE
    validarJWT,
    tienePermiso("Eliminar", sub_modulo),
    check("id").custom(existeClientePorId),
    validarCampos,
  ],
  clienteDelete
);

// DEFINICIÓN DE RUTA PARA ACTIVAR UN CLIENTE POR ID
router.put(
  "/activar/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE ACTIVAR UN CLIENTE
    validarJWT,
    tienePermiso("Modificar", sub_modulo),
    check("id").custom(existeClientePorId),
    validarCampos,
  ],
  clienteActivarPut
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
