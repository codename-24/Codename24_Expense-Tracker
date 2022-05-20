const path = require('path');
const express = require('express');
var cors = require('cors')
const sequelize = require('./database/db-config');
const User = require('./models/users');
const Expense = require('./models/expenses');

const userRoutes = require('./routes/user')

const app = express();
require('dotenv').config();

app.use(cors());

//app.use(bodyParser.urlencoded());
app.use(express.json());

app.use('/user', userRoutes)

User.hasMany(Expense);
Expense.belongsTo(User);


sequelize.sync()
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })