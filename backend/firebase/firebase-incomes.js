// Módulo Ingresos

(function attachIncomeModule(){
    if (!window.walletDB || !window.WalletDB && typeof WalletDB === 'undefined') return;
    const proto = WalletDB.prototype;

    proto.addIncome = async function(data) {
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
        const colRef = this.colUser('incomes');
        const addPromise = colRef.add(payload);
        const ref = await Promise.race([
            addPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout al escribir ingreso')), 15000))
        ]);
        return ref.id;
    };

    proto.listIncomes = async function() {
        await this.init();
        const snap = await this.colUser('incomes').orderBy('createdAt', 'desc').get();
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    };

    proto.updateIncome = async function(id, data) {
        await this.init();
        const payload = { ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
        if (payload.monto !== undefined) payload.monto = this.normalizeAmount(payload.monto);
        await this.colUser('incomes').doc(id).update(payload);
    };

    proto.deleteIncome = async function(id) {
        await this.init();
        await this.colUser('incomes').doc(id).delete();
    };
})();