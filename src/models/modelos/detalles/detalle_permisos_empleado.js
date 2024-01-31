// detalle_usuario_rol.js
const { Sequelize, DataTypes } = require("sequelize");
const pool = require("../../../database/config");

const Permisos = require("../catalogos/permisos");
const Empleado = require("../catalogos/empleado");

const DetallePermisosEmpleado = pool.define(
  "detalle_permisos_empleado",
  {
    id_detalle_permisos_empleado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha_permiso: {
      type: Sequelize.DATE,
    },
    tiempo_horas: {
      type: Sequelize.INTEGER,
    },
    estatus: {
      type: Sequelize.INTEGER,
    },
    fk_cat_empleado: {
      type: DataTypes.INTEGER,
      references: {
        model: Empleado,
        key: "id_cat_empleado",
      },
    },
    fk_cat_permiso: {
      type: DataTypes.INTEGER,
      references: {
        model: Permisos,
        key: "id_cat_permiso",
      },
    },
    detalle: {
      type: Sequelize.STRING,
    },
    fecha_solicitada: {
      type: Sequelize.DATE,
    },
    hora_solicitada: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: false,
    tableName: "detalle_permisos_empleado",
  }
);

DetallePermisosEmpleado.belongsTo(Empleado, {
  foreignKey: "fk_cat_empleado",
  as: "empleado",
});
DetallePermisosEmpleado.belongsTo(Permisos, {
  foreignKey: "fk_cat_permiso",
  as: "permiso",
});

module.exports = DetallePermisosEmpleado;
