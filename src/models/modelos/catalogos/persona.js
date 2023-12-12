const { Sequelize, DataTypes } = require('sequelize');
const pool = require('../../../database/config');

const Persona = pool.define('cat_persona', { 
    id_cat_persona: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    apellido_Paterno: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    apellido_Materno: {
        type: Sequelize.STRING,
    },
    direccion: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    estatus: {
        type: Sequelize.INTEGER,
    },
}, {
    timestamps: false,
    tableName: 'cat_persona', 
});

module.exports = Persona;
