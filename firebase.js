import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// GANTI DENGAN CONFIG FIREBASE PUNYAMU

const firebaseConfig = {

  apiKey: "AIzaSyAOiFLP1TeX7AvMPrSbPwYxKCzr7d6acyY",

  authDomain:
    "ridho-v3.firebaseapp.com",

  projectId:
    "https://ridho-v3-default-rtdb.asia-southeast1.firebasedatabase.app",

  storageBucket:
    "ridho-v3.firebasestorage.app",

  messagingSenderId:
    "1028204303087",

  appId:
    "1:1028204303087:web:3cf61911f11efc1030c11a"

};


const app =
  initializeApp(firebaseConfig);


export const auth =
  getAuth(app);

export default app;
