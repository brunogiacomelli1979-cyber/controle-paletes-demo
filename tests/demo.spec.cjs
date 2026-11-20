const {test,expect}=require('@playwright/test');
async function entry(page,pallet='TESTE123',cia='007'){
 await page.locator('#pallet').fill(pallet);await page.locator('#airline').fill(cia);await page.getByRole('button',{name:'Registrar palete',exact:true}).click();
}
test.beforeEach(async({page})=>{await page.goto('./')});
test('cadastro, CIA com zero, duplicata entre companhias e exclusão',async({page})=>{
 await entry(page);const row=page.locator('#todayRows tr').filter({hasText:'TESTE123'});await expect(row).toContainText('007');
 await entry(page,'TESTE123','009');await expect(page.locator('#notice')).toContainText('já está cadastrado');await expect(row).toHaveCount(1);
 await row.getByRole('button').click();await expect(row).toHaveCount(0);await expect(page.locator('#notice')).toContainText('excluído');
});
test('rejeita palete inválido e código incompleto',async({page})=>{
 await entry(page,'ABC!');await expect(page.locator('#notice')).toContainText('sem espaços');
 await entry(page,'VALIDO1','01');await expect(page.locator('#notice')).toContainText('três dígitos');
});
test('mesmo palete permitido no outro turno e memória reiniciada',async({page})=>{
 await entry(page);await page.locator('input[value="20:00"]').check();await entry(page);await expect(page.locator('#todayRows tr').filter({hasText:'TESTE123'})).toHaveCount(2);
 await page.reload();await expect(page.locator('#todayRows')).not.toContainText('TESTE123');
});
test('relatórios, filtros, consulta e estado vazio',async({page})=>{
 await page.locator('#navReport').click();await expect(page.locator('#reportScreen')).toBeVisible();
 await page.locator('#filterCia').selectOption('004');await expect(page.locator('#reportRows')).toContainText('PMCFRONTEIRA');await expect(page.locator('#mPeriods')).toHaveText('2');
 await page.locator('#searchPallet').fill('inexistente');await expect(page.locator('#reportRows')).toContainText('Nenhum');
 await page.locator('#searchPallet').fill('fronteira');await expect(page.locator('#mPeriods')).toHaveText('2');
 await page.locator('#month').fill('1999-01');await expect(page.locator('#mPeriods')).toHaveText('0');
 await page.locator('#navEntry').click();await expect(page.locator('#entryScreen')).toBeVisible();
});
test('CSV respeita filtros e preserva CIA textual',async({page})=>{
 await page.locator('#navReport').click();await page.locator('#filterCia').selectOption('004');
 const pending=page.waitForEvent('download');await page.locator('#csv').click();const download=await pending;
 expect(download.suggestedFilename()).toMatch(/^paletes-demo-.*\.csv$/);
 const stream=await download.createReadStream();const buffers=[];for await(const chunk of stream)buffers.push(chunk);
 const text=Buffer.concat(buffers).toString('utf8');expect(text).toContain('PMCFRONTEIRA;004;2');expect(text.split('\r\n')).toHaveLength(2);
});
test('impressão mantém faixa e referência do relatório',async({page})=>{
 await page.locator('#navReport').click();await page.evaluate(()=>window.print=()=>{window.printInvoked=true});await page.locator('#print').click();expect(await page.evaluate(()=>window.printInvoked)).toBe(true);
 await page.emulateMedia({media:'print'});await expect(page.locator('.warning')).toBeVisible();await expect(page.locator('#reportReference')).toBeVisible();await expect(page.locator('.filters')).toBeHidden();
});
test('celular sem transbordamento e navegação por teclado',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const screen of ['#navEntry','#navReport']){await page.locator(screen).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)}
 await page.locator('#navEntry').focus();await page.keyboard.press('Enter');await expect(page.locator('#entryScreen')).toBeVisible();await page.keyboard.press('Tab');await expect(page.locator('#navReport')).toBeFocused();
});
test('sessão isolada sem erros, requisições externas ou persistência',async({browser,baseURL})=>{
 const context=await browser.newContext();const page=await context.newPage();const requests=[],errors=[];
 page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto(baseURL);await entry(page);await page.locator('#navReport').click();await page.locator('#reset').click();
 expect(errors).toEqual([]);expect(requests.every(url=>new URL(url).origin===new URL(baseURL).origin)).toBe(true);
 expect(await context.cookies()).toEqual([]);expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length])).toEqual([0,0]);
 expect(requests.filter(x=>x.endsWith('.css')).length).toBe(1);expect(requests.filter(x=>x.endsWith('.js')).length).toBe(2);
 await context.close();
});
