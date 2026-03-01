import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeNTqSKw1Aa9Q_7geKq7pkA0jUEsrhsPo",
  authDomain: "carematrix-909b9.firebaseapp.com",
  projectId: "carematrix-909b9",
  storageBucket: "carematrix-909b9.firebasestorage.app",
  messagingSenderId: "1010862772655",
  appId: "1:1010862772655:web:a16fc59397281145759f5a",
  measurementId: "G-NGZD4TGTNZ"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;