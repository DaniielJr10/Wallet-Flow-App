// Base de servicio Firestore para WalletFlow (Firebase v9 compat)
// Este archivo ahora SOLO contiene la clase base y utilidades.
// Los módulos (ingresos, gastos, etc.) se agregan en archivos separados
// que extienden el prototipo de WalletDB. Mantiene compatibilidad con
// window.walletDB.addIncome(), etc., siempre que cargues los nuevos scripts.

class WalletDB {
    constructor() {
        this.db = null;
        this.initialized = false;
    }

    async init() {
        try {
            if (this.initialized) return true;
            if (typeof firebase === 'undefined') throw new Error('Firebase SDK no está cargado');
            if (!firebase.apps || firebase.apps.length === 0) {
                if (!window.firebaseConfig) throw new Error('Configuración de Firebase no encontrada');
                firebase.initializeApp(window.firebaseConfig);
            }
            if (!firebase.firestore) throw new Error('Firestore SDK no está cargado');
            this.db = firebase.firestore();
            try { this.db.settings({ ignoreUndefinedProperties: true }); } catch (_) {}
            this.initialized = true;
            return true;
        } catch (err) {
            console.error('Error iniciando WalletDB:', err);
            return false;
        }
    }

    getAuth() {
        if (window.firebaseAuth && window.firebaseAuth.auth) return window.firebaseAuth.auth;
        if (firebase && firebase.auth) return firebase.auth();
        return null;
    }

    getUid() {
        const auth = this.getAuth();
        const user = auth ? auth.currentUser : (window.firebaseAuth ? window.firebaseAuth.getCurrentUser() : null);
        return user ? user.uid : null;
    }

    requireAuth() {
        const uid = this.getUid();
        if (!uid) throw new Error('Usuario no autenticado');
        return uid;
    }

    colUser(path) {
        const uid = this.requireAuth();
        return this.db.collection('users').doc(uid).collection(path);
    }

    normalizeAmount(v) {
        const n = parseFloat(v);
        return isNaN(n) ? 0 : n;
    }
}

// Instancia global base. Los módulos se montan después.
try { window.walletDB = new WalletDB(); } catch (e) { console.error('No se pudo crear WalletDB:', e); }
