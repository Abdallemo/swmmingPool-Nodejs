


const firebase = require('firebase/app');
require('firebase/auth')
require('dotenv').config();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "swimming-pool-uthm.firebaseapp.com",
  projectId: "swimming-pool-uthm",
  storageBucket: "swimming-pool-uthm.firebasestorage.app",
  messagingSenderId: "105841743073",
  appId: "1:105841743073:web:9f323247fd5dc524ac93a0"
};



firebase.initializeApp(firebaseConfig);
