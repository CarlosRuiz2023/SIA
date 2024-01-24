// detalle_usuario_rol.js
const { Sequelize, DataTypes } = require("sequelize");
const pool = require("../../../database/config");
const Proyectos = require("../catalogos/proyectos");
const EquipoTrabajo = require("../catalogos/equipoTrabajo");

const DetalleProyectoEquipoTrabajo = pool.define(
  "proyecto_equipos_trabajos",
  {
    id_detalle_proyecto_equipo_trabajo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fk_cat_proyecto: {
      type: DataTypes.INTEGER,
      references: {
        model: Proyectos,
        key: "id_cat_proyecto",
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
    tableName: "detalle_proyecto_equipo_trabajo",
  }
);

// Establece las relaciones many-to-one
Proyectos.hasMany(DetalleProyectoEquipoTrabajo, {
  foreignKey: "fk_cat_proyecto",
});
DetalleProyectoEquipoTrabajo.belongsTo(Proyectos, {
  foreignKey: "fk_cat_proyecto",
});

EquipoTrabajo.hasMany(DetalleProyectoEquipoTrabajo, {
  foreignKey: "fk_cat_equipo_trabajo",
});
DetalleProyectoEquipoTrabajo.belongsTo(EquipoTrabajo, {
  foreignKey: "fk_cat_equipo_trabajo",
});

module.exports = DetalleProyectoEquipoTrabajo;
