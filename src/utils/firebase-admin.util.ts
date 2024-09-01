// src/utils/firebase.util.ts
import * as admin from "firebase-admin";
import * as serviceAccount from "C:/Users/hp/Desktop/Ai Powered Recruitment System/src/aiprs-ba699-firebase-adminsdk-7akpp-0fad497665.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: "aiprs-ba699.appspot.com",
});

export const storage = admin.storage().bucket();
