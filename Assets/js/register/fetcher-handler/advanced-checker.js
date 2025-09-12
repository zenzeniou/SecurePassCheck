
function checkAdvancedStrength(email,password){
    return fetch("http://127.0.0.1:5050/check_password_strength", {
        method : "POST",
        credentials:"include",
        headers : {"Content-Type": "application/json"},
        body : JSON.stringify({email,password})
    })

    .then(res => {
        if (!res.ok){
            throw new Error("Network Response Failure");
        }
        return res.json();
    });
}


export {checkAdvancedStrength};