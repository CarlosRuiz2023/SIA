// detalle_usuario_rol.js
const { Sequelize, DataTypes } = require('sequelize');
const pool = require('../../../database/config');
const Usuario = require('../usuario');
const Roles = require('../catalogos/roles');
const DetalleUsuarioRol = pool.define('detalle_usuario_rol', {
    id_detalle_usuario_rol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fk_cat_usuario: {
        type: DataTypes.INTEGER,
        references: {
            model: Usuario,
            key: 'id_cat_usuario',
        },
    },
    fk_cat_rol: {
        type: DataTypes.INTEGER,
        references: {
            model: Roles,
            key: 'id_cat_rol',
        },
    },
}, {
    timestamps: false,
    tableName: 'detalle_usuario_rol',
});

// Establece las relaciones many-to-one
Usuario.hasMany(DetalleUsuarioRol, { foreignKey: 'fk_cat_usuario' });
DetalleUsuarioRol.belongsTo(Usuario, { foreignKey: 'fk_cat_usuario' });

Roles.hasMany(DetalleUsuarioRol, { foreignKey: 'fk_cat_rol' });
DetalleUsuarioRol.belongsTo(Roles, { foreignKey: 'fk_cat_rol' });

module.exports = DetalleUsuarioRol;
