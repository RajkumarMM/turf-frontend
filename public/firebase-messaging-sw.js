import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// Firebase Configuration (use the same config as firebaseConfig.js)
const firebaseConfig = {
    apiKey: "AIzaSyAwgOyk706DEWRFy6FjqE4pcX33Ddzzn3E",
    authDomain: "turf-86bf0.firebaseapp.com",
    projectId: "turf-86bf0",
    storageBucket: "turf-86bf0.appspot.com",
    messagingSenderId: "888916210946",
    appId: "1:888916210946:web:54b477936eb26857217e1b",
    measurementId: "G-4BGJCD9LGP"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Handle background messages
onBackgroundMessage(messaging, (payload) => {
  console.log("Received background message: ", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png", // Update with your app icon
  });
});
