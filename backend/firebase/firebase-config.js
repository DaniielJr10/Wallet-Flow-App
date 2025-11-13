// Configuración Firebase para modo compat (se usa con scripts firebase-compat*.js en HTML).

const firebaseConfig = {
  apiKey: "AIzaSyDztE_yiWLWNSqzT6EPK2xar4V_NFotn78",
  authDomain: "walletflow-ed3ca.firebaseapp.com",
  projectId: "walletflow-ed3ca",
  storageBucket: "walletflow-ed3ca.firebasestorage.app",
  messagingSenderId: "273944411553",
  appId: "1:273944411553:web:6c072256cb011f1ca71fe0",
  measurementId: "G-105YB4D75Z"
};

// Exponer para que otros scripts lo usen
window.firebaseConfig = firebaseConfig;
try {
  if (typeof firebase !== 'undefined' && (!firebase.apps || firebase.apps.length === 0)) {
    firebase.initializeApp(firebaseConfig);
    console.log('[firebase-config] Firebase app inicializada (auto) projectId=', firebaseConfig.projectId);
  } else {
    console.log('[firebase-config] App ya existente, no se reinicia');
  }
} catch(e) {
  console.warn('[firebase-config] No se pudo inicializar automáticamente la app:', e.message);
}