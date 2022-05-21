const Expense = require('../models/expenses');
const AWS = require('aws-sdk');

function uploadToS3(data,filename){
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    })

    var params = {
        Bucket: BUCKET_NAME,
        Key:filename,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise((resolve,reject)=>{
        s3bucket.upload(params,(err,s3response)=>{
            if(err) {
                console.log('error', err);
                reject(err);
            }
            else{
                //console.log('success', s3response);
                resolve(s3response.Location);
            }
        })

    })
    

}

const downloadexpense = async(req,res)=>{
    try{
        const expenses = await req.user.getExpenses();
    //console.log(expenses);
    const stringifiedExpenses = JSON.stringify(expenses);
    const userId = req.user.id;
    const filename = `report${userId}/${new Date()}.txt`;
    const fileURL = await uploadToS3(stringifiedExpenses,filename);
    res.status(200).json({fileURL, success: true})

    }
    catch(err){
        console.log(err);
        res.status(500).json({fileURL:'', success:false, err:err})

    }


    


}

const addexpense = (req, res) => {
    const { expenseamount, description, category } = req.body;
    req.user.createExpense({ expenseamount, description, category }).then(expense => {
        return res.status(201).json({expense, success: true } );
    }).catch(err => {
        return res.status(403).json({success : false, error: err})
    })
}

const getexpenses = (req, res)=> {

    req.user.getExpenses().then(expenses => {
        return res.status(200).json({expenses, success: true})
    })
    .catch(err => {
        return res.status(402).json({ error: err, success: false})
    })
}

const deleteexpense = (req, res) => {
    const expenseid = req.params.expenseid;
    Expense.destroy({where: { id: expenseid }}).then(() => {
        return res.status(204).json({ success: true, message: "Deleted Successfuly"})
    }).catch(err => {
        console.log(err);
        return res.status(403).json({ success: true, message: "Failed"})
    })
}




module.exports = {
    deleteexpense,
    getexpenses,
    addexpense,
    downloadexpense
}