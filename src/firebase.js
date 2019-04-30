import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var config = {
    apiKey: "AIzaSyAsImcMIgJPZRIKj5RlZ_z4yAdPSeYBvy8",
    authDomain: "mychat-c2a29.firebaseapp.com",
    databaseURL: "https://mychat-c2a29.firebaseio.com",
    projectId: "mychat-c2a29",
    storageBucket: "mychat-c2a29.appspot.com",
    messagingSenderId: "563355540717"
};
firebase.initializeApp(config);

export default firebase;