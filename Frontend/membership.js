const token = localStorage.getItem('token');
document.getElementById('rzp-button1').onclick = async function (e) {
  const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
  console.log(response);
  var options =
  {
   "key": response.data.key_id,
   "name": "Codename-24",
   "order_id": response.data.order.id, 
   "prefill": {
     "name": "Test User",
     "email": "test.user@example.com",
     "contact": "2424242424"
   },
   "theme": {
    "color": "#3399cc"
   },
   "handler": function (response) {
       console.log(response);
       axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
           order_id: options.order_id,
           payment_id: response.razorpay_payment_id,
       }, { headers: {"Authorization" : token} }).then(() => {
           alert('Thanks, for becoming a member')
       }).catch(() => {
           alert('Something went wrong. Try Again!!!')
       })
   },
};
const rzp1 = new Razorpay(options);
rzp1.open();
e.preventDefault();

rzp1.on('payment.failed', function (response){
alert(response.error.code);
alert(response.error.description);
alert(response.error.source);
alert(response.error.step);
alert(response.error.reason);
alert(response.error.metadata.order_id);
alert(response.error.metadata.payment_id);
});
}