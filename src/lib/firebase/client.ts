import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyB94ge2DejtJ3Dl0yfncrM6rueklrhh-lw",
  authDomain: "test-cbf14.firebaseapp.com",
  databaseURL: "https://test-cbf14-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-cbf14",
  storageBucket: "test-cbf14.appspot.com",
  messagingSenderId: "277111503927",
  appId: "1:277111503927:web:b4b3b945a21b695d84d3b2",
  measurementId: "G-G2N405NY57"
};

export const app = initializeApp(firebaseConfig);
