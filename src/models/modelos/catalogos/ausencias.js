const { Sequelize, DataTypes } = require("sequelize");
const pool = require("../../../database/config");

const Empleado = require("../catalogos/empleado");
const Permisos = require("./permisos");
const Dias = require("./dias");

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
    fk_cat_dia: {
      type: Sequelize.INTEGER,
      references: {
        model: Dias,
        key: "id_cat_dias",
      },
    },
  },
  {
    timestamps: false,
  }
);

Ausencia.belongsTo(Empleado, { foreignKey: "fk_cat_empleado", as: "empleado" });
Ausencia.belongsTo(Permisos, { foreignKey: "fk_cat_permiso", as: "permiso" });
Ausencia.belongsTo(Dias, { foreignKey: "fk_cat_dia", as: "dia" });

module.exports = Ausencia;
