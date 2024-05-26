"use strict";
document.addEventListener("DOMContentLoaded", function () {
    const currentUserEmail = localStorage.getItem("current_user_email");
    if (currentUserEmail) {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const currentUser = users.find(user => user.email === currentUserEmail);
        if (currentUser) {
            const fields = ["first_name", "last_name", "email", "birthday", "country", "phone", "website"];
            fields.forEach(field => {
                const element = document.getElementById(field);
                if (currentUser[field]) {
                    element.value = currentUser[field];
                }
            });
            if (currentUser.profile_picture) {
                const profilePictureElement = document.getElementById("profile-picture");
                profilePictureElement.src = currentUser.profile_picture;
            }
        }
    }
});
const profilePictureInput = document.getElementById("profile-picture-input");
profilePictureInput.addEventListener("change", function (event) {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const profilePictureElement = document.getElementById("profile-picture");
            profilePictureElement.src = e.target?.result;
        };
        reader.readAsDataURL(file);
    }
});
const saveChangesButton = document.getElementById("save_changes");
saveChangesButton.addEventListener("click", function () {
    const currentUserEmail = localStorage.getItem("current_user_email");
    if (currentUserEmail) {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const currentUserIndex = users.findIndex(user => user.email === currentUserEmail);
        const fields = ["first_name", "last_name", "email", "birthday", "country", "phone", "website"];
        const updatedUser = {};
        fields.forEach(field => {
            const element = document.getElementById(field);
            updatedUser[field] = element.value;
        });
        const profilePictureElement = document.getElementById("profile-picture");
        updatedUser.profile_picture = profilePictureElement.src;
        if (currentUserIndex !== -1) {
            users[currentUserIndex] = { ...users[currentUserIndex], ...updatedUser };
        }
        else {
            users.push(updatedUser);
        }
        localStorage.setItem("users", JSON.stringify(users));
        alert("Changes saved successfully!");
        // Change password functionality
        const currentPassword = document.getElementById("current_password").value;
        const newPassword = document.getElementById("new_password").value;
        const repeatNewPassword = document.getElementById("repeat_new_password").value;
        if (newPassword && newPassword === repeatNewPassword) {
            if (currentUserIndex !== -1 && users[currentUserIndex].password === currentPassword) {
                users[currentUserIndex].password = newPassword;
                localStorage.setItem("users", JSON.stringify(users));
                alert("Password changed successfully!");
            }
            else {
                alert("Current password is incorrect!");
            }
        }
        else if (newPassword !== repeatNewPassword) {
            alert("New passwords do not match!");
        }
    }
});
//cancel button
const cancelChangesButton = document.getElementById("cancel_changes");
cancelChangesButton.addEventListener("click", function () {
    window.location.reload();
});
