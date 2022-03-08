import firebase from 'firebase/compat'

const firebaseConfig = {
    apiKey: "AIzaSyAWRh3I-U-fOJ04H_AY3ynt-MO8JixXzMk",
    authDomain: "slack-clone-afef1.firebaseapp.com",
    projectId: "slack-clone-afef1",
    storageBucket: "slack-clone-afef1.appspot.com",
    messagingSenderId: "539392371761",
    appId: "1:539392371761:web:d0bd9440259b31c3acb910"
}

const firebaseApp = firebase.initializeApp(firebaseConfig)
const firestore = firebaseApp.firestore()
const storage = firebaseApp.storage()
const db = {
    users: firestore.collection('users'),
    channels: firestore.collection('channels'),
    directs: firestore.collection('directs'),
    formatDoc: doc => {
        return {id: doc.id || doc.uid, ...doc.data()}
    },
    getCurrentTimestamp: firebase.firestore.FieldValue.serverTimestamp()
}
const auth = firebase.auth()
const providers = {
    google: new firebase.auth.GoogleAuthProvider(),
    email: new firebase.auth.EmailAuthProvider()
}

export {auth, db, storage, providers}