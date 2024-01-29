// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require("express");

// IMPORTACIÓN DE LOS MODELOS NECESARIOS PARA REALIZAR CONSULTAS EN LA BASE DE DATOS.
const Empleado = require("../../models/modelos/catalogos/empleado");
const Ausencia = require("../../models/modelos/catalogos/ausencias");
const RegistroChequeo = require("../../models/modelos/catalogos/registroChequeo");
const Persona = require("../../models/modelos/catalogos/persona");
const Permisos = require("../../models/modelos/catalogos/permisos");

/**
 * OBTIENE TODOS LOS EMPLEADOS ACTIVOS DE LA BASE DE DATOS.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
const ausenciasGet = async (req = request, res = response) => {
  try {
    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO EMPLEADOS Y SUS RELACIONES.
    const ausencias = await Ausencia.findAll({
      include: [
        {
          model: Empleado,
          as: "empleado",
          include: [{ model: Persona, as: "persona" }],
        },
        {
          model: Permisos,
          as: "permiso",
        },
      ],
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      results: ausencias,
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
const ausenciaIdGet = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL EMPLEADO DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER UN EMPLEADO ESPECÍFICO Y ACTIVO.
    const query = {
      id_cat_ausencia: id,
    };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UN EMPLEADO Y SUS RELACIONES.
    const ausencias = await Ausencia.findOne({
      where: query,
      include: [
        {
          model: Empleado,
          as: "empleado",
          include: [{ model: Persona, as: "persona" }],
        },
        {
          model: Permisos,
          as: "permiso",
        },
      ],
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      results: ausencias,
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
const ausenciasIdGet = async (req = request, res = response) => {
  try {
    // OBTENEMOS EL ID DEL EMPLEADO DESDE LOS PARÁMETROS DE RUTA.
    const { id } = req.params;

    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER UN EMPLEADO ESPECÍFICO Y ACTIVO.
    const query = {
      fk_cat_empleado: id,
    };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UN EMPLEADO Y SUS RELACIONES.
    const ausencias = await Ausencia.findOne({
      where: query,
      include: [
        {
          model: Empleado,
          as: "empleado",
          include: [{ model: Persona, as: "persona" }],
        },
        {
          model: Permisos,
          as: "permiso",
        },
      ],
    });

    // RETORNAMOS LOS DATOS OBTENIDOS EN LA RESPUESTA.
    res.status(200).json({
      ok: true,
      results: ausencias,
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
const ausenciasPost = async (req = request, res = response) => {
  try {
    // EXTRAEMOS LOS DATOS NECESARIOS DEL CUERPO DE LA SOLICITUD.
    const { fecha, descripcion, id_empleado, id_permiso } = req.body;

    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER UN EMPLEADO ESPECÍFICO Y ACTIVO.
    const query = {
      fecha: fecha,
      fk_cat_empleado: id_empleado,
    };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UN EMPLEADO Y SUS RELACIONES.
    const registros = await RegistroChequeo.findOne({
      where: query,
    });

    if (registros) {
      // RETORNA LA RESPUESTA CON LOS DATOS DEL EMPLEADO CREADO.
      return res.status(400).json({
        ok: false,
        msg: "Ausencia no registrada debido a que el empleado ha checado ese dia",
      });
    }

    // CREA UNA NUEVA PERSONA EN LA BASE DE DATOS.
    const ausencia = await Ausencia.create({
      fecha,
      descripcion,
      fk_cat_empleado: id_empleado,
      fk_cat_permiso: 1,
      estatus: 0,
    });

    // RETORNA LA RESPUESTA CON LOS DATOS DEL EMPLEADO CREADO.
    res.status(201).json({
      ok: true,
      results: { msg: "Ausencia registrada correctamente", ausencia },
    });
  } catch (error) {
    // MANEJO DE ERRORES, IMPRIMIMOS EL ERROR EN LA CONSOLA Y ENVIAMOS UNA RESPUESTA DE ERROR AL CLIENTE.
    console.log(error);
    res.status(500).json({
      ok: false,
      results: { msg: "Ha ocurrido un error, hable con el Administrador." },
    });
  }
};

/**
 * OBTIENE UN EMPLEADO ESPECÍFICO POR SU ID, SI ESTÁ ACTIVO.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y datos JSON.
 */
