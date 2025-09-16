document.addEventListener("DOMContentLoaded", function (){
    fetch("/api/protected", {
        method:"GET",
        credentials:"include"
    })

    .then (res => {
        if(!res.ok){
            window.location.href = "/index.html"; 
            return Promise.reject("Unauthorized");
        }
        return res.json();
    })

    .then(data => {
        console.log("Protected data: " , data.message); //Uses is authenitcated, success page stays visible
        document.body.style.display = "block";
    })

    .catch(err => {
        console.error("Auth check failed: ", err);
    });
});