const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../../middlewares/validar-campos');
const {empleadosGet, empleadoPost, empleadoIdGet, empleadoPut, empleadoDelete, empleadoActivarPut} = require('../../controllers/catalogos/empleado-controller');

const router = Router();

router.get('/', empleadosGet);

router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('contrasenia', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    //check('correo').custom( emailExiste ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    //check('rol').custom( esRoleValido ), 
    validarCampos
], empleadoPost );

router.get('/:id',[
    check('id', 'El id es obligatorio').not().isEmpty(),
], empleadoIdGet );

router.put('/:id',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('contrasenia', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    //check('correo').custom( emailExiste ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    //check('rol').custom( esRoleValido ), 
    validarCampos
], empleadoPut );

router.delete('/:id',[
    check('id', 'El id es obligatorio').not().isEmpty(),
], empleadoDelete );

router.put('/activar/:id',[
    check('id', 'El id es obligatorio').not().isEmpty(),
], empleadoActivarPut );


module.exports = router;