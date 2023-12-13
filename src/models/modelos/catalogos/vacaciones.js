const {Sequelize} = require('sequelize');
const pool = require('../../../database/config');

const Vacaciones = pool.define('cat_vacaciones', {
    id_cat_vacacion:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    vacacion: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    dias: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    estatus: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: 'cat_vacaciones', 
});

module.exports = Vacaciones;