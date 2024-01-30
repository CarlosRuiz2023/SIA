const { Sequelize, DataTypes } = require("sequelize");
const pool = require("../../../database/config");
const Etapa = require("../catalogos/etapa");
const Actividades = require("../catalogos/actividades");

const DetalleEtapaActividad = pool.define(
  "etapa_actividades",
  {
    id_detalle_etapa_actividad: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fk_cat_etapa: {
      type: DataTypes.INTEGER,
      references: {
        model: Etapa,
        key: "id_cat_etapa",
      },
    },
    fk_cat_actividad: {
      type: DataTypes.INTEGER,
      references: {
        model: Actividades,
        key: "id_cat_actividad",
      },
    },
    fecha: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    estatus: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "detalle_etapa_actividad",
  }
);

// Establece las relaciones many-to-one
Etapa.hasMany(DetalleEtapaActividad, {
  foreignKey: "fk_cat_etapa",
});
DetalleEtapaActividad.belongsTo(Etapa, {
  foreignKey: "fk_cat_etapa",
});
Actividades.hasMany(DetalleEtapaActividad, {
  foreignKey: "fk_cat_actividad",
});
DetalleEtapaActividad.belongsTo(Actividades, {
  foreignKey: "fk_cat_actividad",
});

module.exports = DetalleEtapaActividad;
