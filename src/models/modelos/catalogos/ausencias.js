const { Sequelize, DataTypes } = require("sequelize");
const pool = require("../../../database/config");

const Empleado = require("../catalogos/empleado");
const Permisos = require("./permisos");

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
    fk_cat_permiso: {
      type: Sequelize.INTEGER,
      references: {
        model: Permisos,
        key: "id_cat_permiso",
      },
    },
    estatus: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Ausencia.belongsTo(Empleado, { foreignKey: "fk_cat_empleado", as: "empleado" });
Ausencia.belongsTo(Permisos, { foreignKey: "fk_cat_permiso", as: "permiso" });

module.exports = Ausencia;
