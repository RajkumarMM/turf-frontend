import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    RecaptchaVerifier, 
    signInWithPhoneNumber, 
    PhoneAuthProvider,  
    signInWithCredential  
} from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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
const auth = getAuth(app);
const messaging = getMessaging(app);

// ✅ Function to register the service worker before requesting the token
const registerServiceWorker = async () => {
    try {
        const registration = await navigator.serviceWorker.register(`${window.location.origin}/firebase-messaging-sw.js`);
        console.log("Service Worker registered:", registration);
        return registration;
    } catch (error) {
        console.error("Service Worker registration failed:", error);
        return null;
    }
};


// ✅ Function to request FCM permission and get the token
const requestForToken = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            const registration = await registerServiceWorker();
            if (!registration) return null;

            const token = await getToken(messaging, {
                vapidKey: "BK2tHGg5kwUgXxqI0BMm3xzmvLRPHaJNoi-gY4KfmkcUCDcMDbI6giXTkOy4UqZZEBOzwl3Yrfo7vufu0Io9kNk",
                serviceWorkerRegistration: registration,
            });

            if (token) {
                console.log("FCM Token:", token);
                return token;
            } else {
                console.warn("No FCM token available.");
                return null;
            }
        } else {
            console.log("Notification permission denied.");
            return null;
        }
    } catch (error) {
        console.error("Error getting FCM token:", error);
        return null;
    }
};

// ✅ Listen for foreground messages
onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);
    new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/logo.png",
    });
});

export { 
    auth, 
    RecaptchaVerifier, 
    signInWithPhoneNumber, 
    PhoneAuthProvider, 
    signInWithCredential, 
    messaging, 
    requestForToken
};
