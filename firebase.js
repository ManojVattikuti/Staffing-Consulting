// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceaccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'consultancy-b314c.firebasestorage.app'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { db, bucket };