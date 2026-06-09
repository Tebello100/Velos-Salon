import { auth } from "../../firebase.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

function displayMessage(text, type) {
    const messageEl = document.getElementById("message");
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
}

async function resetPassword() {
    const email = document.getElementById("emailAddress").value;

    if (!email) {
        displayMessage("Please enter your email address.", "error");
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        displayMessage("Reset link sent! Check your inbox.", "success");

        // ✅ Redirect back to sign in after 3 seconds
        setTimeout(() => {
            window.location.href = "sign_in.html";
        }, 3000);

    } catch (error) {
        switch (error.code) {
            case "auth/user-not-found":
                displayMessage("No account found with this email.", "error");
                break;
            case "auth/invalid-email":
                displayMessage("Please enter a valid email address.", "error");
                break;
            default:
                displayMessage(error.message, "error");
        }
    }
}

document.getElementById("resetButton").addEventListener("click", resetPassword);