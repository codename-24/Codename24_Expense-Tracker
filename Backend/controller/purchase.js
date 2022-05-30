const Razorpay = require('razorpay');
const Order = require('../models/orders')
const User = require('../models/users');


const purchasepremium =async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 100000;

        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err) {
                throw new Error(err);
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
                return res.status(201).json({ order, key_id : rzp.key_id});

            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch(err){
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err})
    }
}

 const updateTransactionStatus = (req, res ) => {
    try {
        const userid = req.user.id;
        const { payment_id, order_id} = req.body;
        Order.findOne({where : {orderid : order_id}}).then(order => {
            order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}).then(() => {
                req.user.update({ispremiumuser: userid})
                return res.status(202).json({success: true, message: "Transaction Successful"});
            }).catch((err)=> {
                throw new Error(err);
            })
        }).catch(err => {
            throw new Error(err);
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({ error: err, message: 'Something went wrong' })

    }
}

const isPremium = (req, res) => {
    const userid = req.user.id;
    User.findOne({where: { ispremiumuser: userid }}).then(() => {
        return res.status(200).json({ success: true, message: "yes"})
    }).catch(err => {
        console.log(err);
        return res.status(403).json({ success: true, message: "no"})
    })
}

module.exports = {
    purchasepremium,
    updateTransactionStatus,
    isPremium
}