import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// GANTI DENGAN CONFIG FIREBASE PUNYAMU

const firebaseConfig = {

  apiKey: "MASUKKAN_API_KEY",

  authDomain:
    "PROJECT-ID.firebaseapp.com",

  projectId:
    "PROJECT-ID",

  storageBucket:
    "PROJECT-ID.firebasestorage.app",

  messagingSenderId:
    "MASUKKAN_SENDER_ID",

  appId:
    "MASUKKAN_APP_ID"

};


const app =
  initializeApp(firebaseConfig);


export const auth =
  getAuth(app);

export default app;
