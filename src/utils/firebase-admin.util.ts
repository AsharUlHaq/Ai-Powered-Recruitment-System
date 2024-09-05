// src/utils/firebase.util.ts
import * as admin from "firebase-admin";
// import * as serviceAccount from "./src/utils/aiprs-ba699-firebase-adminsdk-7akpp-7285ecac38.json";
import * as serviceAccount from "../utils/aiprs-ba699-firebase-adminsdk-7akpp-7285ecac38.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: "aiprs-ba699.appspot.com",
});

export const storage = admin.storage().bucket();
