// IMPORTACIÓN DEL OBJETO 'RESPONSE' DE LA BIBLIOTECA 'EXPRESS'.
const { response } = require("express");
// IMPORTACIÓN DEL MÓDULO 'BCRYPTJS' PARA EL MANEJO DE CONTRASEÑAS HASH.
const bcryptjs = require("bcryptjs");
// IMPORTACIÓN DEL MÓDULO 'NODEMAILER' PARA EL ENVIO DE CORREOS.
const nodemailer = require("nodemailer");
// IMPORTACIÓN DEL MÓDULO 'GENERAR-JWT' PARA LA CREACION DE TOKENS.
const { generarJWT } = require("../../helpers/generar-jwt");
// IMPORTACIÓN DEL MODELO 'USUARIO' DESDE LA RUTA CORRESPONDIENTE.
const Usuario = require("../../models/modelos/usuario");
// IMPORTACIÓN DEL MODELO 'TRANSPORTER' DESDE LA RUTA CORRESPONDIENTE.
const { transporter } = require("../../helpers/enviar-emails");
const Persona = require("../../models/modelos/catalogos/persona");
const Empleado = require("../../models/modelos/catalogos/empleado");
const PuestoTrabajo = require("../../models/modelos/catalogos/puestoTrabajo");
const TipoHorario = require("../../models/modelos/catalogos/tipoHorario");

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
    // BUSCAMOS AL USUARIO DENTRO DE LA BASE DE DATOS.
    const empleado = await Empleado.findOne({
      include: [
        { model: Usuario, as: "usuario", where: { correo } },
        { model: Persona, as: "persona" },
        {
          model: PuestoTrabajo,
          as: "puesto_trabajo",
          include: [{ model: TipoHorario, as: "tipo_horario" }],
        },
      ],
    });

    // VERIFICAMOS SI LA CONTRASEÑA PROPORCIONADA ES CORRECTA.
    const validarContrasenia = await bcryptjs.compare(
      contrasenia,
      empleado.usuario.contrasenia
    );

    //VERIFICA LA CONTRASÑA
    if (!validarContrasenia) {
      //RETORNAMOS MENSAJE DE ERROR
      return res.status(400).json({
        ok: false,
        msg: "Usuario o contraseña no son correctos.",
      });
    }
    //Generar el JWT
    const token = await generarJWT(empleado.usuario.id_cat_usuario);

    empleado.usuario.token = token;

    // GUARDAMOS LOS CAMBIOS EN LA BASE DE DATOS.
    await empleado.usuario.save();

    // EN CASO DE ÉXITO, SE ENVÍA UNA RESPUESTA POSITIVA JUNTO CON LA INFORMACIÓN DEL USUARIO.
    res.status(200).json({
      ok: true,
      results: empleado,
    });
  } catch (error) {
    // MANEJO DE ERRORES, SE IMPRIME EL ERROR EN LA CONSOLA Y SE ENVÍA UNA RESPUESTA DE ERROR AL CLIENTE.
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Ha ocurrido un error, hable con el Administrador.",
    });
  }
};

