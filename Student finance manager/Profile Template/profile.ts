interface User {
    first_name: string;
    last_name: string;
    email: string;
    birthday: string;
    country: string;
    phone: string;
    website: string;
    profile_picture: string;
    password: string;
}

document.addEventListener("DOMContentLoaded", function() {
    const currentUserEmail = localStorage.getItem("current_user_email");
    if (currentUserEmail) {
        const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
        const currentUser = users.find(user => user.email === currentUserEmail);
        if (currentUser) {
            const fields: (keyof User)[] = ["first_name", "last_name", "email", "birthday", "country", "phone", "website"];
            fields.forEach(field => {
                const element = document.getElementById(field) as HTMLInputElement;
                if (currentUser[field]) {
                    element.value = currentUser[field] as string;
                }
            });
            if (currentUser.profile_picture) {
                const profilePictureElement = document.getElementById("profile-picture") as HTMLImageElement;
                profilePictureElement.src = currentUser.profile_picture;
            }
        }
    }
});

const profilePictureInput = document.getElementById("profile-picture-input") as HTMLInputElement;
profilePictureInput.addEventListener("change", function(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const profilePictureElement = document.getElementById("profile-picture") as HTMLImageElement;
            profilePictureElement.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
});

const saveChangesButton = document.getElementById("save_changes") as HTMLButtonElement;
saveChangesButton.addEventListener("click", function() {
    const currentUserEmail = localStorage.getItem("current_user_email");
    if (currentUserEmail) {
        const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
        const currentUserIndex = users.findIndex(user => user.email === currentUserEmail);
        const fields: (keyof User)[] = ["first_name", "last_name", "email", "birthday", "country", "phone", "website"];
        const updatedUser: Partial<User> = {};
        fields.forEach(field => {
            const element = document.getElementById(field) as HTMLInputElement;
            updatedUser[field] = element.value;
        });
        const profilePictureElement = document.getElementById("profile-picture") as HTMLImageElement;
        updatedUser.profile_picture = profilePictureElement.src;
        if (currentUserIndex !== -1) {
            users[currentUserIndex] = { ...users[currentUserIndex], ...updatedUser };
        } else {
            users.push(updatedUser as User);
        }

        localStorage.setItem("users", JSON.stringify(users));
        alert("Changes saved successfully!");

        // Change password functionality
        const currentPassword = (document.getElementById("current_password") as HTMLInputElement).value;
        const newPassword = (document.getElementById("new_password") as HTMLInputElement).value;
        const repeatNewPassword = (document.getElementById("repeat_new_password") as HTMLInputElement).value;
        
        if (newPassword && newPassword === repeatNewPassword) {
            if (currentUserIndex !== -1 && users[currentUserIndex].password === currentPassword) {
                users[currentUserIndex].password = newPassword;
                localStorage.setItem("users", JSON.stringify(users));
                alert("Password changed successfully!");
            } else {
                alert("Current password is incorrect!");
            }
        } else if (newPassword !== repeatNewPassword) {
            alert("New passwords do not match!");
        }
    }
});
//cancel button
const cancelChangesButton = document.getElementById("cancel_changes") as HTMLButtonElement;
cancelChangesButton.addEventListener("click", function() {
    window.location.reload();
});
