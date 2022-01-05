// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { TwitterAuthProvider, GoogleAuthProvider, getAuth, signInWithPopup, signOut } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use

import { 
  FIREBASE_API_KEY,  FIREBASE_AUTH_DOMAIN, 
  FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, 
  FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID 
} from "../config";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);


// Setting up Twitter Auth

const twitterAuthProvider = new TwitterAuthProvider();

const firebaseAuth = getAuth(firebaseApp);

const twitterSignIn = async ()=>{
  try{
    const result = await signInWithPopup(firebaseAuth, twitterAuthProvider);
    return result.user;
  }
  catch(error){
    console.log("Unable to login with Twitter", error);
  }
};

// Setting up Google Auth

const googleAuthProvider = new GoogleAuthProvider();

const googleSignIn = async ()=>{
  try{
    const result = await signInWithPopup(firebaseAuth, googleAuthProvider);
    return result.user;
  }
  catch(error){
    console.log("Unable to login with Google", error);
  }
};

const firebaseAuthSignOut = async () => {
  await signOut(firebaseAuth);
}

export {
  firebaseApp,
  twitterSignIn,
  googleSignIn,
  firebaseAuthSignOut
};