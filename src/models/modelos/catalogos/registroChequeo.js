const { Sequelize } = require("sequelize");
const pool = require("../../../database/config");

const Empleado = require("./empleado");
const Usuario = require("../usuario");
const DetalleDiasEntradaSalida = require("../detalles/detalle_dias_entrada_salida");
const Eventos = require("./eventos");

const RegistroChequeo = pool.define(
  "cat_registro_chequeo",
  {
    id_cat_registro_chequeo: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    hora: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    tiempo_retardo: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    fk_cat_eventos: {
      type: Sequelize.INTEGER,
      references: {
        model: Eventos,
        key: "id_cat_eventos",
      },
    },
    fk_cat_empleado: {
      type: Sequelize.INTEGER,
      references: {
        model: Empleado,
        key: "id_cat_empleado",
      },
    },
    fk_detalle_dias_entrada_salida: {
      type: Sequelize.INTEGER,
      references: {
        model: DetalleDiasEntradaSalida,
        key: "id_detalle_entrada_salida",
      },
    },
  },
  {
    timestamps: false,
    tableName: "cat_registro_chequeo",
  }
);

RegistroChequeo.belongsTo(Eventos, {
  foreignKey: "fk_cat_eventos",
  as: "evento",
});
RegistroChequeo.belongsTo(Empleado, {
  foreignKey: "fk_cat_empleado",
  as: "empleado",
});
RegistroChequeo.belongsTo(DetalleDiasEntradaSalida, {
  foreignKey: "fk_detalle_dias_entrada_salida",
  as: "detalleDiasEntradaSalida",
});

module.exports = RegistroChequeo;