/**
 * MANEJA EL PROCESO DE INICIO DE SESIÓN PARA UN USUARIO.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const recuperarContrasenia = async (req, res = response) => {
  try {
    const { correo, asunto = "Solicitud de cambio de contraseña" } = req.body;

    let {
      mensaje = `Usted ha solicitado restablecer su contraseña. <br> Por favor ingresa y confirma tu nueva contraseña en el siguiente formulario:`,
    } = req.body;

    // Se construye el formulario
    const resetForm = `
    <form style="max-width: 500px; margin: 0 auto; border: 2px solid #ccc; padding: 20px;" method="GET" action="${process.env.IP}/api/usuario/cambiarContrasenia/${correo}">
      <h2 style="text-align: center;">Restablecer contraseña</h2>
      <label style="display:block; margin-bottom: 10px; color: #003366;" for="password">Nueva contraseña:</label>
      <input style="display: block; padding: 10px; width: 95%; border-radius: 4px; border: 2px solid #003366;" type="password" id="password" name="password" placeholder="New Password">
      <br>
      <label style="display:block; margin-bottom: 10px; color: #003366;" for="password">Confirma tu contraseña:</label>
      <input style="display: block; padding: 10px; width: 95%; border-radius: 4px; border: 2px solid #003366;" type="password" id="passwordConfim" name="passwordConfirm" placeholder="New Password">
      <button style="display: block; margin: 20px auto 0; padding: 10px; background-color: #003366; color: #fff; border-radius: 4px; border: none;" type="submit">
        Cambiar contraseña
      </button>
    </form>
  
  `;

    /**
   * <tr>
          <td style="text-align: center;">
            <div style="width: 100%; display: flex;">
              <div style="width: 50%;">
                <img src="https://res.cloudinary.com/ddem1jb7m/image/upload/v1706804214/ITSmartS_azul_1_ifgtfb.png">
              </div>
              <span style="display: inline-block; border-left: 2px solid #173366; height: 15px; vertical-align: middle;">
              </span>
              <div style="width: 50%; position: relative;">
                <img src="https://res.cloudinary.com/ddem1jb7m/image/upload/v1706804214/Logo_2_1_ocdjvt.png">
              </div>
            </div>
            <div style="width: 100%; height: 1px; background-color: #003366; position: absolute; bottom: 0;"></div>
          </td>
        </tr>
   */

    const html = `
    <div>
      <table width="500" align="center">
        <tr>
          <td style="text-align: center">
            <div style="position: relative">
              <div style="position: absolute; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                <img style="margin-left: 50px;margin-right: 8px;margin-top: 2px;width: 100px; height: 27px" src="https://res.cloudinary.com/ddem1jb7m/image/upload/v1706804214/ITSmartS_azul_1_ifgtfb.png" />
                <span style="display: inline-block; border-left: 2px solid #173366; height: 28px; vertical-align: middle;">
                </span>
                <img style=" margin-left: 10px;margin-top: 7px;width: 45px; height: 17px" src="https://res.cloudinary.com/ddem1jb7m/image/upload/v1706804214/Logo_2_1_ocdjvt.png" />
              </div>
            <div style="position: absolute; border: 1px #173366 solid"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">    
            <h1 style="display:block; color: #003366;" for="password">Cambio de contraseña</h1>
            <p style="font-size: 15px;">
              Buen día ${correo}. ${mensaje}
            </p>
            ${resetForm}
            <p style="font-size: 15px;">
              Atentamente, equipo de Soporte Técnico ItsMarts<br>
              support@itsmarts.com.mx
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;

    const mailOptions = {
      from: '"Soporte" <soporte@midominio.com>',
      to: correo,
      subject: asunto,
      html: html,
    };

    await transporter.sendMail(mailOptions);

    mensaje = `Ha solicitado restablecer su contraseña.`;
    mensaje = `<div style="background-color:#e0e0e0; padding: 20px; border-radius: 5px;"> <h3 style="color: #808080;">El usuario: ${correo},</h3> <p style="line-height: 1.5;">${mensaje}</p> </div>`;

    const mailOptions1 = {
      from: '"Soporte" <soporte@midominio.com>',
      to: "juancarlosruizgomez2000@gmail.com",
      subject: asunto,
      html: mensaje,
    };

    await transporter.sendMail(mailOptions1);

    res.json({ ok: true, msg: "Email sent successfully" });
  } catch (error) {
    // MANEJO DE ERRORES: IMPRIME EL ERROR EN LA CONSOLA Y RESPONDE CON UN ERROR HTTP 500.
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "HA OCURRIDO UN ERROR, HABLE CON EL ADMINISTRADOR.",
    });
  }
};

/**
 * MANEJA EL PROCESO DE INICIO DE SESIÓN PARA UN USUARIO.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const bloquearUsuario = async (req, res) => {
  const { correo } = req.body;
  try {
    // BUSCAMOS AL USUARIO DENTRO DE LA BASE DE DATOS.
    const usuario = await Usuario.findOne({ where: { correo } });

    // VERIFICA SI EL USUARIO ESTÁ ACTIVO.
    if (usuario.estatus == 2) {
      //RETORNAMOS MENSAJE DE ERROR
      return res.status(400).json({
        ok: false,
        msg: "Usuario ya bloqueado",
      });
    }

    usuario.estatus = 2;

    // GUARDAMOS LOS CAMBIOS EN LA BASE DE DATOS.
    await usuario.save();

    // EN CASO DE ÉXITO, SE ENVÍA UNA RESPUESTA POSITIVA JUNTO CON LA INFORMACIÓN DEL USUARIO.
    res.status(200).json({
      ok: true,
      results: usuario,
    });
  } catch (error) {
    // MANEJO DE ERRORES, SE IMPRIME EL ERROR EN LA CONSOLA Y SE ENVÍA UNA RESPUESTA DE ERROR AL CLIENTE.
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Ha ocurrido un error, hable con el Administrador.",
    });
  }
};

/**
 * ACTIVA UN CLIENTE INACTIVO CAMBIANDO SU ESTATUS A 1.
 * @param {Object} req - Objeto de solicitud de Express con parámetros de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const usuarioActivar = async (req, res) => {
  const { correo } = req.body;
  try {
    // BUSCAMOS AL USUARIO DENTRO DE LA BASE DE DATOS.
    const usuario = await Usuario.findOne({ where: { correo } });

    // VERIFICA SI EL USUARIO ESTÁ ACTIVO.
    if (usuario.estatus == 1) {
      //RETORNAMOS MENSAJE DE ERROR
      return res.status(400).json({
        ok: false,
        msg: "Usuario ya activo",
      });
    }

    usuario.estatus = 1;

    // GUARDAMOS LOS CAMBIOS EN LA BASE DE DATOS.
    await usuario.save();

    // EN CASO DE ÉXITO, SE ENVÍA UNA RESPUESTA POSITIVA JUNTO CON LA INFORMACIÓN DEL USUARIO.
    res.status(200).json({
      ok: true,
      results: usuario,
    });
  } catch (error) {
    // MANEJO DE ERRORES, SE IMPRIME EL ERROR EN LA CONSOLA Y SE ENVÍA UNA RESPUESTA DE ERROR AL CLIENTE.
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Ha ocurrido un error, hable con el Administrador.",
    });
  }
};

/**
 * MANEJA EL PROCESO DE INICIO DE SESIÓN PARA UN USUARIO.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const cambiarContrasenia = async (req, res = response) => {
  try {
    const { correo } = req.params;
    // obtener datos del body
    let { password, passwordConfirm } = req.query;

    if (password !== passwordConfirm) {
      return res.status(400).json({
        ok: false,
        msg: "Error passwords diferentes intente de nuevo",
      });
    }

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    password = bcryptjs.hashSync(password, salt);

    // Buscar el usuario por correo
    const usuario = await Usuario.findOne({ where: { correo } });

    // Actualizar la contraseña
    usuario.contrasenia = password;
    await usuario.save();

    res.redirect(`${process.env.IP}/pagina.html`);
  } catch (error) {
    // MANEJO DE ERRORES: IMPRIME EL ERROR EN LA CONSOLA Y RESPONDE CON UN ERROR HTTP 500.
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "HA OCURRIDO UN ERROR, HABLE CON EL ADMINISTRADOR.",
    });
  }
};

/**
 * MANEJA EL PROCESO DE INICIO DE SESIÓN PARA UN USUARIO.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Respuesta con estado y mensaje JSON.
 */
const cerrarSesion = async (req, res) => {
  // EXTRAE EL CORREO DEL CUERPO DE LA SOLICITUD.
  const { correo } = req.body;

  try {
    // BUSCAMOS AL USUARIO DENTRO DE LA BASE DE DATOS.
    const usuario = await Usuario.findOne({ where: { correo } });

    usuario.token = "";

    // GUARDAMOS LOS CAMBIOS EN LA BASE DE DATOS.
    await usuario.save();

    // EN CASO DE ÉXITO, SE ENVÍA UNA RESPUESTA POSITIVA JUNTO CON LA INFORMACIÓN DEL USUARIO.
    res.status(200).json({
      ok: true,
      results: usuario,
    });
  } catch (error) {
    // MANEJO DE ERRORES, SE IMPRIME EL ERROR EN LA CONSOLA Y SE ENVÍA UNA RESPUESTA DE ERROR AL CLIENTE.
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Ha ocurrido un error, hable con el Administrador.",
    });
  }
};

// EXPORTA LA FUNCIÓN INICIOSESION PARA SER UTILIZADA EN OTROS ARCHIVOS.
module.exports = {
  inicioSesion,
  recuperarContrasenia,
  cambiarContrasenia,
  bloquearUsuario,
  usuarioActivar,
  cerrarSesion,
};
