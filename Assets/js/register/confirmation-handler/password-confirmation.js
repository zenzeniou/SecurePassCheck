
function checkPasswordMatch(password,confirm){
    const status = document.querySelector("#confirm-status");
    if(!status) return;

    if(!confirm){
        status.textContent = "";
        return;
    }

    if(confirm === password){
        status.textContent = "Password match";
        status.style.color = "Limegreen";
    } else {
        status.textContent = "Passwords do not match";
        status.style.color = "red";
    }
}

export {checkPasswordMatch};