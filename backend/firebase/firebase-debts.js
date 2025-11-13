// Módulo Deudas
(function attachDebtsModule(){
    if (!window.walletDB || !window.WalletDB && typeof WalletDB === 'undefined') return;
    const proto = WalletDB.prototype;

    proto.addDebt = async function(data) {
        await this.init();
        const payload = {
            acreedor: data.acreedor || '',
            monto: this.normalizeAmount(data.monto),
            tasa: this.normalizeAmount(data.tasa !== undefined ? data.tasa : (data.tasaInteres || 0)),
            fechaVencimiento: data.fechaVencimiento || '',
            estado: data.estado || 'pendiente',
            fechaInicio: data.fechaInicio || '',
            descripcion: data.descripcion || '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        const ref = await this.colUser('debts').add(payload);
        return ref.id;
    };

    proto.listDebts = async function() {
        await this.init();
        const snap = await this.colUser('debts').orderBy('createdAt', 'desc').get();
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    };

    proto.updateDebt = async function(id, data) {
        await this.init();
        const payload = { ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
        if (payload.monto !== undefined) payload.monto = this.normalizeAmount(payload.monto);
        if (payload.tasa !== undefined) payload.tasa = this.normalizeAmount(payload.tasa);
        if (payload.tasa === undefined && payload.tasaInteres !== undefined) {
            payload.tasa = this.normalizeAmount(payload.tasaInteres);
            delete payload.tasaInteres;
        }
        if (payload.fechaInicio === undefined && data.fechaInicio !== undefined) payload.fechaInicio = data.fechaInicio || '';
        if (payload.descripcion === undefined && data.descripcion !== undefined) payload.descripcion = data.descripcion || '';
        await this.colUser('debts').doc(id).update(payload);
    };

    proto.deleteDebt = async function(id) {
        await this.init();
        await this.colUser('debts').doc(id).delete();
    };
})();