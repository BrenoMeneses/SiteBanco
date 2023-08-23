const { DataTypes } = require("sequelize")
const conexao = require("./conexao")

const contabanco = conexao.sequelize.define('contabanco', {
    idconta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    dinheiro: {
        type: DataTypes.INTEGER,
        defaultValue: '0'
    }
})

module.exports = contabanco
