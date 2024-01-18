const { Sequelize } = require("sequelize");
const pool = require("../../../database/config");

const Dias = pool.define(
  "cat_dias",
  {
    id_cat_dias: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dia: {
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
    tableName: "cat_dias",
  }
);

module.exports = Dias;
