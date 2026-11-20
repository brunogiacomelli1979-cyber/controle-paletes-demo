const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const files=['index.html','app.js','rules.js','styles.css'];
test('runtime sem rede, armazenamento, marcas ou configurações operacionais',()=>{
 const forbidden=/workers\.dev|\/api\/|\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|indexedDB|localStorage|sessionStorage|document\.cookie|database_id|cloudflare|viracopos|https?:\/\/|@import|\burl\s*\(/i;
 for(const file of files)assert.doesNotMatch(fs.readFileSync(file,'utf8'),forbidden,file);
});
test('sem credenciais conhecidas ou identificadores de banco',()=>{
 for(const file of files)assert.doesNotMatch(fs.readFileSync(file,'utf8'),/gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_|BEGIN (?:RSA |OPENSSH )?PRIVATE KEY|[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}/i,file);
});
test('CSP bloqueia conexões e formulários externos',()=>{
 const html=fs.readFileSync('index.html','utf8');
 for(const directive of ["connect-src 'none'","form-action 'none'","script-src 'self'","object-src 'none'"])assert.ok(html.includes(directive));
});

