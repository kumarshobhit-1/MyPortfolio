(function () {
    [...document.querySelectorAll(".control")].forEach(button =>{
        button.addEventListener("click", function() {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");
            document.querySelector(".active").classList.remove("active");
            document.getElementById(button.dataset.id).classList.add("active");
        })
    });
    document.querySelector(".theme-btn").addEventListener("click" ,() =>{
        document.body.classList.toggle("light-mode");
    })
})();

window.onload = function (){
    emailjs.init("vMYmibaV_J1q6Z1s_");

    document.getElementById("contactForm").addEventListener("submit", function(e) {
        e.preventDefault();

        emailjs.send("service_x7w5hya", "template_rppeolk", {
            name : document.getElementById("name").value,
            email : document.getElementById("email").value,
            subject : document.getElementById("subject").value,
            message : document.getElementById("message").value, 
        })
        // .then(function(response) {
        //     let userName = document.getElementById("name").value;
        //     alert(`${userName}, Your message was sent successfully!`);
        //     document.getElementById("contactForm").reset();
        // }, function(error) {
        //     alert("Failed to send message." `${userName}, `);
        // });

        .then(function(response) {
            let userName = document.getElementById("name").value;

            Swal.fire({
                icon: 'success',
                title: '🎉 Message Sent!',
                text: `${userName}, your message was sent successfully.`,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                toast: true,
                position: 'top-end',
                showClass: {
                    popup: 'animate__animated animate__bounceInRight'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            });

            document.getElementById("contactForm").reset();

        }, function(error) {
            let userName = document.getElementById("name").value;

            Swal.fire({
                icon: 'error',
                title: '⚠️ Failed!',
                text: `Sorry ${userName}, your message could not be sent.`,
                showConfirmButton: true,
                showClass: {
                    popup: 'animate__animated animate__shakeX'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOut'
                }
            });
        });

    });
};

