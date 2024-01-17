const { Sequelize } = require("sequelize");
const pool = require("../../../database/config");

const Eventos = pool.define(
  "cat_eventos",
  {
    id_cat_eventos: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    evento: {
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
    tableName: "cat_eventos",
  }
);

module.exports = Eventos;
