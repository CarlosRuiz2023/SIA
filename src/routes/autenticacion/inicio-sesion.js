// IMPORTACIÓN DE LAS BIBLIOTECAS NECESARIAS
const { Router } = require('express');
const { check } = require('express-validator');

// IMPORTACIONES DE MIDDLEWARES Y DE CONTROLADORES
const { validarCampos } = require('../../middlewares/validar-campos');
const { inicioSesion } = require('../../controllers/autentificacion/inicio-sesion-controller');

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA INICIAR SESIÓN
router.post('/inicioSesion', [
    // VALIDACIONES PARA LOS DATOS DE INICIO DE SESIÓN
    check('correo', 'El correo es obligatorio').isEmail(),
    check('contrasenia', 'La contraseña es obligatoria').not().isEmpty(),
    // MIDDLEWARE PARA VALIDAR CAMPOS
    validarCampos
], inicioSesion);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
