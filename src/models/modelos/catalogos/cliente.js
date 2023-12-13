const {Sequelize} = require('sequelize');
const pool = require('../../../database/config');

const Persona = require('../catalogos/persona');
const Usuario = require('../usuario');

const Cliente = pool.define('cat_clientes', {
    id_cat_cliente:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    empresa: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    estatus: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    fk_cat_persona: {
        type: Sequelize.INTEGER,
        references: {
            model: Persona,
            key: 'id_cat_persona',
        },
    },
    fk_cat_usuario: {
        type: Sequelize.INTEGER,
        references: {
            model: Usuario,
            key: 'id_cat_usuario'
        },
    },
}, {
    timestamps: false,
    tableName: 'cat_clientes', 
});

Cliente.belongsTo(Persona, { foreignKey: 'fk_cat_persona', as: 'persona'});
Cliente.belongsTo(Usuario, { foreignKey: 'fk_cat_usuario', as: 'usuario'});

module.exports = Cliente;