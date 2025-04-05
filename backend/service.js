const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axeSource = require('axe-core').source;

analyze = async (url, mapping) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle0' });

  await page.evaluate(axeSource);

  const results = await page.evaluate(async () => {
    return await axe.run({
      resultTypes: ['violations', 'incomplete', 'inapplicable']
    });
  });

  // for debug
  fs.writeFileSync(
    path.join(__dirname, 'axe-results.json'),
    JSON.stringify(results, null, 2)
  );

  results['violations'].map((violation) => {
    console.log(violation.id)
  })

  await browser.close();

  return results;
};

analyze('https://nodejs.org/en', {
  'meta-viewport-large': 2,
  'link-in-text-block': 3,
  'color-contrast': 5
});