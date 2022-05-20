const Sequelize = require('sequelize');
const sequelize = require('../database/db-config');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    email: {
       type:  Sequelize.STRING,
       allowNull: false,
       unique: true
    },
    password: Sequelize.STRING,
})

module.exports = User;