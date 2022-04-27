// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from '@firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBK0K4sdaII8a3pe9U_CulWBV1piLqW9qM',
  authDomain: 'taskmanager-45d0a.firebaseapp.com',
  projectId: 'taskmanager-45d0a',
  storageBucket: 'taskmanager-45d0a.appspot.com',
  messagingSenderId: '227693443668',
  appId: '1:227693443668:web:7cf01e83bdb79a41384bc1',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
