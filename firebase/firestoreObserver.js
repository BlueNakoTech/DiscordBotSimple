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
  async deleteFirestoreData(documentId) {
    const collectionRef = db.collection("Formulir").doc(`${documentId}`);
    
    await collectionRef.delete();
    return true;
},

async  getDocFieldData(documentId) {
  const Id = `${documentId}`;
  const documentRef = db.collection('Formulir').doc(Id);
  const documentData = await documentRef.get();
  const fieldData = documentData.get('Discord')
  const jsonFile = JSON.stringify(fieldData);
  
  console.log(fieldData);
  return jsonFile;
},


  async writeData(data){
    const discordId = {
      discord: `${data}`
    }
    try {
      db.collection('users').doc().set(discordId)
    } catch (error) {
      console.error('Error writing to Firestore:', error);
    }
  },

  
  async writeSubmittedData(name, username, ign, nation){
    const dataForm = {
      Discord: `${username}`,
      Nama: `${name}`,
      Negara: `${nation}`,
      nickname: `${ign}`
    }
    try {
      db.collection('Formulir').doc().set(dataForm)
    } catch (error) {
      console.error('Error writing to Firestore:', error);
    }
  },

  async moveDocument(documentId, sourceCollectionName, targetCollectionName) {
    // Get a reference to the source document
    const sourceRef = db.collection(sourceCollectionName).doc(documentId);
    const sourceDoc = await sourceRef.get();
  
    if (!sourceDoc.exists) {
      throw new Error(`Document with ID ${documentId} does not exist in collection ${sourceCollectionName}`);
    }
  
    // Create a reference to the target document and set its data
    const targetRef = db.collection(targetCollectionName).doc(documentId);
    await targetRef.set(sourceDoc.data());
  
    // Delete the source document
  },

 
  
  
  
}
