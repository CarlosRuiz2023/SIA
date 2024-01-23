const { Sequelize } = require("sequelize");
const pool = require("../../../database/config");

const Actividades = pool.define(
  "cat_actividades",
  {
    id_cat_actividad: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    actividad: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    descripcion: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    estatus: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "cat_actividades",
  }
);

module.exports = Actividades;
