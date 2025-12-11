import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBJYA8zSuzcGWCYJthBENR-rAh_jrPH21M",
  authDomain: "study-planner-4962d.firebaseapp.com",
  projectId: "study-planner-4962d",
  storageBucket: "study-planner-4962d.firebasestorage.app",
  messagingSenderId: "1095594991562",
  appId: "1:1095594991562:web:9be61563924e3bff93b933",
  measurementId: "G-1SQWCLHQQJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

export default app;
