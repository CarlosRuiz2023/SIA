const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../../middlewares/validar-campos');
const { clientesGet, clientePut, clientePost, clienteIdGet, clienteActivarPut, clienteDelete } = require('../../controllers/catalogos/cliente-controller');


const router = Router();

router.get('/', clientesGet);

router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('contrasenia', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    validarCampos
], clientePost);

router.get('/:id',[
    check('id', 'El id es obligatorio').not().isEmpty(),
], clienteIdGet);

router.put('/:id',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('contrasenia', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    validarCampos
], clientePut);

router.delete('/:id', [
    check('id', 'El id es obligatorio').isEmail(),
], clienteDelete);

router.put('/activar/:id',[
    check('id', 'El id es obligatorio').not().isEmpty(),
], clienteActivarPut);

module.exports = router;