import firebaseAdmin from 'firebase-admin';
import 'dotenv/config';

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.applicationDefault()
});

export default firebaseAdmin;