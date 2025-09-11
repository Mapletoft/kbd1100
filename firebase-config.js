const firebaseConfig = {
  apiKey: "AIzaSyDMcXdqI-ZBiuDOFscMY1UCwOZCWTmxkS4",
  authDomain: "kbd1100-45dda.firebaseapp.com",
  projectId: "kbd1100-45dda",
  storageBucket: "kbd1100-45dda.firebasestorage.app",
  messagingSenderId: "126532248219",
  appId: "1:126532248219:web:e0601db7cf6722603a5c3e",
  measurementId: "G-D0L7FG93DT"
};

firebase.initializeApp(firebaseConfig);

// expose handles
window.auth = firebase.auth();
window.db = firebase.firestore();