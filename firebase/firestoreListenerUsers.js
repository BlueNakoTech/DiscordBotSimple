const admin = require('firebase-admin');
const EventEmitter = require('events');

const serviceAccount = require('./firebase.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
const db = admin.firestore();



const collectionRef = db.collection('users');
const eventEmitter = new EventEmitter();


// fetchDataAndGenerateExcel().then(() => {
//   console.log('Excel file created successfully!');
//   process.exit(0);
// }).catch(error => {
//   console.error('Error:', error);
//   process.exit(1);
// });


collectionRef.onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      const data = change.doc.data();
      eventEmitter.emit('newUsers', data);
      
    }
  });
});

module.exports = eventEmitter;