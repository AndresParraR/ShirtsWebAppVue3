import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyAe1ezwQRUj6zJHt7q24JMGUMXlZIcsyEY",
  authDomain: "shirts-6ecde.firebaseapp.com",
  projectId: "shirts-6ecde",
  storageBucket: "shirts-6ecde.appspot.com",
  messagingSenderId: "463501757081",
  appId: "1:463501757081:web:8de390f0dfa3f58db0c608",
  measurementId: "G-3K17SX2VEP",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage();

// Create a storage reference from our storage service
const storageDesign = ref(storage, "design");
const storageEditor = ref(storage, "editor");

const uploadFileDesign = async (file: Blob) => {
  const storageRef = ref(storageDesign, uuidv4());
  const res = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};

const uploadFileEditor = async (file: Blob) => {
  const storageRef = ref(storageEditor, uuidv4());
  const res = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};

export { db, storageDesign, uploadFileDesign, uploadFileEditor };
