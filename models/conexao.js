const {Sequelize, DataTypes} = require('sequelize')
const sequelize = new Sequelize('bancoapp', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

sequelize.authenticate().then(async ()=>{
    // await sequelize.sync({force: true})
    console.log("conectado ao banco de dados")
}).catch(async (err)=>{
    console.log(JSON.stringify(err))
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}
