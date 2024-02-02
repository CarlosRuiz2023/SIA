const { Sequelize } = require("sequelize");
const pool = require("../../../database/config");
const EquipoTrabajo = require("./equipoTrabajo");

const Actividades = pool.define(
  "cat_actividades",
  {
    id_cat_actividad: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    actividad: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    descripcion: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    estatus: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    fk_cat_equipo_trabajo: {
      type: Sequelize.INTEGER,
      references: {
        model: EquipoTrabajo,
        key: "id_cat_equipo_trabajo",
      },
    },
  },
  {
    timestamps: false,
    tableName: "cat_actividades",
  }
);

Actividades.belongsTo(EquipoTrabajo, {
  foreignKey: "fk_cat_equipo_trabajo",
  as: "equipo_trabajo",
});

module.exports = Actividades;
