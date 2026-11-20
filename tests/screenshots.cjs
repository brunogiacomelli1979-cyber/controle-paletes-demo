const {chromium}=require('@playwright/test');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:900},timezoneId:'America/Sao_Paulo'});
 await page.goto(process.env.DEMO_URL||'http://127.0.0.1:4173');await page.locator('#todayRows tr').first().waitFor();
 fs.mkdirSync('assets/screenshots',{recursive:true});
 await page.screenshot({path:'assets/screenshots/lancamentos.png',fullPage:true});
 await page.locator('#navReport').click();await page.screenshot({path:'assets/screenshots/relatorios.png',fullPage:true});
 await page.emulateMedia({media:'print'});await page.pdf({path:'test-results/relatorio.pdf',format:'A4',landscape:true,printBackground:true});
 await browser.close();
})();

