// detalle_usuario_rol.js
const { Sequelize, DataTypes } = require('sequelize');
const pool = require('../../../database/config');
const Permiso = require('../catalogos/permiso');
const SubModulo = require('../catalogos/subModulos');

const DetallePermisoSubModulo = pool.define('detalle_permiso_sub_modulo', {
    id_detalle_permiso_sub_modulo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fk_cat_permiso: {
        type: DataTypes.INTEGER,
        references: {
            model: Permiso,
            key: 'id_cat_permiso',
        },
    },
    fk_cat_sub_modulo: {
        type: DataTypes.INTEGER,
        references: {
            model: SubModulo,
            key: 'id_cat_sub_modulo',
        },
    },
}, {
    timestamps: false,
    tableName: 'detalle_permiso_sub_modulo',
    
});

Permiso.hasMany(DetallePermisoSubModulo, { foreignKey: 'fk_cat_permiso' });
DetallePermisoSubModulo.belongsTo(Permiso, { foreignKey: 'fk_cat_permiso' });

SubModulo.hasMany(DetallePermisoSubModulo, { foreignKey: 'fk_cat_sub_modulo' });
DetallePermisoSubModulo.belongsTo(SubModulo, { foreignKey: 'fk_cat_sub_modulo' });

module.exports = DetallePermisoSubModulo;
