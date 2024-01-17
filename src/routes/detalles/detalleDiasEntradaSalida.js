// IMPORTACIÓN DE LAS BIBLIOTECAS NECESARIAS
const { Router } = require("express");
const { check } = require("express-validator");

// IMPORTACIÓN DE LOS CONTROLADORES Y MIDDLEWARES NECESARIOS
const { validarCampos } = require("../../middlewares/validar-campos");
const {
  detalleDiasEntradaSalidaGet,
  detalleDiasEntradaSalidaPost,
} = require("../../controllers/detalles/detalleDiasEntradaSalida-controller");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS CLIENTES
router.get("/", detalleDiasEntradaSalidaGet);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO CLIENTE
//router.post("/", detalleDiasEntradaSalidaPost);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
