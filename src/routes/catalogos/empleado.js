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
const {
  existePuestoTrabajoPorId,
  existeVacacionPorId,
  existeToleranciaPorId,
  alMenosUnRol,
  existeEmpleadoPorId,
  existenRolesPorId,
  emailExiste,
  emailInexiste,
} = require("../../helpers/db-validators");
const { esAdminRole, tieneRole } = require("../../middlewares/validar-roles");
const { validarJWT } = require("../../middlewares/validar-jwt");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS EMPLEADOS
router.get(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    //tieneRole("FROND END", "BACK END"),
    esAdminRole,
    validarCampos,
  ],
  empleadosGet
);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO EMPLEADO
router.post(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    //tieneRole("FROND END", "BACK END"),
    esAdminRole,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido_Paterno", "El apellido paterno es obligatorio")
      .not()
      .isEmpty(),
    check("direccion", "La direccion es obligatoria").not().isEmpty(),
    check("sueldo", "El sueldo debe ser un numero").isNumeric(),
    check(
      "fecha_nacimiento",
      "Formato de fecha incorrecto en fecha_nacimiento"
    ).custom((value) => {
      return /\d{4}-\d{2}-\d{2}/.test(value);
    }),
    check(
      "fecha_contratacion",
      "Formato de fecha incorrecto en fecha_contratacion"
    ).custom((value) => {
      return /\d{4}-\d{2}-\d{2}/.test(value);
    }),
    check("fk_cat_puesto_trabajo").custom(existePuestoTrabajoPorId),
    check("fk_cat_vacaciones").custom(existeVacacionPorId),
    check("fk_cat_tolerancia").custom(existeToleranciaPorId),
    check("correo", "El correo no es válido").isEmail(),
    check("correo").custom(emailExiste),
    check("roles").custom(existenRolesPorId),
    check("contrasenia", "El password debe de ser más de 6 letras").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  empleadoPost
);

// DEFINICIÓN DE RUTA PARA OBTENER UN EMPLEADO POR ID
router.get(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    //tieneRole("FROND END", "BACK END"),
    esAdminRole,
    check("id").custom(existeEmpleadoPorId),
    validarCampos,
  ],
  empleadoIdGet
);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR UN EMPLEADO POR ID
router.put(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    //tieneRole("FROND END", "BACK END"),
    esAdminRole,
    check("id").custom(existeEmpleadoPorId),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido_Paterno", "El apellido paterno es obligatorio")
      .not()
      .isEmpty(),
    check("direccion", "La direccion es obligatoria").not().isEmpty(),
    check("sueldo", "El sueldo debe ser un numero").isNumeric(),
    check(
      "fecha_nacimiento",
      "Formato de fecha incorrecto en fecha_nacimiento"
    ).custom((value) => {
      return /\d{4}-\d{2}-\d{2}/.test(value);
    }),
    check(
      "fecha_contratacion",
      "Formato de fecha incorrecto en fecha_contratacion"
    ).custom((value) => {
      return /\d{4}-\d{2}-\d{2}/.test(value);
    }),
    check("fk_cat_puesto_trabajo").custom(existePuestoTrabajoPorId),
    check("fk_cat_vacaciones").custom(existeVacacionPorId),
    check("fk_cat_tolerancia").custom(existeToleranciaPorId),
    check("correo", "El correo no es válido").isEmail(),
    check("correo").custom((correo, { req }) => {
      const id = req.params.id; // Obtén el ID de los parámetros de la ruta
      return emailInexiste(correo, id);
    }),
    check("contrasenia", "El password debe de ser más de 6 letras").isLength({
      min: 6,
    }),
    check("roles").custom(existenRolesPorId),
    validarCampos,
  ],
  empleadoPut
);

// DEFINICIÓN DE RUTA PARA ELIMINAR UN EMPLEADO POR ID
router.delete(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    //tieneRole("FROND END", "BACK END"),
    esAdminRole,
    check("id").custom(existeEmpleadoPorId),
    validarCampos,
  ],
  empleadoDelete
);

// DEFINICIÓN DE RUTA PARA ACTIVAR UN EMPLEADO POR ID
router.put(
  "/activar/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    //tieneRole("FROND END", "BACK END"),
    esAdminRole,
    check("id").custom(existeEmpleadoPorId),
    validarCampos,
  ],
  empleadoActivarPut
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
