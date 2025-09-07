
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDCYkcPNcsk6vdwE__wGSnAcRIEmvJDkmk",
    authDomain: "todolist-50271.firebaseapp.com",
    databaseURL: "https://todolist-50271-default-rtdb.firebaseio.com",
    projectId: "todolist-50271",
    storageBucket: "todolist-50271.firebasestorage.app",
    messagingSenderId: "943333075731",
    appId: "1:943333075731:web:1f772407f7f8d9ba3408e6",
    measurementId: "G-HCL487Z4QP"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
