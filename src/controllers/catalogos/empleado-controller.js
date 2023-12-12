const { response, request } = require('express');
const Empleado = require('../../models/modelos/catalogos/empleado');
const Persona = require('../../models/modelos/catalogos/persona');
const Usuario = require('../../models/modelos/usuario');
const Roles = require('../../models/modelos/catalogos/roles');
const DetalleUsuarioRol = require('../../models/modelos/detalles/detalle_usuario_rol');

const empleadosGet = async (req = request, res = response) => {
    try {
        const query = { estatus: 1 };
        const empleados = await Empleado.findAll({
            where: query,
            include: [
                { model: Persona, as: 'persona' },
                {
                    model: Usuario,
                    as: 'usuario',
                    include: [
                        {
                            model: DetalleUsuarioRol,
                            as: 'detalle_usuario_rols',
                            include: [
                                { model: Roles, as: 'cat_role' }
                            ]
                        }
                    ]
                }
            ],
        });

        res.status(200).json({
            ok: true,
            empleados,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }
};

const empleadoIdGet = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const query = {
            id_cat_empleado: id,
            estatus: 1,
        };

        const empleado = await Empleado.findOne({
            where: query,
            include: [
                { model: Persona, as: 'persona' },
                {
                    model: Usuario,
                    as: 'usuario',
                    include: [
                        {
                            model: DetalleUsuarioRol,
                            as: 'detalle_usuario_rols',
                            include: [
                                { model: Roles, as: 'cat_role' }
                            ]
                        }
                    ]
                }
            ],
        });

        if (!empleado) {
            return res.status(404).json({
                ok: false,
                msg: 'Empleado no encontrado',
            });
        }

        res.status(200).json({
            ok: true,
            empleado,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }
};


const empleadoPost = async (req = request, res = response) => {
    try {
        const {
            nombre,
            apellido_Paterno,
            apellido_Materno,
            direccion,
            sueldo,
            fecha_nacimiento,
            fecha_Contratacion,
            fk_cat_puesto_trabajo,
            fk_cat_vacaciones,
            fk_cat_tolerancia,
            correo,
            contrasenia,
            roles
        } = req.body;

        // Crea la persona
        const persona = await Persona.create({
            nombre,
            apellido_Paterno,
            apellido_Materno,
            direccion,
            estatus: 1,
        });

        // Crea el usuario
        const usuario = await Usuario.create({
            correo,
            contrasenia,
            token: "",
            estatus: 1
        });

        const generarNumeroEmpleado = () => {
            const primerLetra = nombre.charAt(0);
            const segundaLetra = apellido_Paterno.charAt(0);
            let terceraLetra = apellido_Materno;

            if (apellido_Materno === "") {
                terceraLetra = "X";
            } else {
                terceraLetra = terceraLetra.charAt(0);
            }

            const fechaOriginal = fecha_Contratacion;
            const fechaConvertida = new Date(fechaOriginal).toISOString().slice(0, 10).replace(/-/g, "");

            return primerLetra.toUpperCase() + segundaLetra.toUpperCase() + terceraLetra.toUpperCase() + fechaConvertida;
        };

        // Llamada a la función para generar el número de empleado
        const numeroEmpleado = generarNumeroEmpleado();

        // Crea el empleado asociando la persona y el usuario
        const empleado = await Empleado.create({
            numero_empleado: numeroEmpleado,
            sueldo,
            fecha_nacimiento,
            fecha_Contratacion,
            fecha_Retiro: null,
            estatus: 1,
            fk_cat_persona: persona.id_cat_persona,
            fk_cat_usuario: usuario.id_cat_usuario,
            fk_cat_puesto_trabajo,
            fk_cat_vacaciones,
            fk_cat_tolerancia
        });


        // Asocia los roles al usuario mediante la tabla intermedia
        if (roles && roles.length > 0) {
            await Promise.all(roles.map(async (rol) => {
                await DetalleUsuarioRol.create({
                    fk_cat_usuario: usuario.id_cat_usuario,
                    fk_cat_rol: rol.id_cat_role
                });
            }));
        } else {
            return res.status(400).json({
                msg: 'El empleado debe contener al menos un rol',
            });
        }

        res.status(201).json({
            ok: true,
            msg: 'Empleado guardado correctamente',
            persona,
            empleado,
            usuario,
            roles: roles
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }
}

const empleadoPut = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const {
            nombre,
            apellido_Paterno,
            apellido_Materno,
            direccion,
            sueldo,
            fecha_nacimiento,
            fecha_Contratacion,
            fk_cat_puesto_trabajo,
            fk_cat_vacaciones,
            fk_cat_tolerancia,
            correo,
            contrasenia,
            roles
        } = req.body;

        // Verifica si el empleado existe
        const empleadoExistente = await Empleado.findByPk(id, {
            include: [
                { model: Persona, as: 'persona' },
                { model: Usuario, as: 'usuario' },
            ],
        });
        if (!empleadoExistente) {
            return res.status(404).json({
                ok: false,
                msg: 'Empleado no encontrado',
            });
        }

        // Actualiza los campos directos del modelo Empleado
        empleadoExistente.sueldo = sueldo;
        empleadoExistente.fecha_nacimiento = fecha_nacimiento;
        empleadoExistente.fecha_Contratacion = fecha_Contratacion;
        empleadoExistente.fk_cat_puesto_trabajo = fk_cat_puesto_trabajo;
        empleadoExistente.fk_cat_vacaciones = fk_cat_vacaciones;
        empleadoExistente.fk_cat_tolerancia = fk_cat_tolerancia;

        // Actualiza los campos del modelo Persona
        empleadoExistente.persona.nombre = nombre;
        empleadoExistente.persona.apellido_Paterno = apellido_Paterno;
        empleadoExistente.persona.apellido_Materno = apellido_Materno;
        empleadoExistente.persona.direccion = direccion;

        // Actualiza los campos del modelo Usuario
        empleadoExistente.usuario.correo = correo;
        empleadoExistente.usuario.contrasenia = contrasenia;

        // Asocia los roles al usuario mediante la tabla intermedia
        if (roles && roles.length > 0) {
            // Elimina los roles antiguos asociados al usuario
            await DetalleUsuarioRol.destroy({ where: { fk_cat_usuario: empleadoExistente.usuario.id_cat_usuario } });

            // Asocia los nuevos roles proporcionados
            await Promise.all(roles.map(async (rol) => {
                await DetalleUsuarioRol.create({
                    fk_cat_usuario: empleadoExistente.usuario.id_cat_usuario,
                    fk_cat_rol: rol.id_cat_role
                });
            }));
        }else {
            return res.status(400).json({
                msg: 'El empleado debe contener al menos un rol',
            });
        }
        // Guarda los cambios en la base de datos
        // Guarda los cambios en el modelo Persona
        await empleadoExistente.persona.save();

        // Guarda los cambios en el modelo Usuario
        await empleadoExistente.usuario.save();

        await empleadoExistente.save();



        res.status(200).json({
            ok: true,
            msg: 'Empleado actualizado correctamente',
            empleado: empleadoExistente,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }
};


const empleadoDelete = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        // Verifica si el empleado existe
        const empleadoExistente = await Empleado.findByPk(id);
        if (!empleadoExistente) {
            return res.status(404).json({
                ok: false,
                msg: 'Empleado no encontrado',
            });
        }

        // Establece el estatus a 0 para "eliminar" lógicamente el empleado
        empleadoExistente.estatus = 0;

        // Guarda el cambio en la base de datos
        await empleadoExistente.save();

        res.status(200).json({
            ok: true,
            msg: 'Empleado eliminado correctamente',
            empleado: empleadoExistente,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }
};

const empleadoActivarPut = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        // Verifica si el empleado existe
        const empleadoExistente = await Empleado.findByPk(id);
        if (!empleadoExistente) {
            return res.status(404).json({
                ok: false,
                msg: 'Empleado no encontrado',
            });
        }

        // Establece el estatus a 1 para "actualizar" y activar el empleado
        empleadoExistente.estatus = 1;

        // Guarda el cambio en la base de datos
        await empleadoExistente.save();

        res.status(200).json({
            ok: true,
            msg: 'Empleado activado correctamente',
            empleado: empleadoExistente,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
        });
    }
};

module.exports = {
    empleadosGet,
    empleadoPost,
    empleadoIdGet,
    empleadoPut,
    empleadoDelete,
    empleadoActivarPut
};

