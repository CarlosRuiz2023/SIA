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
} = require("../../helpers/db-validators");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS EMPLEADOS
router.get("/", empleadosGet);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO EMPLEADO
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido_Paterno", "El apellido paterno es obligatorio")
      .not()
      .isEmpty(),
    check("apellido_Materno", "El apellido materno es obligatorio")
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
  [check("id").custom(existeEmpleadoPorId), validarCampos],
  empleadoIdGet
);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR UN EMPLEADO POR ID
router.put(
  "/:id",
  [
    check("id").custom(existeEmpleadoPorId),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido_Paterno", "El apellido paterno es obligatorio")
      .not()
      .isEmpty(),
    check("apellido_Materno", "El apellido materno es obligatorio")
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
    check("roles").custom(existenRolesPorId),
    validarCampos,
  ],
  empleadoPut
);

// DEFINICIÓN DE RUTA PARA ELIMINAR UN EMPLEADO POR ID
router.delete(
  "/:id",
  [check("id").custom(existeEmpleadoPorId), validarCampos],
  empleadoDelete
);

// DEFINICIÓN DE RUTA PARA ACTIVAR UN EMPLEADO POR ID
router.put(
  "/activar/:id",
  [check("id").custom(existeEmpleadoPorId), validarCampos],
  empleadoActivarPut
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
