let countries = require('./data/airports.json')
const puppeteer = require('puppeteer')
let page, country;

(async() => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  if (process.argv.length) {
    countries = countries.filter((country) => process.argv.indexOf(country.country.toLowerCase()) !== -1);
  }

  for (let x = 0 ; x < countries.length; x++) {
    const { name, country } = countries[x];
    console.log(`Rendering ${name} (${country})`);
    await page.setViewport({ width: 1200, height: 630 });
    await page.goto(`http://localhost:8000/${country.toLowerCase()}?navigation=false`);
    try {
      await page.waitForFunction(() => window.frequencies);
      await page.screenshot({ path: `./static/og-images/${country.toLowerCase()}.png` });
    }
    catch(e) {
      console.log(`Error on ${name} (${country})`);
    }
  }

  await browser.close();
})();
