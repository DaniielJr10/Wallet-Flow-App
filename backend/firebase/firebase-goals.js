// Módulo Objetivos
(function attachGoalsModule(){
    if (!window.walletDB || !window.WalletDB && typeof WalletDB === 'undefined') return;
    const proto = WalletDB.prototype;

    proto.addGoal = async function(data) {
        await this.init();
        const payload = {
            titulo: data.titulo || '',
            descripcion: data.descripcion || '',
            montoObjetivo: this.normalizeAmount(data.montoObjetivo),
            montoActual: this.normalizeAmount(data.montoActual),
            fechaLimite: data.fechaLimite || '',
            estado: data.estado || 'en_progreso',
            progreso: this.normalizeAmount(data.progreso !== undefined ? data.progreso : 0),
            prioridad: data.prioridad || '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        const ref = await this.colUser('goals').add(payload);
        return ref.id;
    };

    proto.listGoals = async function() {
        await this.init();
        const snap = await this.colUser('goals').orderBy('createdAt', 'desc').get();
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    };

    proto.updateGoal = async function(id, data) {
        await this.init();
        const payload = { ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
        if (payload.montoObjetivo !== undefined) payload.montoObjetivo = this.normalizeAmount(payload.montoObjetivo);
        if (payload.montoActual !== undefined) payload.montoActual = this.normalizeAmount(payload.montoActual);
        if (payload.progreso !== undefined) payload.progreso = this.normalizeAmount(payload.progreso);
        await this.colUser('goals').doc(id).update(payload);
    };

    proto.deleteGoal = async function(id) {
        await this.init();
        await this.colUser('goals').doc(id).delete();
    };
})();