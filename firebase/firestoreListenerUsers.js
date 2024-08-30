const admin = require('firebase-admin');
const EventEmitter = require('events');

const serviceAccount = require('./firebase.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
const db = admin.firestore();



const collectionRef = db.collection('discordusers');
const eventEmitter = new EventEmitter();

collectionRef.onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      const data = change.doc.data();
      data.docId = change.doc.id; // Include the document ID for reference
      eventEmitter.emit('newUsers', data);
    }
  });
});


module.exports = eventEmitter;