const path = require("path");
const fs = require("fs");
const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const Empleado = require("../models/modelos/catalogos/empleado");
const EquipoTrabajo = require("../models/modelos/catalogos/equipoTrabajo");

const cargarArchivo = async (req, res = response) => {
  try {
    //txt, md
    //const nombre = await subirArchivo(req.files, ["txt", "md"], "textos");
    const nombre = await subirArchivo(req.files, undefined, "imgs");
    res.json({ nombre });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      results: { msg: "HA OCURRIDO UN ERROR, HABLE CON EL ADMINISTRADOR." },
    });
  }
};

const actualizarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "empleado":
      modelo = await Empleado.findByPk(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un empleado con el id ${id}` });
      }
      break;
    case "equipo":
      modelo = await EquipoTrabajo.findByPk(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un equipo_trabajo con el id ${id}` });
      }
      break;
    default:
      return res
        .status(500)
        .json({ ok: false, results: { msg: "Se me olvido validar esto" } });
  }
  //Limpiar imagenes previas
  if (modelo.imagen) {
    const pathImagen = path.join(
      __dirname,
      "../uploads/",
      coleccion,
      modelo.imagen
    );
    if (fs.existsSync(pathImagen)) {
      try {
        fs.unlinkSync(pathImagen);
      } catch (error) {
        console.log(error);
        res.status(400).json({
          ok: false,
          results: { msg: "HA OCURRIDO UN ERROR, HABLE CON EL ADMINISTRADOR." },
        });
      }
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.imagen = nombre;

  await modelo.save();

  res.status(200).json({ ok: true, results: { modelo } });
};

const mostrarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;
  let modelo;

  switch (coleccion) {
    case "empleado":
      modelo = await Empleado.findByPk(id);
      if (!modelo) {
        return res.status(400).json({
          ok: false,
          results: { msg: `No existe un empleado con el id ${id}` },
        });
      }
      break;
    case "equipo":
      modelo = await EquipoTrabajo.findByPk(id);
      if (!modelo) {
        return res.status(400).json({
          ok: false,
          results: { msg: `No existe un equipo con el id ${id}` },
        });
      }
      break;
    default:
      return res
        .status(500)
        .json({ ok: false, results: { msg: "Se me olvido validar esto" } });
  }
  //Limpiar imagenes previas
  if (modelo.imagen) {
    const pathImagen = path.join(
      __dirname,
      "../uploads/",
      coleccion,
      modelo.imagen
    );
    if (fs.existsSync(pathImagen)) {
      try {
        return res.sendFile(pathImagen);
      } catch (error) {
        console.log(error);
        res.status(400).json({
          ok: false,
          results: { msg: "HA OCURRIDO UN ERROR, HABLE CON EL ADMINISTRADOR." },
        });
      }
    }
  }

  const pathImagen = path.join(__dirname, "../assets/no-image.jpg");
  res.status(200).sendFile(pathImagen);
};

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
};
