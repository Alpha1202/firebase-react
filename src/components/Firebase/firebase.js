import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';


      const firebaseConfig = {
            apiKey: "AIzaSyD46X-BXZsjFDR8IpXJ8rfpq-VC5DpQ4mQ",
            authDomain: "react-firebase-auth-d0b76.firebaseapp.com",
            databaseURL: "https://react-firebase-auth-d0b76.firebaseio.com",
            projectId: "react-firebase-auth-d0b76",
            storageBucket: "react-firebase-auth-d0b76.appspot.com",
            messagingSenderId: "532997110395",
            appId: "1:532997110395:web:15e068a3d3a0e9e78880de",
            measurementId: "G-G5YEPK8PNS"
          };
  

  class Firebase {
      constructor() {
          app.initializeApp(firebaseConfig);

          this.auth = app.auth();
          this.db = app.database();
      }


      //  *** AUTH API ***

    doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

    //  **** USER API ***

    user = uid => this.db.ref(`users/${uid}`);

    users = () => this.db.ref('users');

    // *** MERGE AUTH AND DB USER API *** //

    onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {

        this.user(authUser.uid)
          .once('value')
          .then(snapshot => {
            const dbUser = snapshot.val();
            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = {};
            }

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              ...dbUser,
            };

            next(authUser);

          });

      } else {

        fallback();
        
      }
    });
    
  }

  export default Firebase;