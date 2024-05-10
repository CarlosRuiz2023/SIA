// detalle_usuario_rol.js
const { Sequelize, DataTypes } = require("sequelize");
const pool = require("../../../database/config");
const Proyectos = require("../catalogos/proyectos");
const Cliente = require("../catalogos/cliente");

const DetalleClienteProyectos = pool.define(
  "cliente_proyectos",
  {
    id_detalle_cliente_proyecto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fk_cat_cliente: {
      type: DataTypes.INTEGER,
      references: {
        model: Cliente,
        key: "id_cat_cliente",
      },
    },
    fk_cat_proyecto: {
      type: DataTypes.INTEGER,
      references: {
        model: Proyectos,
        key: "id_cat_proyecto",
      },
    },
  },
  {
    timestamps: false,
    tableName: "detalle_cliente_proyectos",
  }
);

// Establece las relaciones many-to-one
Proyectos.hasMany(DetalleClienteProyectos, {
  foreignKey: "fk_cat_proyecto",
});
DetalleClienteProyectos.belongsTo(Proyectos, {
  foreignKey: "fk_cat_proyecto",
});

Cliente.hasMany(DetalleClienteProyectos, {
  foreignKey: "fk_cat_cliente",
});
DetalleClienteProyectos.belongsTo(Cliente, {
  foreignKey: "fk_cat_cliente",
});

module.exports = DetalleClienteProyectos;
