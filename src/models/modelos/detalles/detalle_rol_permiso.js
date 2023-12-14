const { Sequelize, DataTypes } = require('sequelize');
const pool = require('../../../database/config');
const SubModulo = require('../catalogos/subModulos');
const Permiso = require('../catalogos/permiso');


const DetalleRolPermiso = pool.define('detalle_rol_permiso', {
    id_detalle_rol_permiso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        as:'id'
    },
    fk_cat_submodulo: {
        type: DataTypes.INTEGER,
        references: {
            model: SubModulo,
            key: 'id_cat_sub_modulo',
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
SubModulo.hasMany(DetalleRolPermiso, { foreignKey: 'fk_cat_submodulo', as: 'fr' });
DetalleRolPermiso.belongsTo(SubModulo, { foreignKey: 'fk_cat_submodulo', as: 'fr' });

Permiso.hasMany(DetalleRolPermiso, { foreignKey: 'fk_cat_permiso', as: 'fp' });
DetalleRolPermiso.belongsTo(Permiso, { foreignKey: 'fk_cat_permiso', as: 'fp' });

module.exports = DetalleRolPermiso;
