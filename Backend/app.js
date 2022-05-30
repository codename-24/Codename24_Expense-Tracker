const path = require('path');
const express = require('express');
var cors = require('cors')
const sequelize = require('./database/db-config');
const User = require('./models/users');
const Expense = require('./models/expenses');
const Order = require('./models/orders');
const userRoutes = require('./routes/user')
const purchaseRoutes = require('./routes/purchase')

const app = express();
require('dotenv').config();

app.use(cors());

//app.use(bodyParser.urlencoded());
app.use(express.json());

app.use('/user', userRoutes)

app.use('/purchase', purchaseRoutes)

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);


sequelize.sync()
    .then(() => {
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log(err);
    })