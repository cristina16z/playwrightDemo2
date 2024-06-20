const {chromium}= require('playwright');

(async () =>{
    

    //si es headless: true --> no se verá el navegador
    const browser = await chromium.launch({headless : false});

    const context = await browser.newContext(/*{recordVideo:{dir: './videos'}}*/);
    const page = await context.newPage();

    await page.goto('https://dev.to'); //node index.js
    await page.type('#header-search input[type=text]', 'playwright');
    await page.waitForTimeout(1000);
    await page.click('#header-search button[type=submit]');
    

    //esperar a qué el selector esté cargado en pantalla
    await page.waitForSelector('#articles-list article');


    const links = await page.evaluate(() => {

        const items = document.querySelectorAll('article.crayons-story h3 a');

        const links = [];
        
        for (let item of items){
            links.push(item.href);
        }
        return links;

    });

    //iteramos en cada página, enlace guardando su h1
    for (let link of links) {
        await page.goto(link);

        const h1txt = await page.evaluate(() => document.querySelector('h1').innerText);
        console.log(h1txt);

        await page.waitForTimeout(1000);

    }

    await context.close();
    await browser.close();


})();