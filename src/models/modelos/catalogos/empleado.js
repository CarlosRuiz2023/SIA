const { Sequelize, DataTypes } = require("sequelize");
const pool = require("../../../database/config");

const Persona = require("../catalogos/persona");
const Usuario = require("../usuario");
const PuestoTrabajo = require("./puestoTrabajo");

const Empleado = pool.define(
  "cat_empleados",
  {
    id_cat_empleado: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numero_empleado: {
      type: Sequelize.STRING,
    },
    sueldo: {
      type: Sequelize.STRING,
    },
    fecha_nacimiento: {
      type: Sequelize.STRING,
    },
    fecha_Contratacion: {
      type: Sequelize.STRING,
    },
    fecha_Retiro: {
      type: Sequelize.STRING,
    },
    estatus: {
      type: Sequelize.INTEGER,
    },
    fk_cat_persona: {
      type: Sequelize.INTEGER,
      references: {
        model: Persona,
        key: "id_cat_persona",
      },
    },
    fk_cat_usuario: {
      type: Sequelize.INTEGER,
      references: {
        model: Usuario,
        key: "id_cat_usuario",
      },
    },
    fk_cat_puesto_trabajo: {
      type: Sequelize.INTEGER,
      references: {
        model: PuestoTrabajo,
        key: "id_cat_puesto_trabajo",
      },
    },
    fk_cat_vacaciones: {
      type: Sequelize.INTEGER,
    },
    fk_cat_tolerancia: {
      type: Sequelize.INTEGER,
    },
  },
  {
    timestamps: false,
  }
);

Empleado.belongsTo(Persona, { foreignKey: "fk_cat_persona", as: "persona" });
Empleado.belongsTo(Usuario, { foreignKey: "fk_cat_usuario", as: "usuario" });
Empleado.belongsTo(PuestoTrabajo, {
  foreignKey: "fk_cat_puesto_trabajo",
  as: "puesto_trabajo",
});

module.exports = Empleado;
