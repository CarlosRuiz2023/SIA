const { Sequelize } = require('sequelize');
const pool = require('../../../database/config');

const Empleado = require('../catalogos/empleado');

const BitacoraAcceso = pool.define('cat_bitacora_acceso', {
    id_cat_bitacora: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fecha_inicio: {
        type: Sequelize.DATE,
    }, 
    hora: {
        type: Sequelize.TIME,
    },   
    plataforma_web: {
        type: Sequelize.STRING,
    },
    plataforma_movil: {
        type: Sequelize.STRING,
    },
    descripcion: {
        type: Sequelize.STRING,
    },
    direccion_ip: {
        type: Sequelize.STRING,
    },
    fk_cat_empleado: {
        type: Sequelize.INTEGER,
        references: {
          model: Empleado,
          key: 'id_cat_empleado',
        },
    },
}, {
    timestamps: false,
    tableName: 'cat_bitacora_acceso',
});

BitacoraAcceso.belongsTo(Empleado, { foreignKey: 'fk_cat_empleado'}); 

module.exports = BitacoraAcceso;
