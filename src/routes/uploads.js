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

// DEFINICIÓN DE RUTA PARA CARGAR UN ARCGHIVO DE FORMA FISICA EN EL SISTEMA
router.post(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE ACCESO
    validarJWT,
    esAdminRole,
    validarArchivoSubir,
    validarCampos,
  ],
  cargarArchivo
);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR FOTOGRAFIAS DE LAS DIFERENTES COLECCIONES QUE SE GUARDAN
router.put(
  "/:coleccion/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE ACTUALIZAR FOTOGRAFIAS
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

// DEFINICIÓN DE RUTA PARA OBTENER LAS FOTOGRAFIAS DE LAS DIFERENTES COLECCIONES
router.get(
  "/:coleccion/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE ACCESO
    // SE COMENTO EL USO DEL TOKEN EN ESTE ENDPOINT DEBIDO A QUE ASI SE ME FUE SOLICITADO POR MIS COMPAÑEROS DE FRONT.
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
