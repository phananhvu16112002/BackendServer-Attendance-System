import firebaseAdmin from 'firebase-admin/app';
import 'dotenv/config';

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.applicationDefault()
});

export default firebaseAdmin;