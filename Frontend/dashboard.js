const chk = document.getElementById('chk');
const lightdark = document.getElementById('lightdark')
chk.addEventListener('change', () => {
    
	document.body.classList.toggle('dark');
});

//checkpremium

let prem = async function ispremium(){
    const token = localStorage.getItem('token');
    await axios.get('http://localhost:3000/purchase/ispremium', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 200){
            lightdark.style.display='block';
            
        } else {
            lightdark.style.display='none';
        }

    })
    .catch((err) => {
        showError(err)
    });
}



//

function handleLogout(e){
  localStorage.removeItem('token');
  window.location.href = "./login.html" 
  
}
function addNewExpense(e){
    e.preventDefault();
    const form = new FormData(e.target);
    const expenseDetails = {
        expenseamount: form.get("expenseamount"),
        description: form.get("description"),
        category: form.get("category")
    }
    const token = localStorage.getItem('token');
    console.log(expenseDetails)
    axios.post('http://localhost:3000/user/addexpense',expenseDetails, { headers: {"Authorization" : token} }).then((response) => {
    if(response.status === 201){
        addNewExpensetoUI(response.data.expense);
    } else {
        throw new Error('Failed To create new expense');
    }

    }).catch(err => showError(err))

}

window.addEventListener('load', ()=> {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/user/getexpenses', { headers: {"Authorization" : token} }).then(response => {
        if(response.status === 200){
            response.data.expenses.forEach(expense => {
                addNewExpense(expense);
            })
        } else {
            throw new Error();
        }
    })
});

function addNewExpensetoUI(expense){
    const parentElement = document.getElementById('listOfExpenses');
    const expenseElemId = `expense-${expense.id}`;
    parentElement.innerHTML += `

        <tr class="expensetransaction" id=${expenseElemId}>
        <td class="expensetransactiondata" style="height:2px;">${expense.expenseamount}</td>
        <td class="expensetransactiondata">${expense.category}</td>
        <td class="expensetransactiondata">${expense.description}</td>
        <td><button class= "tablebutton" onclick='deleteExpense(event, ${expense.id})'>
        X
    </button></td>
        </tr>
        
        `
}
function deleteExpense(e, expenseid) {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3000/user/deleteexpense/${expenseid}`, { headers: {"Authorization" : token} }).then((response) => {
    if(response.status === 204){
            removeExpensefromUI(expenseid);
        } else {
            throw new Error('Failed to delete');
        }
    }).catch((err => {
        showError(err);
    }))
}
function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}
function removeExpensefromUI(expenseid){
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
}

function download(){
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 200){
            var a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'My_Expense_CD24.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => {
        showError(err)
    });
}

//testing


