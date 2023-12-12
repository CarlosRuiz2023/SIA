// roles.js
// roles.js
const { Sequelize, DataTypes } = require('sequelize');  // Asegúrate de importar Sequelize aquí
const pool = require('../../../database/config');
// const DetalleUsuarioRol = require('../detalles/detalle_usuario_rol');

const Roles = pool.define('cat_roles', {
    id_cat_rol: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    rol: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    descripccion: {
        type: Sequelize.STRING,
    },
    estatus: {
        type: Sequelize.INTEGER,
    }
}, {
    timestamps: false,
    tableName: 'cat_roles',
});

module.exports = Roles; 