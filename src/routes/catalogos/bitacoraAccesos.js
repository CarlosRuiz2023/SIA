// IMPORTACIÓN DE LAS BIBLIOTECAS NECESARIAS
const { Router } = require('express');

// IMPORTACIÓN DE LOS CONTROLADORES RELACIONADOS CON LA BITÁCORA DE ACCESOS
const { bitacoraAccesoGet, bitacoraAccesosPost } = require('../../controllers/catalogos/bitacoraAccesos-controller');

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER DATOS DE LA BITÁCORA DE ACCESO
router.post('/datos', bitacoraAccesoGet);

// DEFINICIÓN DE RUTA PARA AGREGAR DATOS A LA BITÁCORA DE ACCESO
router.post('/', bitacoraAccesosPost);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
