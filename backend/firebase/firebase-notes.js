// Módulo Notas: CRUD para notas financieras del usuario
(function attachNotesModule(){
  if (!window.walletDB || (typeof WalletDB === 'undefined')) return;
  const proto = WalletDB.prototype;

  proto.addNote = async function(data){
    await this.init();
    const payload = {
      titulo: data.titulo || '',
      contenido: data.contenido || '',
      categoria: data.categoria || 'general',
      prioridad: data.prioridad || 'media',
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? data.tags.toString().split(',').map(t=>t.trim()).filter(t=>t) : []),
      fechaCreacion: data.fechaCreacion || new Date().toISOString(),
      fechaModificacion: new Date().toISOString(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    const ref = await this.colUser('notes').add(payload);
    return ref.id;
  };

  proto.listNotes = async function(){
    await this.init();
    const snap = await this.colUser('notes').orderBy('createdAt','desc').get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  };

  proto.updateNote = async function(id, data){
    await this.init();
    const payload = { ...data };
    if (payload.tags && !Array.isArray(payload.tags)) {
      payload.tags = payload.tags.toString().split(',').map(t=>t.trim()).filter(t=>t);
    }
    payload.fechaModificacion = new Date().toISOString();
    payload.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    await this.colUser('notes').doc(id).update(payload);
  };

  proto.deleteNote = async function(id){
    await this.init();
    await this.colUser('notes').doc(id).delete();
  };
})();