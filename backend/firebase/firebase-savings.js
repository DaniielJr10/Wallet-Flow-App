// Módulo Ahorros
(function attachSavingsModule(){
    if (!window.walletDB || !window.WalletDB && typeof WalletDB === 'undefined') return;
    const proto = WalletDB.prototype;

    proto.addSaving = async function(data) {
        await this.init();
        const payload = {
            objetivo: data.objetivo || '',
            montoObjetivo: this.normalizeAmount(data.montoObjetivo),
            montoActual: this.normalizeAmount(data.montoActual),
            fechaLimite: data.fechaLimite || '',
            cuenta: data.cuenta || '',
            descripcion: data.descripcion || '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        const ref = await this.colUser('savings').add(payload);
        return ref.id;
    };

    proto.listSavings = async function() {
        await this.init();
        const snap = await this.colUser('savings').orderBy('createdAt', 'desc').get();
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    };

    proto.updateSaving = async function(id, data) {
        await this.init();
        const payload = { ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
        if (payload.montoObjetivo !== undefined) payload.montoObjetivo = this.normalizeAmount(payload.montoObjetivo);
        if (payload.montoActual !== undefined) payload.montoActual = this.normalizeAmount(payload.montoActual);
        if (payload.descripcion === undefined && data.descripcion !== undefined) payload.descripcion = data.descripcion || '';
        await this.colUser('savings').doc(id).update(payload);
    };

    proto.deleteSaving = async function(id) {
        await this.init();
        await this.colUser('savings').doc(id).delete();
    };
})();