// detalle_usuario_rol.js
const { Sequelize, DataTypes } = require('sequelize');
const pool = require('../../../database/config');
const Roles = require('../catalogos/roles');
const Modulo = require('../catalogos/modulo');

const DetalleRolModulo = pool.define('detalle_rol_modulo', {
    id_detalle_rol_modulo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fk_cat_rol: {
        type: DataTypes.INTEGER,
        references: {
            model: Roles,
            key: 'id_cat_rol',
        },
    },
    fk_cat_modulo: {
        type: DataTypes.INTEGER,
        references: {
            model: Modulo,
            key: 'id_cat_modulo',
        },
    },
}, {
    timestamps: false,
    tableName: 'detalle_rol_modulo',
    
});

Roles.hasMany(DetalleRolModulo, { foreignKey: 'fk_cat_rol' });
DetalleRolModulo.belongsTo(Roles, { foreignKey: 'fk_cat_rol' });

Modulo.hasMany(DetalleRolModulo, { foreignKey: 'fk_cat_modulo' });
DetalleRolModulo.belongsTo(Modulo, { foreignKey: 'fk_cat_modulo' });

module.exports = DetalleRolModulo;
