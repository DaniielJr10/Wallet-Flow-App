// Módulo Cuentas
(function attachAccountsModule(){
    if (!window.walletDB || !window.WalletDB && typeof WalletDB === 'undefined') return;
    const proto = WalletDB.prototype;

    proto.addAccount = async function(data) {
        await this.init();
        const payload = {
            nombre: data.nombre || '',
            tipo: data.tipo || '',
            entidad: data.entidad || '',
            numero: data.numero || '',
            saldo: this.normalizeAmount(data.saldo),
            moneda: data.moneda || 'COP',
            esPrincipal: !!data.esPrincipal,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        const ref = await this.colUser('accounts').add(payload);
        return ref.id;
    };

    proto.listAccounts = async function() {
        await this.init();
        const snap = await this.colUser('accounts').orderBy('createdAt', 'desc').get();
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    };

    proto.updateAccount = async function(id, data) {
        await this.init();
        const payload = { ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
        if (payload.saldo !== undefined) payload.saldo = this.normalizeAmount(payload.saldo);
        if (payload.esPrincipal !== undefined) payload.esPrincipal = !!payload.esPrincipal;
        await this.colUser('accounts').doc(id).update(payload);
    };

    proto.deleteAccount = async function(id) {
        await this.init();
        await this.colUser('accounts').doc(id).delete();
    };
})();