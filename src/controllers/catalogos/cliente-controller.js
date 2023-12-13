const { response, request } = require('express');
const Cliente = require('../../models/modelos/catalogos/cliente');
const Persona = require('../../models/modelos/catalogos/persona');
const Usuario = require('../../models/modelos/usuario');

const clientesGet = async ( req = request, res = response) => {
    try {
        const query = { estatus: 1};
        const clientes = await Cliente.findAll({
            where: query,
            include: [
                {model: Persona, as: 'persona'},
                {model: Usuario, as:'usuario'},
            ]
        });

        res.status(200).json({
            ok:true,
            clientes
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }
};

const clienteIdGet = async ( req = request, res = response) => {
    try {
        const { id } = req.params;

        const query = {
            id_cat_cliente: id,
            estatus: 1,
        };

        const cliente = await Cliente.findOne({
            where: query,
            include: [
                { model: Persona, as: 'persona'},
                { model: Usuario, as: 'usuario'},
            ],
        });

        if(!cliente){
            return res.status(404).json({
                ok:false,
                msg: 'Cliente no encontrado.',
            });
        }

        res.status(200).json({
            ok: true,
            cliente
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }
};

const clientePost = async ( req = request, res = response ) => {
    try {
        const {
            nombre,
            apellido_Paterno,
            apellido_Materno,
            direccion,
            empresa,
            correo,
            contrasenia,
        } = req.body; 

        const persona = await Persona.create({
            nombre,
            apellido_Paterno,
            apellido_Materno,
            direccion,
            estatus: 1,
        });

        const usuario = await Usuario.create({
            correo,
            contrasenia,
            token: "",
            estatus:1,
        });

        const cliente = await Cliente.create({
            empresa,
            estatus: 1,
            fk_cat_persona: persona.id_cat_persona,
            fk_cat_usuario: usuario.id_cat_usuario,
        });
       
        res.status(201).json({
            ok:true,
            msg: 'Cliente guardado correctamente',
            persona,
            cliente,
            usuario
        });
          
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }
};

const clientePut = async ( req= request, res= response) => {
    try {
        const { id } = req.params;
        const {
            nombre,
            apellido_Paterno,
            apellido_Materno,
            direccion,
            empresa,
            correo,
            contrasenia,
        } = req.body;

        const clienteExiste = await Cliente.findByPk(id, {
            include: [
                {model: Persona, as: 'persona'},
                {model: Usuario, as: 'usuario'}
            ],
        });

        if(!clienteExiste){
            return res.status(404).json({
                ok: false,
                msg: 'Cliente no encontrado',
            });
        }
         
        //ACTUALIZAR INFORMACIÓN DE CLIENTE
        clienteExiste.empresa = empresa;

        //ACTUALIZAR INFORMACION DE PERSONA 
        clienteExiste.persona.nombre = nombre;
        clienteExiste.persona.apellido_Paterno = apellido_Paterno;
        clienteExiste.persona.apellido_Materno = apellido_Materno;
        clienteExiste.persona.direccion = direccion;

        //ACTUALIZA INFORMACION DE USUARIO
        clienteExiste.usuario.correo = correo;
        clienteExiste.usuario.contrasenia = contrasenia;

        await clienteExiste.persona.save();

        await clienteExiste.usuario.save();

        await clienteExiste.save();

        res.status(200).json({
            ok:true,
            msg: 'Cliente actualizado correctamente',
            cliente: clienteExiste,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }
};

const clienteDelete = async ( req = request, res = response) => {
    try {
        const { id } = req.params;

        const clienteExiste = await Cliente.findByPk(id);

        if(!clienteExiste){
            return res.status(404).json({
                ok:false,
                msg: 'Cliente no encontrado',
            });
        }

        clienteExiste.estatus = 0;

        await clienteExiste.save();

        res.status(200).json({
            ok:true,
            msg:'Cliente eliminado correctamente',
            cliente: clienteExiste,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        })
    }
}

const clienteActivarPut = async ( req = request, res = response) => {
    try {
        const { id } = req.params;

        const clienteExiste = await Cliente.findByPk(id);

        if(!clienteExiste){
            return res.status(404).json({
                ok:false,
                msg: 'Cliente no encontrado',
            });
        }

        clienteExiste.estatus = 1;

        await clienteExiste.save();

        res.status(200).json({
            ok:true,
            msg: 'Cliente activado correctamente',
            cliente: clienteExiste,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }
}

module.exports = {
    clientesGet,
    clientePost,
    clientePut,
    clienteDelete,
    clienteIdGet,
    clienteActivarPut
};