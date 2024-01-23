const { Sequelize } = require("sequelize");
const pool = require("../../../database/config");

const EquipoTrabajo = pool.define(
  "cat_equipo_trabajo",
  {
    id_cat_equipo_trabajo: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    equipo_trabajo: {
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
    tableName: "cat_equipo_trabajo",
  }
);

module.exports = EquipoTrabajo;
