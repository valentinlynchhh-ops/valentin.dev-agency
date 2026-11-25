// Optional: run from the existing project root after starting the local web server.
// Requires Playwright already available or installed by the developer, including browsers.
// Usage: node valentin-dev-web-handoff/qa/capture.mjs http://localhost:3000 ./qa-captures
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
const requireFromProject = createRequire(resolve(process.cwd(), 'package.json'));
let chromium;
try { ({chromium} = requireFromProject('playwright')); }
catch { try { ({chromium} = requireFromProject('@playwright/test')); } catch { throw new Error('Playwright no disponible en el proyecto. Usá el runner existente o instalalo de forma autorizada.'); } }
const url=process.argv[2] || 'http://localhost:3000';
const dir=resolve(process.argv[3] || './qa-captures');
await mkdir(dir,{recursive:true});
const ids=['inicio','proyectos','contacto','sobre-mi','vendedores','footer'];
const sizes=[[1536,864],[1920,1080],[390,844],[320,568],[768,1024],[1024,768]];
const results=[];
const browser=await chromium.launch({headless:true});
try {
  for(const [width,height] of sizes){
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
    const page=await context.newPage();const errors=[];const missing=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(url,{waitUntil:'domcontentloaded'});
    await page.evaluate(()=>document.fonts.ready);
    // Scroll through lazy content before the full-page capture.
    for(const id of ids){const el=page.locator(`#${id}`); if(await el.count()){await el.first().scrollIntoViewIfNeeded();}else missing.push(id);}
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.screenshot({path:resolve(dir,`${width}x${height}-full.png`),fullPage:true,animations:'disabled'});
    for(const [i,id] of ids.entries()){const el=page.locator(`#${id}`).first();if(await el.count()) await el.screenshot({path:resolve(dir,`${width}x${height}-${i+1}-${id}.png`),animations:'disabled'});}
    const layout=await page.evaluate(()=>({width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,emptyLinks:[...document.querySelectorAll('a[href="#"]')].length}));
    results.push({width,height,layout,missing,errors});await context.close();
  }
} finally {await browser.close();}
await writeFile(resolve(dir,'capture-report.json'),JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
if(results.some(r=>r.missing.length||r.errors.length||r.layout.scrollWidth>r.layout.width+1||r.layout.h1!==1||r.layout.emptyLinks)) process.exitCode=1;
