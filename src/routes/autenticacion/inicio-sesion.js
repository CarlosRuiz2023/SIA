const { Router } = require('express');
const { check } = require('express-validator');

// Asegúrate de que la ruta sea correcta y la ortografía sea precisa
const { validarCampos } = require('../../middlewares/validar-campos');
const { inicioSesion } = require('../../controllers/autentificacion/inicio-sesion-controller');

const router = Router();

router.post('/inicioSesion', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('contrasenia', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], inicioSesion);

module.exports = router;