// ACTUALIZA LA INFORMACIÓN DE UN EMPLEADO EXISTENTE EN LA BASE DE DATOS.
const ausenciasPut = async (req = request, res = response) => {
  try {
    // OBTIENE EL ID DEL EMPLEADO DESDE LOS PARÁMETROS DE RUTA Y LOS DATOS ACTUALIZADOS DESDE EL CUERPO DE LA SOLICITUD.
    const { id } = req.params;
    const { fecha, descripcion, id_empleado, id_permiso, estatus } = req.body;

    // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER UN EMPLEADO ESPECÍFICO Y ACTIVO.
    const query = {
      fecha: fecha,
      fk_cat_empleado: id_empleado,
      fk_cat_permiso: id_permiso,
      estatus,
    };

    // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UN EMPLEADO Y SUS RELACIONES.
    const registros = await RegistroChequeo.findOne({
      where: query,
    });

    if (registros) {
      // RETORNA LA RESPUESTA CON LOS DATOS DEL EMPLEADO CREADO.
      return res.status(400).json({
        ok: false,
        msg: "Ausencia no registrada debido a que el empleado ha checado ese dia",
      });
    }

    // VERIFICA SI EL EMPLEADO EXISTE EN LA BASE DE DATOS.
    const ausencia = await Ausencia.findByPk(id, {
      include: [{ model: Empleado, as: "empleado" }],
    });

    // ACTUALIZA LOS CAMPOS DIRECTOS DEL MODELO EMPLEADO.
    ausencia.fecha = fecha;
    ausencia.descripcion = descripcion;
    ausencia.fk_cat_empleado = id_empleado;

    // GUARDA LOS CAMBIOS EN LA BASE DE DATOS.
    await ausencia.save();

    // RETORNA LA RESPUESTA CON LOS DATOS DEL EMPLEADO ACTUALIZADO.
    res.status(200).json({
      ok: true,
      msg: "Ausencia actualizado correctamente",
      results: ausencia,
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

// Función para registrar la ausencia
const registrarAusencia = async () => {
  try {
    const fechaActual = new Date().toISOString().slice(0, 10);
    // Lógica para obtener ID de empleado, fecha, descripción, etc.
    const empleados = await Empleado.findAll();

    for (let index = 0; index < empleados.length; index++) {
      const empleado = empleados[index];

      // DEFINIMOS LA CONDICIÓN DE CONSULTA PARA OBTENER UN EMPLEADO ESPECÍFICO Y ACTIVO.
      const query = {
        fecha: fechaActual,
        fk_cat_empleado: empleado[array].id_cat_empleado,
      };

      // REALIZAMOS LA CONSULTA EN LA BASE DE DATOS OBTENIENDO UN EMPLEADO Y SUS RELACIONES.
      const registros = await RegistroChequeo.findOne({
        where: query,
      });

      if (!registros) {
        const ausencia = await Ausencia.create({
          fecha: fechaActual,
          descripcion: "No ha checado entrada y ya paso de las 10:30:00",
          fk_cat_empleado: empleado[array].id_cat_empleado,
        });
        console.log(
          `Ausencia registrada para el empleado ${empleado[index].id_cat_empleado}`
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// EXPORTA LOS MÉTODOS PARA SER UTILIZADOS EN OTROS ARCHIVOS.
module.exports = {
  ausenciasGet,
  ausenciasPost,
  ausenciasPut,
  ausenciasIdGet,
  ausenciaIdGet,
  registrarAusencia,
};
