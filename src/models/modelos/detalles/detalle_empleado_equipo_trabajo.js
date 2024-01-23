// detalle_usuario_rol.js
const { Sequelize, DataTypes } = require("sequelize");
const pool = require("../../../database/config");

const Empleado = require("../catalogos/empleado");
const EquipoTrabajo = require("../catalogos/equipoTrabajo");

const DetalleEmpleadoEquipoTrabajo = pool.define(
  "detalle_empleado_equipo_trabajo",
  {
    id_detalle_empleado_equipo_trabajo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fk_cat_empleado: {
      type: DataTypes.INTEGER,
      references: {
        model: Empleado,
        key: "id_cat_empleado",
      },
    },
    fk_cat_equipo_trabajo: {
      type: DataTypes.INTEGER,
      references: {
        model: EquipoTrabajo,
        key: "id_cat_equipo_trabajo",
      },
    },
  },
  {
    timestamps: false,
    tableName: "detalle_empleado_equipo_trabajo",
  }
);

// Establece las relaciones many-to-one
Empleado.hasMany(DetalleEmpleadoEquipoTrabajo, {
  foreignKey: "fk_cat_empleado",
});
DetalleEmpleadoEquipoTrabajo.belongsTo(Empleado, {
  foreignKey: "fk_cat_empleado",
});

EquipoTrabajo.hasMany(DetalleEmpleadoEquipoTrabajo, {
  foreignKey: "fk_cat_equipo_trabajo",
});
DetalleEmpleadoEquipoTrabajo.belongsTo(EquipoTrabajo, {
  foreignKey: "fk_cat_equipo_trabajo",
});

module.exports = DetalleEmpleadoEquipoTrabajo;
