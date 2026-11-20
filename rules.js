"use strict";
// Pure calendar arithmetic: two collection slots per day, independent of browser timezone.
(function(root){
  function slot(row){const [y,m,d]=row.data.split("-").map(Number);return Math.floor(Date.UTC(y,m-1,d)/86400000)*2+(row.turno==="20:00"?1:0)}
  function charges(rows){
    const last=new Map(),billable=[];
    for(const r of [...rows].sort((a,b)=>slot(a)-slot(b)||a.id-b.id)){
      const p=last.get(r.palete),s=slot(r),count=p&&p.cia===r.cia&&p.slot+1===s?p.count+1:1;
      last.set(r.palete,{cia:r.cia,slot:s,count});
      if(count>=3)billable.push(r);
    }
    return billable;
  }
  const rules={slot,charges};
  if(typeof module!=="undefined")module.exports=rules;
  else root.PalletRules=rules;
})(globalThis);
