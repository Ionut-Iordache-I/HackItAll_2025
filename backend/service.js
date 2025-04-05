const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axeSource = require('axe-core').source;

const mappings = JSON.parse(fs.readFileSync('./mappings.json', 'utf8'));

severityMap = {
  "minor": 1,
  "moderate": 2,
  "serious": 3,
  "critical": 4
}

exports.analyze = async (url, disability) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const disabilityIds = mappings[disability]

  await page.goto(url, { waitUntil: 'networkidle0' });

  await page.evaluate(axeSource);

  const results = await page.evaluate(async () => {
    return await axe.run({
      resultTypes: ['violations']
    });
  });

  // for debug
  fs.writeFileSync(
    path.join(__dirname, 'axe-results.json'),
    JSON.stringify(results, null, 2)
  );

  let generalScore = 0;
  let selectedScore = 0;

  let percentPerMappings = {};
  let violationDetails = {};

  disabilityIds.map((disabilityId) => {
    let violation = results['violations'].find((violation) => violation.id === disabilityId.id);

    if (violation) {
      selectedScore += severityMap[violation.impact] * violation.nodes.length;
      generalScore += severityMap[violation.impact] * violation.nodes.length;
      percentPerMappings[violation.id] = severityMap[violation.impact] * violation.nodes.length;
      violationDetails[violation.id] = violation;
    } else {
      generalScore += severityMap[disabilityId.impact];
    }
  })

  let percent = (selectedScore / generalScore) * 100;

  for (let key of Object.keys(percentPerMappings)) {
    percentPerMappings[key] = (((percentPerMappings[key] / generalScore) * 100) / percent) * 100;
  }

  await browser.close();

  return { percent, percentPerMappings, violationDetails };
};