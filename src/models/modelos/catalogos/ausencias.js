const { Sequelize, DataTypes } = require("sequelize");
const pool = require("../../../database/config");

const Empleado = require("../catalogos/empleado");

const Ausencia = pool.define(
  "cat_ausencias",
  {
    id_cat_ausencia: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: {
      type: Sequelize.DATE,
    },
    descripcion: {
      type: Sequelize.STRING,
    },
    fk_cat_empleado: {
      type: Sequelize.INTEGER,
      references: {
        model: Empleado,
        key: "id_cat_empleado",
      },
    },
  },
  {
    timestamps: false,
  }
);

Ausencia.belongsTo(Empleado, { foreignKey: "fk_cat_empleado", as: "empleado" });

module.exports = Ausencia;
