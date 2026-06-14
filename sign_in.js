import { auth } from "./firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (user){
        window.location.href ="index.html"
    }
});

function displayMessage(text, type){
    const messageEl = document.getElementById("message");
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
}

async function signIn() {
    const email = document.getElementById("user-email").value;
    const password = document.getElementById("user-password").value;

    if(!email || !password){
        displayMessage("Please enter your email and password", "error");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);

        window.location.href = "index.html";

    } catch (error) {
        // Show friendly error messages instead of Firebase ones
        switch (error.code) {
            case "auth/user-not-found":
                displayMessage("No account found with this email.", "error"); 
                break;
            case "auth/wrong-password":
                displayMessage("Incorrect password. Please try again.", "error"); 
                break;
            case "auth/invalid-email":
                displayMessage("Please enter a valid email address.", "error"); 
                break;
            case "auth/too-many-requests":
                displayMessage("Too many attempts. Please try again later.", "error"); 
                break;
            case "auth/invalid-credential":
                displayMessage("Incorrect email or password.", "error"); 
                break;
            default:
                displayMessage(error.message, "error");
        }
    }
}

document.getElementById("signIn").addEventListener("click", signIn);
