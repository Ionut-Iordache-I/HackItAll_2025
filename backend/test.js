const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axeSource = require('axe-core').source;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the target page
  await page.goto('https://example.com', { waitUntil: 'networkidle0' });

  // Inject axe-core script into the page
  await page.evaluate(axeSource);

  // Run axe-core accessibility checks
  const results = await page.evaluate(async () => {
    return await axe.run();
  });

  // Output results to console
  console.log(JSON.stringify(results, null, 2));

  // Optionally save the results to a file
  fs.writeFileSync(
    path.join(__dirname, 'axe-results.json'),
    JSON.stringify(results, null, 2)
  );

  await browser.close();
})();