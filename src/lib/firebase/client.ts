import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBkzkhL_3lhKDW_mct3h0EowDK6nP9YoVQ',
  authDomain: 'kyonsvn.firebaseapp.com',
  projectId: 'kyonsvn',
  storageBucket: 'kyonsvn.appspot.com',
  messagingSenderId: '830127784291',
  appId: '1:830127784291:web:1168b582fc55f6be1b5356',
  measurementId: 'G-21ZCN76MYB',
};

export const app = initializeApp(firebaseConfig);
