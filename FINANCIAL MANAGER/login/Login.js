"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const firstName = document.getElementById('first_name');
    const lastName = document.getElementById('last_name');
    const registerEmail = document.getElementById('register-email');
    const registerPassword = document.getElementById('register-password');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const loginEmailValue = loginEmail.value.trim();
        const loginPasswordValue = loginPassword.value.trim();
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find(user => user.email === loginEmailValue && user.password === loginPasswordValue);
        if (user) {
            localStorage.setItem("current_user_email", loginEmailValue);
            alert("Login successful");
            window.location.href = "#profile-container";
            document.getElementById("login-container").style.display = "none";
            document.getElementById("profile-container").style.display = "block";
            loadUserProfile();
        }
        else {
            alert("Invalid email or password");
        }
    });
    function loadUserProfile() {
        const currentUserEmail = localStorage.getItem("current_user_email");
        if (currentUserEmail) {
            const users = JSON.parse(localStorage.getItem("users") || "[]");
            const currentUser = users.find(user => user.email === currentUserEmail);
            if (currentUser) {
                const fields = ["first_name", "last_name", "email", "birthday", "country", "phone", "website"];
                fields.forEach(field => {
                    const inputElement = document.getElementById(field);
                    if (currentUser[field]) {
                        inputElement.value = currentUser[field];
                    }
                });
            }
        }
    }
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (registerValidation()) {
            window.location.href = "Login.html"; // Redirect to the login page after form validation
        }
    });
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (loginValidation()) {
            window.location.href = "../index.html"; // Redirect to the success page after form validation
        }
    });
    function setError(ele, msg) {
        const box = ele.parentElement;
        let error = box.querySelector(".error");
        if (!error) {
            error = document.createElement("div");
            error.className = "error";
            box.appendChild(error);
        }
        error.innerText = msg;
        box.classList.add("error");
        box.classList.remove("success");
    }
    function setSuccess(ele) {
        const box = ele.parentElement;
        const error = box.querySelector(".error");
        if (error) {
            error.innerText = '';
        }
        box.classList.add("success");
        box.classList.remove("error");
    }
    function registerValidation() {
        const fname = firstName.value.trim();
        const lname = lastName.value.trim();
        const mail = registerEmail.value.trim();
        const pass = registerPassword.value.trim();
        let valid = true;
        if (fname === "") {
            setError(firstName, "First name is required");
            valid = false;
        }
        else {
            setSuccess(firstName);
        }
        if (lname === "") {
            setError(lastName, "Last name is required");
            valid = false;
        }
        else {
            setSuccess(lastName);
        }
        if (mail === "") {
            setError(registerEmail, "Email is required");
            valid = false;
        }
        else if (!validateEmail(mail)) {
            setError(registerEmail, "Email is not valid");
            valid = false;
        }
        else {
            setSuccess(registerEmail);
        }
        if (pass === "") {
            setError(registerPassword, "Password is required");
            valid = false;
        }
        else {
            setSuccess(registerPassword);
        }
        if (valid) {
            const users = JSON.parse(localStorage.getItem("users") || "[]");
            users.push({ firstName: fname, lastName: lname, email: mail, password: pass });
            localStorage.setItem("users", JSON.stringify(users));
        }
        return valid;
    }
    function loginValidation() {
        const mail = loginEmail.value.trim();
        const pass = loginPassword.value.trim();
        if (mail === "" || pass === "") {
            alert("Please fill in all fields");
            return false;
        }
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find(user => user.email === mail && user.password === pass);
        if (user) {
            alert("Login successful");
            return true;
        }
        else {
            alert("Invalid email or password");
            return false;
        }
    }
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});
