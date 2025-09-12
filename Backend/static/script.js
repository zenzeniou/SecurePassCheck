document.addEventListener("DOMContentLoaded", function (){
    fetch("http://127.0.0.1:5050/protected", {
        method:"GET",
        credentials:"include"
    })

    .then (res => {
        if(!res.ok){
            window.location.href = "/Frontend/index.html"; //Redirect if not logged in
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