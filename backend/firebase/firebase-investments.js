// Módulo Inversiones
(function attachInvestmentsModule(){
    if (!window.walletDB || !window.WalletDB && typeof WalletDB === 'undefined') return;
    const proto = WalletDB.prototype;

    proto.addInvestment = async function(data) {
        await this.init();
        const payload = {
            tipo: data.tipo || '',
            activo: data.activo || '',
            monto: this.normalizeAmount(data.monto),
            fechaInicio: data.fechaInicio || data.fecha || '',
            fechaFin: data.fechaFin || '',
            riesgo: data.riesgo || '',
            rendimientoEsperado: this.normalizeAmount(
                data.rendimientoEsperado !== undefined ? data.rendimientoEsperado : (data.rentabilidad || 0)
            ),
            descripcion: data.descripcion || '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        const ref = await this.colUser('investments').add(payload);
        return ref.id;
    };

    proto.listInvestments = async function() {
        await this.init();
        const snap = await this.colUser('investments').orderBy('createdAt', 'desc').get();
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    };

    proto.updateInvestment = async function(id, data) {
        await this.init();
        const payload = { ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
        if (payload.monto !== undefined) payload.monto = this.normalizeAmount(payload.monto);
        if (payload.rendimientoEsperado !== undefined) payload.rendimientoEsperado = this.normalizeAmount(payload.rendimientoEsperado);
        if (payload.rendimientoEsperado === undefined && payload.rentabilidad !== undefined) {
            payload.rendimientoEsperado = this.normalizeAmount(payload.rentabilidad);
            delete payload.rentabilidad;
        }
        if (payload.fechaInicio === undefined && data.fechaInicio !== undefined) payload.fechaInicio = data.fechaInicio || '';
        if (payload.fechaFin === undefined && data.fechaFin !== undefined) payload.fechaFin = data.fechaFin || '';
        if (payload.riesgo === undefined && data.riesgo !== undefined) payload.riesgo = data.riesgo || '';
        if (payload.descripcion === undefined && data.descripcion !== undefined) payload.descripcion = data.descripcion || '';
        await this.colUser('investments').doc(id).update(payload);
    };

    proto.deleteInvestment = async function(id) {
        await this.init();
        await this.colUser('investments').doc(id).delete();
    };
})();