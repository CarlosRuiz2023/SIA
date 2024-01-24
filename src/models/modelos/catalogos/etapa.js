const { Sequelize } = require("sequelize");
const pool = require("../../../database/config");

const Etapa = pool.define(
  "cat_etapas",
  {
    id_cat_etapa: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    etapa: {
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
    tableName: "cat_etapas",
  }
);

module.exports = Etapa;
