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

const router = Router();

router.post("/", validarArchivoSubir, cargarArchivo);

router.put(
  "/:coleccion/:id",
  [
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
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["empleado", "equipo"])
    ),
    validarCampos,
  ],
  mostrarImagen
);

module.exports = router;
