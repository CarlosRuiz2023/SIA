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
const { esAdminRole, tieneRole } = require("../middlewares/validar-roles");

const router = Router();

router.post(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    //tieneRole("FROND END", "BACK END"),
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
    //tieneRole("FROND END", "BACK END"),
    esAdminRole,
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
    validarJWT,
    //tieneRole("FROND END", "BACK END"),
    esAdminRole,
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["empleado", "equipo"])
    ),
    validarCampos,
  ],
  mostrarImagen
);

module.exports = router;
