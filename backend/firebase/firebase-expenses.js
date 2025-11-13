// Módulo Gastos
(function attachExpensesModule(){
    if (!window.walletDB || !window.WalletDB && typeof WalletDB === 'undefined') return;
    const proto = WalletDB.prototype;

    proto.addExpense = async function(data) {
        await this.init();
        const payload = {
            categoria: data.categoria || '',
            metodo: data.metodo || '',
            monto: this.normalizeAmount(data.monto),
            fecha: data.fecha || '',
            descripcion: data.descripcion || '',
            esRecurrente: !!data.esRecurrente,
            frecuencia: data.frecuencia || '',
            cuenta: data.cuenta || '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        const ref = await this.colUser('expenses').add(payload);
        return ref.id;
    };

    proto.listExpenses = async function() {
        await this.init();
        const snap = await this.colUser('expenses').orderBy('createdAt', 'desc').get();
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    };

    proto.updateExpense = async function(id, data) {
        await this.init();
        const payload = { ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
        if (payload.monto !== undefined) payload.monto = this.normalizeAmount(payload.monto);
        await this.colUser('expenses').doc(id).update(payload);
    };

    proto.deleteExpense = async function(id) {
        await this.init();
        await this.colUser('expenses').doc(id).delete();
    };
})();