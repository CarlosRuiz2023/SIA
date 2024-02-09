const { Router } = require("express");
const { check } = require("express-validator");
const { validarArchivoSubir } = require("../middlewares/validar-archivo");
const {
  cargarArchivo,
  mostrarImagen,
  actualizarImagen,
} = require("../controllers/uploads-controller");
const { coleccionesPermitidas } = require("../helpers/db-validators");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { esAdminRole, tienePermiso } = require("../middlewares/validar-roles");

const router = Router();

const sub_modulo = "Usuario";

router.post(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    esAdminRole,
    validarArchivoSubir,
    validarCampos,
  ],
  cargarArchivo
);

router.put(
  "/:coleccion/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Modificar", sub_modulo),
    validarArchivoSubir,
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["empleado", "equipo"])
    ),
    validarCampos,
  ],
  actualizarImagen
);

router.get(
  "/:coleccion/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    //validarJWT,
    //tienePermiso("Leer", sub_modulo),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["empleado", "equipo"])
    ),
    validarCampos,
  ],
  mostrarImagen
);

module.exports = router;
