const admin = require('firebase-admin');


const db = admin.firestore();
module.exports = {
  async getFirestoreData() {
    const collectionRef = db.collection("Formulir");
    
    const querySnapshot = await collectionRef.get();
    const values = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      data.id = doc.id; // Add the document ID to the data object
      return data;
    });
    const jsonFile = JSON.stringify(values);
    const jsonString = JSON.parse(jsonFile);
    console.log(jsonFile);
    return jsonString;
  },
  async deleteFirestoreData(id) {
    const collectionRef = db.collection("Formulir");
    const documentRef = collectionRef.doc(id);
    await documentRef.delete();
},
}
