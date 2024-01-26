// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

// IMPORTACIÓN DE LOS MODELOS NECESARIOS PARA REALIZAR CONSULTAS EN LA BASE DE DATOS.
const Empleado = require("../../models/modelos/catalogos/empleado");
const Persona = require("../../models/modelos/catalogos/persona");
const Usuario = require("../../models/modelos/usuario");
const Roles = require("../../models/modelos/catalogos/roles");
const DetalleUsuarioRol = require("../../models/modelos/detalles/detalle_usuario_rol");
const Vacaciones = require("../../models/modelos/catalogos/vacaciones");
const Tolerancia = require("../../models/modelos/catalogos/tolerancia");
const { generarNumeroEmpleado } = require("../../helpers/operacionMatricula");

/**
 * OBTIENE TODOS LOS EMPLEADOS ACTIVOS DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const empleadosGet = async (req = request, res = response) => {
  try {
    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER EMPLEADOS ACTIVOS.
    const query = { estatus: 1 };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO EMPLEADOS Y SUS RELACIONES.
    const empleados = await Empleado.findAll({
      where: query,
      include: [
        { model: Persona, as: "persona" },
        {
          model: Usuario,
          as: "usuario",
          include: [
            {
              model: DetalleUsuarioRol,
              as: "detalle_usuario_rols",
              include: [{ model: Roles, as: "cat_role" }],
            },
          ],
        },
        { model: Vacaciones, as: "vacaciones" },
        { model: Tolerancia, as: "tolerancia" },
      ],
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      results: empleados,
    });
  } catch (error) {
    // MANEJO DE ERRORES, IMPRIMIMOS EL ERROR EN LA CONSOLA Y ENVIAMOS UNA RESPUESTA DE ERROR AL CLIENTE.
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Ha ocurrido un error, hable con el Administrador.",
    });
  }
};

/**
 * OBTIENE UN EMPLEADO ESPECÍFICO POR SU ID, SI ESTÁ ACTIVO.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const empleadoIdGet = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL EMPLEADO DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER UN EMPLEADO ESPECÍFICO Y ACTIVO.
    const query = {
      id_cat_empleado: id,
      estatus: 1,
    };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UN EMPLEADO Y SUS RELACIONES.
    const empleado = await Empleado.findOne({
      where: query,
      include: [
        { model: Persona, as: "persona" },
        {
          model: Usuario,
          as: "usuario",
          include: [
            {
              model: DetalleUsuarioRol,
              as: "detalle_usuario_rols",
              include: [{ model: Roles, as: "cat_role" }],
            },
          ],
        },
        { model: Vacaciones, as: "vacaciones" },
        { model: Tolerancia, as: "tolerancia" },
      ],
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      results: empleado,
    });
  } catch (error) {
    // MANEJO DE ERRORES, IMPRIMIMOS EL ERROR EN LA CONSOLA Y ENVIAMOS UNA RESPUESTA DE ERROR AL CLIENTE.
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Ha ocurrido un error, hable con el Administrador.",
    });
  }
};

/**
 * OBTIENE UN EMPLEADO ESPECÍFICO POR SU ID, SI ESTÁ ACTIVO.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
// REGISTRA UN NUEVO EMPLEADO EN LA BASE DE DATOS.
const empleadoPost = async (req = request, res = response) => {
  try {
    // EXTRAEMOS LOS DATOS NECESARIOS DEL CUERPO DE LA SOLICITUD.
    const {
      nombre,
      apellido_Paterno,
      apellido_Materno,
      direccion,
      sueldo,
      fecha_nacimiento,
      fecha_contratacion,
      fk_cat_puesto_trabajo,
      fk_cat_vacaciones,
      fk_cat_tolerancia,
      correo,
      roles,
    } = req.body;

    let { contrasenia } = req.body;

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    contrasenia = bcryptjs.hashSync(contrasenia, salt);

    // CREA UNA NUEVA PERSONA EN LA BASE DE DATOS.
    const persona = await Persona.create({
      nombre,
      apellido_Paterno,
      apellido_Materno,
      direccion,
      estatus: 1,
    });

    // CREA UN NUEVO USUARIO EN LA BASE DE DATOS.
    const usuario = await Usuario.create({
      correo,
      contrasenia,
      token: "",
      estatus: 1,
    });

    // LLAMADA A LA FUNCIÓN PARA GENERAR EL NÚMERO DE EMPLEADO.
    const numeroEmpleado = generarNumeroEmpleado(
      nombre,
      apellido_Paterno,
      apellido_Materno,
      fecha_contratacion
    );

    // CREA EL EMPLEADO ASOCIANDO LA PERSONA Y EL USUARIO.
    const empleado = await Empleado.create({
      numero_empleado: numeroEmpleado,
      sueldo,
      fecha_nacimiento,
      fecha_contratacion,
      fecha_retiro: null,
      estatus: 1,
      fk_cat_persona: persona.id_cat_persona,
      fk_cat_usuario: usuario.id_cat_usuario,
      fk_cat_puesto_trabajo,
      fk_cat_vacaciones,
      fk_cat_tolerancia,
    });

    // ASOCIA LOS ROLES AL USUARIO MEDIANTE LA TABLA INTERMEDIA.
    await Promise.all(
      roles.map(async (rol) => {
        await DetalleUsuarioRol.create({
          fk_cat_usuario: usuario.id_cat_usuario,
          fk_cat_rol: rol.id_cat_role,
        });
      })
    );

    // RETORNA LA RESPUESTA CON LOS DATOS DEL EMPLEADO CREADO.
    res.status(201).json({
      ok: true,
      msg: "Empleado guardado correctamente",
      results: {
        persona,
        empleado,
        usuario,
        roles,
      },
    });
  } catch (error) {
    // MANEJO DE ERRORES, IMPRIMIMOS EL ERROR EN LA CONSOLA Y ENVIAMOS UNA RESPUESTA DE ERROR AL CLIENTE.
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Ha ocurrido un error, hable con el Administrador.",
    });
  }
};

/**
 * OBTIENE TODOS LOS EMPLEADOS ACTIVOS DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
// ACTUALIZA LA INFORMACIÓN DE UN EMPLEADO EXISTENTE EN LA BASE DE DATOS.
const empleadoPut = async (req = request, res = response) => {
  try {
    // OBTIENE EL ID DEL EMPLEADO DESDE LOS PARÁMETROS DE RUTA Y LOS DATOS ACTUALIZADOS DESDE EL CUERPO DE LA SOLICITUD.
    const { id } = req.params;
    const {
      nombre,
      apellido_Paterno,
      apellido_Materno,
      direccion,
      sueldo,
      fecha_nacimiento,
      fecha_contratacion,
      fk_cat_puesto_trabajo,
      fk_cat_vacaciones,
      fk_cat_tolerancia,
      correo,
      roles,
    } = req.body;

    // VERIFICA SI EL EMPLEADO EXISTE EN LA BASE DE DATOS.
    const empleadoExistente = await Empleado.findByPk(id, {
      include: [
        { model: Persona, as: "persona" },
        { model: Usuario, as: "usuario" },
      ],
    });

    // LLAMADA A LA FUNCIÓN PARA GENERAR EL NÚMERO DE EMPLEADO.
    const numeroEmpleado = generarNumeroEmpleado(
      nombre,
      apellido_Paterno,
      apellido_Materno,
      fecha_contratacion
    );

    // ACTUALIZA LOS CAMPOS DIRECTOS DEL MODELO EMPLEADO.
    empleadoExistente.sueldo = sueldo;
    empleadoExistente.numero_empleado = numeroEmpleado;
    empleadoExistente.fecha_nacimiento = fecha_nacimiento;
    empleadoExistente.fecha_Contratacion = fecha_contratacion;
    empleadoExistente.fk_cat_puesto_trabajo = fk_cat_puesto_trabajo;
    empleadoExistente.fk_cat_vacaciones = fk_cat_vacaciones;
    empleadoExistente.fk_cat_tolerancia = fk_cat_tolerancia;

    // ACTUALIZA LOS CAMPOS DEL MODELO PERSONA.
    empleadoExistente.persona.nombre = nombre;
    empleadoExistente.persona.apellido_Paterno = apellido_Paterno;
    empleadoExistente.persona.apellido_Materno = apellido_Materno;
    empleadoExistente.persona.direccion = direccion;

    // ACTUALIZA LOS CAMPOS DEL MODELO USUARIO.
    empleadoExistente.usuario.correo = correo;

    // ELIMINA LOS ROLES ANTIGUOS ASOCIADOS AL USUARIO.
    await DetalleUsuarioRol.destroy({
      where: { fk_cat_usuario: empleadoExistente.usuario.id_cat_usuario },
    });

    // ASOCIA LOS NUEVOS ROLES PROPORCIONADOS.
    await Promise.all(
      roles.map(async (rol) => {
        await DetalleUsuarioRol.create({
          fk_cat_usuario: empleadoExistente.usuario.id_cat_usuario,
          fk_cat_rol: rol.id_cat_role,
        });
      })
    );

    // GUARDA LOS CAMBIOS EN LA BASE DE DATOS.
    // GUARDA LOS CAMBIOS EN EL MODELO PERSONA.
    await empleadoExistente.persona.save();

    // GUARDA LOS CAMBIOS EN EL MODELO USUARIO.
    await empleadoExistente.usuario.save();

    await empleadoExistente.save();

    // RETORNA LA RESPUESTA CON LOS DATOS DEL EMPLEADO ACTUALIZADO.
    res.status(200).json({
      ok: true,
      msg: "Empleado actualizado correctamente",
      results: empleadoExistente,
    });
  } catch (error) {
    // MANEJO DE ERRORES, IMPRIMIMOS EL ERROR EN LA CONSOLA Y ENVIAMOS UNA RESPUESTA DE ERROR AL CLIENTE.
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Ha ocurrido un error, hable con el Administrador.",
    });
  }
};

/**
 * OBTIENE TODOS LOS EMPLEADOS ACTIVOS DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
// ELIMINA LÓGICAMENTE UN EMPLEADO ESTABLECIENDO SU ESTATUS A 0.
const empleadoDelete = async (req = request, res = response) => {
  try {
    // OBTIENE EL ID DEL EMPLEADO DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // VERIFICA SI EL EMPLEADO EXISTE EN LA BASE DE DATOS.
    const empleadoExistente = await Empleado.findByPk(id);

    // ESTABLECE EL ESTATUS A 0 PARA "ELIMINAR" LÓGICAMENTE EL EMPLEADO.
    empleadoExistente.estatus = 0;

    // GUARDA EL CAMBIO EN LA BASE DE DATOS.
    await empleadoExistente.save();

    // RETORNA LA RESPUESTA CON LOS DATOS DEL EMPLEADO ELIMINADO.
    res.status(200).json({
      ok: true,
      msg: "Empleado eliminado correctamente",
      results: empleadoExistente,
    });
  } catch (error) {
    // MANEJO DE ERRORES, IMPRIMIMOS EL ERROR EN LA CONSOLA Y ENVIAMOS UNA RESPUESTA DE ERROR AL CLIENTE.
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Ha ocurrido un error, hable con el Administrador.",
    });
  }
};

/**
 * OBTIENE TODOS LOS EMPLEADOS ACTIVOS DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
// ACTUALIZA EL ESTATUS DE UN EMPLEADO A 1 PARA "ACTIVARLO".
const empleadoActivarPut = async (req = request, res = response) => {
  try {
    // OBTIENE EL ID DEL EMPLEADO DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // VERIFICA SI EL EMPLEADO EXISTE EN LA BASE DE DATOS.
    const empleadoExistente = await Empleado.findByPk(id);

    // ESTABLECE EL ESTATUS A 1 PARA "ACTUALIZAR" Y ACTIVAR EL EMPLEADO.
    empleadoExistente.estatus = 1;

    // GUARDA EL CAMBIO EN LA BASE DE DATOS.
    await empleadoExistente.save();

    // RETORNA LA RESPUESTA CON LOS DATOS DEL EMPLEADO ACTIVADO.
    res.status(200).json({
      ok: true,
      msg: "Empleado activado correctamente",
      results: empleadoExistente,
    });
  } catch (error) {
    // MANEJO DE ERRORES, IMPRIMIMOS EL ERROR EN LA CONSOLA Y ENVIAMOS UNA RESPUESTA DE ERROR AL CLIENTE.
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Ha ocurrido un error, hable con el Administrador.",
    });
  }
};

// EXPORTA LOS MÉTODOS PARA SER UTILIZADOS EN OTROS ARCHIVOS.
module.exports = {
  empleadosGet,
  empleadoPost,
  empleadoIdGet,
  empleadoPut,
  empleadoDelete,
  empleadoActivarPut,
};
