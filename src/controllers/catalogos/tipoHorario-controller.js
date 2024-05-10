// IMPORTACIÓN DE OBJETOS 'RESPONSE' Y 'REQUEST' DE LA BIBLIOTECA 'EXPRESS'.
const { response, request } = require("express");
// IMPORTACIÓN DEL MODELO DE BASE DE DATOS.
const TipoHorario = require("../../models/modelos/catalogos/tipoHorario");

/**
 * OBTIENE LOS HORARIOS REGISTRADOS DENTRO DE LA BD.
 * @async
 * @function tipoHorarioGet
 * @param {request} req - OBJETO DE SOLICITUD HTTP.
 * @param {response} res - OBJETO DE RESPUESTA HTTP.
 * @returns {Object} RESPUESTA JSON CON LOS HORARIOS OBTENIDOS.
 */
const tipoHorarioGet = async (req = request, res = response) => {
  try {
    // REALIZA LA CONSULTA A LA BASE DE DATOS PARA OBTENER LOS HORARIOS.
    const tipo_horario = await TipoHorario.findAll({});

    // RESPONDE CON UN OBJETO JSON QUE CONTIENE LOS HORARIOS OBTENIDOS.
    res.status(200).json({
      ok: true,
      results: tipo_horario,
    });
  } catch (error) {
    // MANEJO DE ERRORES: IMPRIME EL ERROR EN LA CONSOLA Y RESPONDE CON UN ERROR HTTP 500.
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "HA OCURRIDO UN ERROR, HABLE CON EL ADMINISTRADOR.",
    });
  }
};

// EXPORTA EL MÉTODO PARA SER UTILIZADO EN OTROS ARCHIVOS.
module.exports = {
  tipoHorarioGet,
};
