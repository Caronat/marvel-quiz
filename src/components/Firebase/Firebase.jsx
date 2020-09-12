import app from 'firebase/app';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyC_iOg3ZVrg45tbH7HXr_8dk0DC0OYsvj8",
    authDomain: "marvel-quiz-f8db9.firebaseapp.com",
    databaseURL: "https://marvel-quiz-f8db9.firebaseio.com",
    projectId: "marvel-quiz-f8db9",
    storageBucket: "marvel-quiz-f8db9.appspot.com",
    messagingSenderId: "1019253490645",
    appId: "1:1019253490645:web:4de547f9d119d8b239b35c"
};

class Firebase {
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
    }

    // inscription
    signupUser = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    // Connexion
    loginUser = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    // Deconnexion
    logoutUser = () =>
        this.auth.signOut(); 
    
}

export default Firebase;