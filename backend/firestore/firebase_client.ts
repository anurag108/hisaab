import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSYhUdwVbjtMHEdxAuNJL4QhX2uxyu0uI",
  authDomain: "hisaab-db167.firebaseapp.com",
  projectId: "hisaab-db167",
  storageBucket: "hisaab-db167.appspot.com",
  messagingSenderId: "155062634083",
  appId: "1:155062634083:web:56d0997b946b4d879e9a56",
  measurementId: "G-3QQBJQ1Z65"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);