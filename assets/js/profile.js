// profile.js
import { auth, db } from "../../firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

// ==========================================
// AUTH CHECK — protect the page
// ==========================================
onAuthStateChanged(auth, async (user) => {
    if (user) {
        await loadProfile(user);
    } else {
        window.location.href = "sign in.html";
    }
});

// ==========================================
// DISPLAY MESSAGE
// ==========================================
function displayMessage(text, type) {
    const messageEl = document.getElementById("message");
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
}

// ==========================================
// LOAD PROFILE — fetch from Firestore and populate page
// ==========================================
async function loadProfile(user) {
    try {
        const docSnap = await getDoc(doc(db, "users", user.uid));

        if (docSnap.exists()) {
            const data = docSnap.data();

            // --- Display fields ---
            document.getElementById("displayName").textContent = `${data.fullName} ${data.surname}`;
            document.getElementById("displayEmail").textContent = data.email;
            document.getElementById("displayPhone").textContent = data.phone || "Not set";
            document.getElementById("displayUsername").textContent = data.username || "Not set";
            document.getElementById("displayCity").textContent = data.city || "Not set";
            document.getElementById("displayGender").textContent = data.gender || "Not set";
            document.getElementById("displayBranch").textContent = data.preferredBranch || "Not set";
            document.getElementById("displayServices").textContent = data.preferredServices || "Not set";
            document.getElementById("displayHairstylist").textContent = data.preferredHairstylist || "Not set";

            // --- Pre-fill edit fields with current values ---
            document.getElementById("editPhone").value = data.phone || "";
            document.getElementById("editCity").value = data.city || "";
            document.getElementById("editHairstylist").value = data.preferredHairstylist || "";

            // --- Pre-select dropdowns ---
            setDropdown("editBranch", data.preferredBranch);
            setDropdown("editServices", data.preferredServices);

        } else {
            displayMessage("Profile not found. Please contact support.", "error");
        }

    } catch (error) {
        console.error("Error loading profile:", error);
        displayMessage("Failed to load profile. Please try again.", "error");
    }
}

// ==========================================
// HELPER — set dropdown to saved value
// ==========================================
function setDropdown(id, value) {
    const dropdown = document.getElementById(id);
    if (!dropdown || !value) return;

    for (let option of dropdown.options) {
        if (option.value.toLowerCase() === value.toLowerCase()) {
            option.selected = true;
            break;
        }
    }
}

// ==========================================
// EDIT BUTTON — switch to edit mode
// ==========================================
document.getElementById("editBtn").addEventListener("click", () => {
    document.getElementById("profileDisplay").style.display = "none";
    document.getElementById("profileEdit").style.display = "block";
    displayMessage("", ""); // clear any messages
});

// ==========================================
// CANCEL BUTTON — switch back to display mode
// ==========================================
document.getElementById("cancelBtn").addEventListener("click", () => {
    document.getElementById("profileDisplay").style.display = "block";
    document.getElementById("profileEdit").style.display = "none";
    displayMessage("", ""); // clear any messages
});

// ==========================================
// SAVE BUTTON — write updated data to Firestore
// ==========================================
document.getElementById("saveBtn").addEventListener("click", async () => {
    const user = auth.currentUser;

    if (!user) {
        displayMessage("You are not signed in.", "error");
        return;
    }

    const phone = document.getElementById("editPhone").value.trim();
    const city = document.getElementById("editCity").value.trim();
    const preferredBranch = document.getElementById("editBranch").value;
    const preferredServices = document.getElementById("editServices").value;
    const preferredHairstylist = document.getElementById("editHairstylist").value.trim();

   
    if (!phone || !city) {
        displayMessage("Phone and city cannot be empty.", "error");
        return;
    }

    try {
        await updateDoc(doc(db, "users", user.uid), {
            phone,
            city,
            preferredBranch,
            preferredServices,
            preferredHairstylist,
            updatedAt: new Date() 
        });

        displayMessage("Profile updated successfully!", "success");

        // Switch back to display view and reload fresh data
        document.getElementById("profileDisplay").style.display = "block";
        document.getElementById("profileEdit").style.display = "none";
        await loadProfile(user);

    } catch (error) {
        console.error("Error updating profile:", error);
        switch (error.code) {
            case "permission-denied":
                displayMessage("You don't have permission to update this profile.", "error");
                break;
            default:
                displayMessage("Failed to save changes. Please try again.", "error");
        }
    }
});

// ==========================================
// SIGN OUT BUTTON
// ==========================================
document.getElementById("signOutBtn").addEventListener("click", async () => {
    try {
        await signOut(auth);
        window.location.href = "sign in.html";
    } catch (error) {
        console.error("Sign out error:", error);
        displayMessage("Failed to sign out. Please try again.", "error");
    }
});