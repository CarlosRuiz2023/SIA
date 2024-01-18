const { Sequelize } = require("sequelize");
const pool = require("../../../database/config");

const EntradaSalida = pool.define(
  "cat_entrada_salida",
  {
    id_cat_entrada_salida: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_entrada_salida: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    hora: {
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
    tableName: "cat_entrada_salida",
  }
);

module.exports = EntradaSalida;
