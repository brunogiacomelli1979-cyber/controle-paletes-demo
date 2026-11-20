"use strict";
// Dados fictícios mantidos apenas na memória desta página. Nenhum serviço remoto.
const el=id=>document.getElementById(id);
const parts=new Intl.DateTimeFormat("pt-BR",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
const part=type=>parts.find(p=>p.type===type).value;
const today=part("year")+"-"+part("month")+"-"+part("day");
const dateText=day=>day.slice(8,10)+"/"+day.slice(5,7)+"/"+day.slice(0,4);
const oldDay=ago=>{const [y,m,d]=today.split("-").map(Number);return new Date(Date.UTC(y,m-1,d-ago)).toISOString().slice(0,10)};
let nextId=1, rows=[];
function restore(){
  nextId=1;
  const examples=[
    [3,"20:00","PMC12345","001"],[2,"08:00","PMC12345","001"],[2,"20:00","PMC12345","001"],[1,"08:00","PMC12345","001"],[1,"20:00","PMC12345","001"],
    [1,"08:00","AKE45012","001"],[1,"20:00","AKE45012","001"],
    [2,"20:00","PAG00188","002"],[1,"08:00","PAG00188","002"],[1,"20:00","PAG00188","002"],[0,"08:00","PAG00188","002"],
    [0,"08:00","PMC00999","003"]
  ];
  // Month boundary fixture: compute the sequence before applying monthly filters.
  const first=today.slice(0,7)+"-01";
  const previous=new Date(Date.parse(first+"T00:00:00Z")-86400000).toISOString().slice(0,10);
  examples.push([0,"20:00","AKEDEMO1","001"],[0,"08:00","PAGDEMO2","002"]);
  rows=examples.map(([age,turno,palete,cia])=>({id:nextId++,data:oldDay(age),turno,palete,cia}));
  for(const [data,turno] of [[previous,"08:00"],[previous,"20:00"],[first,"08:00"],[first,"20:00"]])
    rows.push({id:nextId++,data,turno,palete:"PMCFRONTEIRA",cia:"004"});
  for(const [age,turno,cia] of [[5,"08:00","005"],[5,"20:00","005"],[4,"20:00","005"],[3,"08:00","005"],[3,"20:00","006"],[2,"08:00","006"],[2,"20:00","006"]])
    rows.push({id:nextId++,data:oldDay(age),turno,palete:"PAGSEQUENCIA",cia});
}
el("dateToday").textContent=dateText(today);
el("month").value=today.slice(0,7);
const pallet=el("pallet"),airline=el("airline"),notice=el("notice");
pallet.addEventListener("input",()=>pallet.value=pallet.value.toUpperCase().slice(0,30));
airline.addEventListener("input",()=>airline.value=airline.value.slice(0,3));
function feedback(message,error=false){notice.textContent=message;notice.className="notice"+(error?" error":"")}
function cell(content){const td=document.createElement("td");td.textContent=String(content);return td}
function emptyRow(tbody,colspan,message){const tr=document.createElement("tr"),td=cell(message);td.colSpan=colspan;td.className="empty";tr.append(td);tbody.append(tr)}
function renderToday(){
  const tbody=el("todayRows");tbody.replaceChildren();
  const current=rows.filter(r=>r.data===today).sort((a,b)=>a.turno.localeCompare(b.turno)||a.palete.localeCompare(b.palete));
  el("todayCount").textContent=String(current.length);
  if(!current.length)emptyRow(tbody,4,"Nenhum lançamento hoje.");
  for(const r of current){
    const tr=document.createElement("tr");tr.append(cell(r.turno),cell(r.palete),cell(r.cia));
    const td=document.createElement("td"),btn=document.createElement("button");
    btn.type="button";btn.className="remove";btn.textContent="Excluir";btn.setAttribute("aria-label","Excluir "+r.palete+" do turno "+r.turno);
    btn.addEventListener("click",()=>{rows=rows.filter(x=>x.id!==r.id);feedback("Registro fictício excluído.");render()});
    td.append(btn);tr.append(td);tbody.append(tr);
  }
}
el("entryForm").addEventListener("submit",event=>{
  event.preventDefault();
  const palete=pallet.value.trim().toUpperCase(),cia=airline.value.trim(),turno=document.querySelector('input[name="shift"]:checked').value;
  if(!/^[A-Z0-9]{1,30}$/.test(palete))return feedback("Informe palete com até 30 letras ou números, sem espaços.",true);
  if(!/^[0-9]{3}$/.test(cia))return feedback("Informe exatamente três dígitos para a companhia aérea.",true);
  if(rows.some(r=>r.data===today&&r.turno===turno&&r.palete===palete))return feedback("O palete já está cadastrado neste turno fictício.",true);
  rows.push({id:nextId++,data:today,turno,palete,cia});
  pallet.value="";pallet.focus();feedback("Registrado apenas na demonstração. Nenhum dado real foi alterado.");render();
});
function currentReport(){
  const month=el("month").value,filter=el("filterCia").value,groups=new Map();
  for(const r of PalletRules.charges(rows).filter(x=>month && x.data.startsWith(month)&&(!filter||filter===x.cia)&&x.palete.includes(el("searchPallet").value.trim().toUpperCase()))){
    const key=r.cia+"|"+r.palete,previous=groups.get(key);
    groups.set(key,{cia:r.cia,palete:r.palete,count:(previous?previous.count:0)+1});
  }
  return [...groups.values()].sort((a,b)=>a.cia.localeCompare(b.cia)||a.palete.localeCompare(b.palete));
}
function renderReport(){
  const select=el("filterCia"),selected=select.value,cias=[...new Set(rows.map(r=>r.cia))].sort();
  select.replaceChildren(new Option("Todas",""));
  cias.forEach(cia=>select.add(new Option(cia,cia)));
  select.value=cias.includes(selected)?selected:"";
  const report=currentReport(),tbody=el("reportRows");tbody.replaceChildren();
  if(!report.length)emptyRow(tbody,3,"Nenhum período cobrável com este filtro.");
  for(const r of report){const tr=document.createElement("tr");tr.append(cell(r.palete),cell(r.cia),cell(r.count));tbody.append(tr)}
  el("reportReference").textContent="Referência: "+(el("month").value||"selecione o mês")+" · CIA: "+(selected||"todas")+" · Palete: "+(el("searchPallet").value||"todos");
  el("mPallets").textContent=String(new Set(report.map(r=>r.palete)).size);
  el("mPeriods").textContent=String(report.reduce((a,r)=>a+r.count,0));
  el("mCias").textContent=String(new Set(report.map(r=>r.cia)).size);
}
function render(){renderToday();renderReport()}
function navigate(section){
  const isEntries=section==="entry";el("entryScreen").hidden=!isEntries;el("reportScreen").hidden=isEntries;
  for(const [id,active] of [["navEntry",isEntries],["navReport",!isEntries]]){
    const b=el(id);b.classList.toggle("active",active);
    if(active)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");
  }
}
el("navEntry").addEventListener("click",()=>navigate("entry"));
el("navReport").addEventListener("click",()=>navigate("report"));
el("month").addEventListener("change",renderReport);
el("filterCia").addEventListener("change",renderReport);
el("searchPallet").addEventListener("input",renderReport);
el("reset").addEventListener("click",()=>{restore();el("filterCia").value="";el("searchPallet").value="";feedback("Base fictícia restaurada.");render()});
el("print").addEventListener("click",()=>window.print());
el("csv").addEventListener("click",()=>{
  const data=currentReport(),lines=["Palete;CIA;Periodos cobrados",...data.map(x=>[x.palete,x.cia,x.count].join(";"))];
  const blob=new Blob(["\ufeff"+lines.join("\r\n")],{type:"text/csv;charset=utf-8"});
  const url=URL.createObjectURL(blob),link=document.createElement("a");
  link.href=url;link.download="paletes-demo-"+el("month").value+".csv";document.body.append(link);
  link.click();link.remove();URL.revokeObjectURL(url);
});
restore();render();