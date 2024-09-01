const admin=require('firebase-admin');
const serviceAccount = require('../certificateHubServiceAccountKey.json')

admin.initializeApp({
  credential:admin.credential.cert(serviceAccount),
  storageBucket: 'certificate-hub.appspot.com'
})

const bucket=admin.storage().bucket();

module.exports=bucket;

