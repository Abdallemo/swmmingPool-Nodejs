import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDD1ENUdvtm2IJfvkahRYp63lbpmyy1Qq0",
    authDomain: "swimming-pool-uthm.firebaseapp.com",
    projectId: "swimming-pool-uthm",
    storageBucket: "swimming-pool-uthm.firebasestorage.app",
    messagingSenderId: "105841743073",
    appId: "1:105841743073:web:9f323247fd5dc524ac93a0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

window.handleGoogleSignIn=async function handleGoogleSignIn() {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    try {
        const userCredential = await signInWithPopup(auth, provider);
        const idToken = await userCredential.user.getIdToken();
        console.log("ID Token:", idToken);

        const response = await fetch('/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({idToken}),
        });
        const data = await response.json();
        if(response.ok){

            alert("User signed in: " + userCredential.user.displayName);
            console.log("User details:", userCredential.user);
            window.location.href = '/';
            
        }
    } catch (error) {
        console.error("Error during sign-in: ", error);
        alert("Error signing in with Google: " + error.message);
    }
}