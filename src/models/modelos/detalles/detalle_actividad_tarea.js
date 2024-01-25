// detalle_usuario_rol.js
const { Sequelize, DataTypes } = require("sequelize");
const pool = require("../../../database/config");
const Actividades = require("../catalogos/actividades");
const Empleado = require("../catalogos/empleado");
const DetalleActividadTarea = pool.define(
  "actividad_tareas",
  {
    id_detalle_actividad_tarea: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fk_cat_actividad: {
      type: DataTypes.INTEGER,
      references: {
        model: Actividades,
        key: "id_cat_actividad",
      },
    },
    fk_cat_empleado: {
      type: DataTypes.INTEGER,
      references: {
        model: Empleado,
        key: "id_cat_empleado",
      },
    },
    tarea: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    estatus: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    duracion: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "detalle_actividad_tarea",
  }
);

// Establece las relaciones many-to-one
Actividades.hasMany(DetalleActividadTarea, { foreignKey: "fk_cat_actividad" });
DetalleActividadTarea.belongsTo(Actividades, {
  foreignKey: "fk_cat_actividad",
});

Empleado.hasMany(DetalleActividadTarea, {
  foreignKey: "fk_cat_empleado",
});
DetalleActividadTarea.belongsTo(Empleado, {
  foreignKey: "fk_cat_empleado",
});

module.exports = DetalleActividadTarea;
