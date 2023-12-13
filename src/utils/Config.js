import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDIzhlOwEh5PTM1ESGhKa1Mg3alryK2zUs",
  authDomain: "imsavatar-31182.firebaseapp.com",
  projectId: "imsavatar-31182",
  storageBucket: "imsavatar-31182.appspot.com",
  messagingSenderId: "53378124457",
  appId: "1:53378124457:web:21f303e012a3fe401937b8",
};

const app = initializeApp(firebaseConfig);
export const imageDb = getStorage(app);
