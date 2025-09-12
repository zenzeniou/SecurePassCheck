function checkPassword(password) {
    const meter = document.querySelector("#strength-meter");
    const strengthText = document.querySelector(".strength-text");
    const tips = document.querySelectorAll(".password-tips p");


    tips.forEach(tip => tip.classList.remove("satisfied"));

    let strength = 0;
    if (password.match(/[a-z]/)) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[!@#$%^&*():\-_"£]/)) strength += 1;

    
    if (password.length >= 8) tips[0].classList.add("satisfied"); 
    if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*():\-_"£]/.test(password)) {
        tips[1].classList.add("satisfied"); 
    }
    if (!/(password|12345)/i.test(password)) tips[2].classList.add("satisfied"); 

    meter.style.height = "8px";
    meter.style.borderRadius = "4px";
    meter.style.transition = "width 0.3s ease-in-out";

    switch (strength) {
        case 0:
            meter.style.width = "0%";
            strengthText.textContent = "";
            break;
        case 1:
            meter.style.width = "25%";
            meter.style.backgroundColor = "red";
            strengthText.textContent = "Weak";
            break;
        case 2:
            meter.style.width = "50%";
            meter.style.backgroundColor = "orange";
            strengthText.textContent = "Moderate";
            break;
        case 3:
            meter.style.width = "75%";
            meter.style.backgroundColor = "#cccc00";
            strengthText.textContent = "Good";
            break;
        case 4:
            meter.style.width = "100%";
            meter.style.backgroundColor = "limegreen";
            strengthText.textContent = "Strong";
            break;
    }

    if (password.length < 6) {
        strengthText.textContent = "Too short (min 6 chars)";
        meter.style.width = "10%";
        meter.style.backgroundColor = "red";
    } else if (password.length > 12) {
        strengthText.textContent = "Too long (max 12 chars)";
        meter.style.width = "100%";
        meter.style.backgroundColor = "red";
    }
}

export {checkPassword};
