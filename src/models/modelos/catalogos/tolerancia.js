const {Sequelize} = require('sequelize');
const pool = require('../../../database/config');

const Tolerancia = pool.define('cat_tolerancia', {
    id_cat_tolerancia:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tolerancia: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    tiempo_tolerancia: {
        type: Sequelize.TIME,
        allowNull: false,
    },
    estatus: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: 'cat_tolerancia', 
});

module.exports = Tolerancia;