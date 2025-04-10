// Initialisation Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBJuhqmuxlJWonHHlCtLN1j7ANqHusCG9Q",
  authDomain: "africanfood17-fbeac.firebaseapp.com",
  projectId: "africanfood17-fbeac",
  storageBucket: "africanfood17-fbeac.firebasestorage.app",
  messagingSenderId: "1096962889528",
  appId: "1:1096962889528:web:2c3962097ff309f9e913cd"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Le reste du code JS a déjà été fourni plus haut