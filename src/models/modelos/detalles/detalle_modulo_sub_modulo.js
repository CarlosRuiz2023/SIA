// detalle_usuario_rol.js
const { Sequelize, DataTypes } = require('sequelize');
const pool = require('../../../database/config');

const Modulos = require('../catalogos/modulo');
const SubModulo = require('../catalogos/subModulos');

const DetalleModuloSubModulo = pool.define('detalle_modulo_sub_modulo', {
    id_detalle_modulo_sub_modulo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fk_cat_modulo: {
        type: DataTypes.INTEGER,
        references: {
            model: Modulos,
            key: 'id_cat_modulo',
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
    tableName: 'detalle_modulo_sub_modulo',
});

// Establece las relaciones many-to-one
Modulos.hasMany(DetalleModuloSubModulo, { foreignKey: 'fk_cat_modulo', as: 'f_modulo' });
DetalleModuloSubModulo.belongsTo(Modulos, { foreignKey: 'fk_cat_modulo', as: 'f_modulo'  });

SubModulo.hasMany(DetalleModuloSubModulo, { foreignKey: 'fk_cat_sub_modulo' , as: 'f_sub_modulo'  });
DetalleModuloSubModulo.belongsTo(SubModulo, { foreignKey: 'fk_cat_sub_modulo' , as: 'f_sub_modulo' });

module.exports = DetalleModuloSubModulo;
