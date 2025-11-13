(function(){
  function toCSV(rows){ if(!Array.isArray(rows)||!rows.length) return ''; const headers=Object.keys(rows[0]); return [ headers.join(','), ...rows.map(r=> headers.map(h=> '"'+(r[h]??'')+'"').join(',')) ].join('\n'); }
  function download(csv,filename){ if(!csv) return; const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=filename||'data.csv'; document.body.appendChild(a); a.click(); document.body.removeChild(a); }
  window.wfUtils = window.wfUtils || {}; window.wfUtils.csv = { toCSV, download };
})();