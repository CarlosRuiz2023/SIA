// detalle_usuario_rol.js
const { Sequelize, DataTypes } = require("sequelize");
const pool = require("../../../database/config");
const Dias = require("../catalogos/dias");
const EntradaSalida = require("../catalogos/entradaSalida");
const TipoHorario = require("../catalogos/tipoHorario");
const DetalleDiasEntradaSalida = pool.define(
  "detalle_dias_entrada_salida",
  {
    id_detalle_entrada_salida: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fk_cat_dias: {
      type: DataTypes.INTEGER,
      references: {
        model: Dias,
        key: "id_cat_dias",
      },
    },
    fk_cat_entrada_salida: {
      type: DataTypes.INTEGER,
      references: {
        model: EntradaSalida,
        key: "id_cat_entrada_salida",
      },
    },
    fk_cat_tipo_horario: {
      type: DataTypes.INTEGER,
      references: {
        model: TipoHorario,
        key: "id_cat_tipo_horario",
      },
    },
  },
  {
    timestamps: false,
    tableName: "detalle_dias_entrada_salida",
  }
);

// Establece las relaciones many-to-one
Dias.hasMany(DetalleDiasEntradaSalida, { foreignKey: "fk_cat_dias" });
DetalleDiasEntradaSalida.belongsTo(Dias, { foreignKey: "fk_cat_dias" });

EntradaSalida.hasMany(DetalleDiasEntradaSalida, {
  foreignKey: "fk_cat_entrada_salida",
});
DetalleDiasEntradaSalida.belongsTo(EntradaSalida, {
  foreignKey: "fk_cat_entrada_salida",
});

TipoHorario.hasMany(DetalleDiasEntradaSalida, {
  foreignKey: "fk_cat_tipo_horario",
});
DetalleDiasEntradaSalida.belongsTo(TipoHorario, {
  foreignKey: "fk_cat_tipo_horario",
});

module.exports = DetalleDiasEntradaSalida;
