// detalle_usuario_rol.js
const { Sequelize, DataTypes } = require("sequelize");
const pool = require("../../../database/config");
const Proyectos = require("../catalogos/proyectos");
const Etapa = require("../catalogos/etapa");

const DetalleProyectoEtapa = pool.define(
  "proyecto_etapas",
  {
    id_detalle_proyecto_etapa: {
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
    fk_cat_etapa: {
      type: DataTypes.INTEGER,
      references: {
        model: Etapa,
        key: "id_cat_etapa",
      },
    },
  },
  {
    timestamps: false,
    tableName: "detalle_proyecto_etapas",
  }
);

// Establece las relaciones many-to-one
Proyectos.hasMany(DetalleProyectoEtapa, {
  foreignKey: "fk_cat_proyecto",
});
DetalleProyectoEtapa.belongsTo(Proyectos, {
  foreignKey: "fk_cat_proyecto",
});

Etapa.hasMany(DetalleProyectoEtapa, {
  foreignKey: "fk_cat_etapa",
});
DetalleProyectoEtapa.belongsTo(Etapa, {
  foreignKey: "fk_cat_etapa",
});

module.exports = DetalleProyectoEtapa;
