const { Sequelize, DataTypes } = require('sequelize');
const pool = require('../../../database/config');

const SubModulo = pool.define('cat_sub_modulos', { 
    id_cat_sub_modulo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sub_modulo: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    descripcion: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    estatus: {
        type: Sequelize.INTEGER,
    },
}, {
    timestamps: false,
    tableName: 'cat_sub_modulos', 
});

module.exports = SubModulo;
