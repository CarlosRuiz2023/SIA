const { Sequelize } = require("sequelize");
const pool = require("../../../database/config");
const TipoHorario = require("./tipoHorario");

const PuestoTrabajo = pool.define(
  "cat_puesto_trabajos",
  {
    id_cat_puesto_trabajo: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    puesto: {
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
    fk_cat_tipo_horario: {
      type: Sequelize.INTEGER,
      references: {
        model: TipoHorario,
        key: "id_cat_tipo_horario",
      },
    },
  },
  {
    timestamps: false,
    tableName: "cat_puesto_trabajos",
  }
);

PuestoTrabajo.belongsTo(TipoHorario, {
  foreignKey: "fk_cat_tipo_horario",
  as: "tipo_horario",
});

module.exports = PuestoTrabajo;
