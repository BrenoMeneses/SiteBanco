const { DataTypes } = require("sequelize")
const conexao = require("./conexao")
const contabanco = require('../models/contabanco.js')

const usuarios = conexao.sequelize.define('usuario', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

usuarios.belongsTo(contabanco, {constraints: true, foreignKey: 'contaId'})

module.exports = usuarios

