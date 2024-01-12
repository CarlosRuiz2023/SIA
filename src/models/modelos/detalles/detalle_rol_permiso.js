const { Sequelize, DataTypes } = require('sequelize');
const pool = require('../../../database/config');
const Rol = require('../catalogos/roles');
const Permiso = require('../catalogos/permiso');


const DetalleRolPermiso = pool.define('detalle_rol_permiso', {
    id_detalle_rol_permiso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        as:'id'
    },
    fk_cat_rol: {
        type: DataTypes.INTEGER,
        references: {
            model: Rol,
            key: 'id_cat_rol',
        },
    },
    fk_cat_permiso: {
        type: DataTypes.INTEGER,
        references: {
            model: Permiso,
            key: 'id_cat_permiso',
        },
    },
}, {
    timestamps: false,
    tableName: 'detalle_rol_permiso',
});

// Establece las relaciones many-to-one
Rol.hasMany(DetalleRolPermiso, { foreignKey: 'fk_cat_rol'});
DetalleRolPermiso.belongsTo(Rol, { foreignKey: 'fk_cat_rol'});

Permiso.hasMany(DetalleRolPermiso, { foreignKey: 'fk_cat_permiso'});
DetalleRolPermiso.belongsTo(Permiso, { foreignKey: 'fk_cat_permiso'});

module.exports = DetalleRolPermiso;
