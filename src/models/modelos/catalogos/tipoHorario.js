const { Sequelize } = require("sequelize");
const pool = require("../../../database/config");

const TipoHorario = pool.define(
  "cat_tipo_horario",
  {
    id_cat_tipo_horario: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipo_horario: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    descripcion: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    jornada: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    hora_entrada: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    hora_salida: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "cat_tipo_horario",
  }
);

module.exports = TipoHorario;
