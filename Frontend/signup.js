function signup(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const signupDetails = {
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password")
    }
    //console.log(signupDetails)
    axios.post('http://localhost:3000/user/signup',signupDetails).then(response => {
        if(response.status === 201){
            window.location.href = "./login.html" 
        } else {
            throw new Error('Failed to login')
        }
    }).catch(err => {
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    })
}