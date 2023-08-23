const {Sequelize, DataTypes} = require('sequelize')
const sequelize = new Sequelize('bancoapp', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

sequelize.authenticate().then(()=>{
    console.log("conectado ao banco de dados")
}).catch((err)=>{
    console.log(err)
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}
