// IMPORTACIÓN DEL OBJETO 'RESPONSE' DE LA BIBLIOTECA 'EXPRESS'.
const { response } = require('express');
// IMPORTACIÓN DEL MÓDULO 'BCRYPTJS' PARA EL MANEJO DE CONTRASEÑAS HASH.
const bcryptjs = require('bcryptjs');
// IMPORTACIÓN DEL MODELO 'USUARIO' DESDE LA RUTA CORRESPONDIENTE.
const Usuario = require('../../models/modelos/usuario');

/**
 * MANEJA EL PROCESO DE INICIO DE SESIÓN PARA UN USUARIO.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const inicioSesion = async (req, res) => {
    // EXTRAE EL CORREO Y LA CONTRASEÑA DEL CUERPO DE LA SOLICITUD.
    const { correo, contrasenia } = req.body;

    try {
        // VERIFICAMOS SI EL USUARIO EXISTE EN LA BASE DE DATOS.
        const usuario = await Usuario.findOne({ where: { correo } });

        //SI NO EXISTE EL USUARIOS MANDAR MENSAJE DE ERROR 
        if (!usuario) {
            //RETORNAMOS MENSAJE DE ERROR
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña no son correctos. Intenta de nuevo'
            });
        }

        // VERIFICA SI EL USUARIO ESTÁ ACTIVO.
        if (!usuario.estatus) {
             //RETORNAMOS MENSAJE DE ERROR
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña no son correctos. Intenta de nuevo'
            });
        }

        // VERIFICAMOS SI LA CONTRASEÑA PROPORCIONADA ES CORRECTA.
        const validarContrasenia = await bcryptjs.compare(contrasenia, usuario.contrasenia);

        //VERIFICA LA CONTRASÑA
        if (!validarContrasenia) {
            //RETORNAMOS MENSAJE DE ERROR
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña no son correctos. Intenta de nuevo - CONTRASEÑA'
            });
        }

        // EN CASO DE ÉXITO, SE ENVÍA UNA RESPUESTA POSITIVA JUNTO CON LA INFORMACIÓN DEL USUARIO.
        res.status(200).json({
            ok: true,
            usuario
        });

    } catch (error) {
        // MANEJO DE ERRORES, SE IMPRIME EL ERROR EN LA CONSOLA Y SE ENVÍA UNA RESPUESTA DE ERROR AL CLIENTE.
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.'
        });
    }
};

// EXPORTA LA FUNCIÓN INICIOSESION PARA SER UTILIZADA EN OTROS ARCHIVOS.
module.exports = {
    inicioSesion
};
