import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBXSvC0bs1T4_T47u-Z1AFfDGMRSvcEFyY",
  authDomain: "videoplayer-6e902.firebaseapp.com",
  projectId: "videoplayer-6e902",
  storageBucket: "videoplayer-6e902.firebasestorage.app",
  messagingSenderId: "26302172679",
  appId: "1:26302172679:web:9c09ef6f32a0a6314f24a2",
  measurementId: "G-R4G8WVTHGS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);

export default app;
