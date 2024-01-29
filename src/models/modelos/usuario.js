// usuario.js
const { Sequelize, DataTypes } = require("sequelize");
const pool = require("../../database/config");
//const DetalleUsuarioRol = require('../modelos/detalles/detalle_usuario_rol');

const Usuario = pool.define(
  "cat_usuarios",
  {
    id_cat_usuario: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    correo: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    contrasenia: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    token: {
      type: Sequelize.STRING,
    },
    estatus: {
      type: Sequelize.INTEGER,
    },
    contrasenia1: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Usuario;
