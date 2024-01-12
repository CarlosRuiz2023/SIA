const { Sequelize, DataTypes } = require('sequelize');
const pool = require('../../../database/config');

const Modulo = pool.define('cat_modulos', { 
    id_cat_modulo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    modulo: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    descripccion: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    estatus: {
        type: Sequelize.INTEGER,
    },
}, {
    timestamps: false,
    tableName: 'cat_modulos', 
});

module.exports = Modulo;
