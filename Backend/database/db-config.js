const Sequelize = require('sequelize');

const sequelize = new Sequelize('expensetracker', 'root', 'password',{
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize;