// IMPORTACIÓN DE LAS BIBLIOTECAS NECESARIAS
const { Router } = require("express");
const { check } = require("express-validator");

// IMPORTACIÓN DE LOS CONTROLADORES Y MIDDLEWARES NECESARIOS
const { validarCampos } = require("../../middlewares/validar-campos");
const {
  registroChequeoGet,
  registroChequeoPost,
} = require("../../controllers/catalogos/registroChequeo-controller");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS CLIENTES
router.get("/", registroChequeoGet);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO CLIENTE
router.post("/", registroChequeoPost);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
