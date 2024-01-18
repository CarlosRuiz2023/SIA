// detalle_usuario_rol.js
const { Sequelize, DataTypes } = require('sequelize');
const pool = require('../../../database/config');
const Roles = require('../catalogos/roles');
const Permiso = require('../catalogos/permiso');
const SubModulo = require('../catalogos/subModulos');

const DetalleRolSubModulo = pool.define('detalle_rol_sub_modulo', {
    id_detalle_rol_sub_modulo: {
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
    estatus: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: 'detalle_rol_sub_modulo',
    
});

Roles.hasMany(DetalleRolSubModulo, { foreignKey: 'fk_cat_rol' });
DetalleRolSubModulo.belongsTo(Roles, { foreignKey: 'fk_cat_rol' });

Permiso.hasMany(DetalleRolSubModulo, { foreignKey: 'fk_cat_permiso' });
DetalleRolSubModulo.belongsTo(Permiso, { foreignKey: 'fk_cat_permiso' });

SubModulo.hasMany(DetalleRolSubModulo, { foreignKey: 'fk_cat_sub_modulo' });
DetalleRolSubModulo.belongsTo(SubModulo, { foreignKey: 'fk_cat_sub_modulo' });

module.exports = DetalleRolSubModulo;
