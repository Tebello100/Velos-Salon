// index.js (home page nav)
import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const navAuth = document.getElementById("navAuth");

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // User is signed in — fetch their name from Firestore
            const docSnap = await getDoc(doc(db, "users", user.uid));

            if (docSnap.exists()) {
                const profile = docSnap.data();

                // Change "Sign In" to their first name
                navAuth.textContent = profile.fullName;
                navAuth.href = "profile.html"; // clicking name goes to their profile

                //Add a sign out link next to their name
                const signOutLink = document.createElement("a");
                signOutLink.textContent = "SIGN OUT";
                signOutLink.href = "sign_out.html";
                signOutLink.className = "navigation"
                signOutLink.addEventListener("click", async () => {
                    await signOut(auth);
                    window.location.reload(); // refreshes page and resets nav
                });

                navAuth.insertAdjacentElement("afterend", signOutLink);
            }

        } else {
            // User is signed out — show Sign In link
            navAuth.textContent = "Sign In";
            navAuth.href = "sign_in.html";
        }
    });