import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBZkKkai68JKAB47_yPB56wz1Gpc-qPIxc",
    authDomain: "react-tsp.firebaseapp.com",
    projectId: "react-tsp",
    storageBucket: "react-tsp.appspot.com",
    messagingSenderId: "382629435445",
    appId: "1:382629435445:web:bf674c9004bf68fbffb97c",
};

export const initializeFirebase = () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    } else {
        firebase.app();
    }

    return { auth: firebase.auth(), database: firebase.database() };
};

export default firebase;
