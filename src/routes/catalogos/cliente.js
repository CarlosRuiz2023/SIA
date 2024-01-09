// IMPORTACIÓN DE LAS BIBLIOTECAS NECESARIAS
const { Router } = require('express');
const { check } = require('express-validator');

// IMPORTACIÓN DE LOS CONTROLADORES Y MIDDLEWARES NECESARIOS
const { validarCampos } = require('../../middlewares/validar-campos');
const { clientesGet, clientePut, clientePost, clienteIdGet, clienteActivarPut, clienteDelete } = require('../../controllers/catalogos/cliente-controller');

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS CLIENTES
router.get('/', clientesGet);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO CLIENTE
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('contrasenia', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    validarCampos
], clientePost);

// DEFINICIÓN DE RUTA PARA OBTENER UN CLIENTE POR ID
router.get('/:id', [
    check('id', 'El id es obligatorio').not().isEmpty(),
], clienteIdGet);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR UN CLIENTE POR ID
router.put('/:id', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('contrasenia', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    validarCampos
], clientePut);

// DEFINICIÓN DE RUTA PARA ELIMINAR UN CLIENTE POR ID
router.delete('/:id', [
    check('id', 'El id es obligatorio').isEmail(),
], clienteDelete);

// DEFINICIÓN DE RUTA PARA ACTIVAR UN CLIENTE POR ID
router.put('/activar/:id', [
    check('id', 'El id es obligatorio').not().isEmpty(),
], clienteActivarPut);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
