const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axeSource = require('axe-core').source;

severityMap = {
  "minor": 1,
  "moderate": 2,
  "serious": 4,
  "critical": 5
}

exports.analyze = async (url, mapping) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

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
  
  results['violations'].map((violation) => {
    if (mapping[violation.id]) {
      selectedScore += severityMap[violation.impact] * mapping[violation.id] * violation.nodes.length;
      generalScore += severityMap[violation.impact] * mapping[violation.id] * violation.nodes.length;
      percentPerMappings[violation.id] = severityMap[violation.impact] * mapping[violation.id] * violation.nodes.length;
      violationDetails[violation.id] = violation;
    } else {
      generalScore += severityMap[violation.impact];
    }
  })

  let percent = (selectedScore / generalScore) * 100;

  for (let key of Object.keys(percentPerMappings)) {
    percentPerMappings[key] = (percentPerMappings[key] / generalScore) * 100;
    console.log(percentPerMappings[key]);
  }

  console.log(percent + "%")
  console.log(violationDetails)

  await browser.close();

  return { percent, percentPerMappings, violationDetails };
};