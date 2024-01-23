const { Sequelize } = require("sequelize");
const pool = require("../../../database/config");

const Proyectos = pool.define(
  "cat_proyectos",
  {
    id_cat_proyecto: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    proyecto: {
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
    fecha_inicio: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    fecha_fin: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    horas_maximas: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "cat_proyectos",
  }
);

module.exports = Proyectos;
