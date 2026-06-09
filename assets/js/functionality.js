// functionality.js (register page)
import { auth, db } from "../../firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

// No need for firebaseConfig or initializeApp here anymore ✅

function showMessage(text, type) {
  const el = document.getElementById("message");
  el.textContent = text;
  el.className = `message ${type}`;
}

async function signUp() {
  console.log("1. Button clicked"); // ✅ confirms button is connected

  const fullName = document.getElementById("fullName").value;
  const surname = document.getElementById("surname").value;
  const email = document.getElementById("emailAddress").value;
  const phone = document.getElementById("cellNumber").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const preferredServices = document.getElementById("preference").value;
  const preferredHairstylist = document.getElementById("preferredHairstylist").value;
  const gender = document.getElementById("gender").value;
  const city = document.getElementById("city").value;
  const preferredBranch = document.getElementById("branch").value;

  console.log("2. Form values collected:", { fullName, email, password }); // ✅ confirms values are read

  if (password !== confirmPassword) {
    console.log("3. Passwords don't match");
    showMessage("Passwords do not match!", "error");
    return;
  }

  if (!fullName || !surname || !email || !password) {
    console.log("4. Empty fields detected");
    showMessage("Please fill in all required fields.", "error");
    return;
  }

  console.log("5. Attempting Firebase Auth..."); // ✅ confirms we reached Firebase

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("6. Auth success, uid:", user.uid); // ✅ confirms account was created

    await setDoc(doc(db, "users", user.uid), {
      fullName,
      surname,
      phone,
      username,
      preferredServices,
      preferredHairstylist,
      gender,
      preferredBranch,
      city,
      email,
      role: "client",
      createdAt: new Date()
    });

    console.log("7. Firestore write success!"); // ✅ confirms data was saved
    showMessage("Account created successfully!", "success");
    window.location.href = "success.html";

  } catch (error) {
    console.error("❌ Error caught:", error.code, error.message); // shows exact Firebase error
    showMessage(error.message, "error");
  }
}

document.getElementById("signUp").addEventListener("click", signUp);