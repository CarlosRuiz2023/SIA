const { Sequelize, DataTypes } = require('sequelize');
const pool = require('../../../database/config');

const Permiso = pool.define('cat_permiso', { 
    id_cat_permiso: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    permiso: {
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
    tableName: 'cat_permiso', 
});

module.exports = Permiso;
