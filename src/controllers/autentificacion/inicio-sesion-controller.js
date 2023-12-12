const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../../models/modelos/usuario');

const inicioSesion = async(req, res) =>{
    const {correo, contrasenia} = req.body;

    try {
        //Verificamos si el usuario existe 
        const usuario = await Usuario.findOne({ where: { correo } });

        if(!usuario){
            return res.status(400).json({
                ok:false,
                msg: 'Usuario o contraseña no son correctos. Intenta de nuevo - correo'
            });
        }
        
        //Verifica si el usuario esta activo
        if(!usuario.estatus){
            return res.status(400).json({
                ok:false,
                msg: 'Usuario o contraseña no son correctos. Intenta de nuevo - estatus: falso'
            });
        }

        //Verificamos si la contraseña es correcta
        //const validarContrasenia = bcryptjs.compareSync(contrasenia, usuario.contrasenia);
        const validarContrasenia = await Usuario.findOne({where: {contrasenia}});
        if(!validarContrasenia){
            return res.status(400).json({
                ok:false,
                msg: 'Usuario o contraseña no son correctos. Intenta de nuevo - contraseña'
            });
        }

        //Generar el JWT
        //const token = await generarJWT(usuario.id_cat_usuario);

        res.status(200).json({
           ok:true,
           usuario
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.'
        });
    }
}

module.exports = {
    inicioSesion
}