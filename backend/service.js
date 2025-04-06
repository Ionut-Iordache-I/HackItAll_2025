const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axeSource = require('axe-core').source;
const suggestions = require('./suggestions');

const mappings = JSON.parse(fs.readFileSync('./mappings.json', 'utf8'));

severityMap = {
  "minor": 1,
  "moderate": 2,
  "serious": 3,
  "critical": 4
}

exports.analyze = async (url, disability) => {
  const browser = await puppeteer.launch();
  let page = await browser.newPage();

  const disabilityIds = mappings[disability]

  await page.goto(url, { waitUntil: 'networkidle0' });

  await page.evaluate(axeSource);

  const results = await page.evaluate(async () => {
    return await axe.run({
      resultTypes: ['violations']
    });
  });

  // create images dir if it doesn't exist
  if (!fs.existsSync("../frontend/public/images")) {
    fs.mkdirSync("../frontend/public/images", { recursive: true });
    console.log(`Directory created: ../frontend/public/images`);
  } else {
    console.log(`Directory already exists: ../frontend/public/images`);
  }

  fs.readdir("../frontend/public/images", (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }
  
    files.forEach((file) => {
      const filePath = path.join("../frontend/public/images", file);
  
      fs.stat(filePath, (err, stat) => {
        if (err) {
          console.error('Error stating file:', err);
          return;
        }
  
        if (stat.isFile()) {
          fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting file:', err);
            else console.log(`Deleted: ${filePath}`);
          });
        }
      });
    });
  });
  
  let images = {};

  let violations = results.violations.filter((v) =>
    disabilityIds.find((disabilityId) => v.id === disabilityId.id) !== undefined);

  // Photos without CSS
  for (const violation of violations) {
    images[violation.id] = {}

    for (const node of violation.nodes) {
      images[violation.id][node.target?.join(', ')] = {}

      for (const selector of node.target) {
        try {
          const elementHandle = await page.$(selector);
          if (elementHandle) {
            const boundingBox = await elementHandle.boundingBox();
            if (boundingBox) {
              // Capture screenshot of the clipped area for this element
              const viewport = page.viewport();
              let clipWidth = Math.min(boundingBox.width, viewport.width - boundingBox.x);
              let clipHeight = Math.min(boundingBox.height, viewport.height - boundingBox.y);
              // If the computed width/height are not positive, fallback to the element's bounding box dimensions
              if (clipWidth <= 0 || clipHeight <= 0) {
                clipWidth = boundingBox.width;
                clipHeight = boundingBox.height;
              }

              const clip = {
                x: boundingBox.x,
                y: boundingBox.y,
                width: clipWidth,
                height: clipHeight
              };
              const fileName = `${violation.id}-${selector.replace(/[^a-z0-9]/gi, '_')}-original.png`;              
              images[violation.id][node.target?.join(', ')][node.target] = {
                "original": "images/" + fileName,
                "modified": `images/${violation.id}-${selector.replace(/[^a-z0-9]/gi, '_')}-modified.png`
              }
              await page.screenshot({ path: "../frontend/public/images/" + fileName, clip });
              console.log(`Captured screenshot for ${selector} as ${fileName}`);
            }
          }
        } catch (error) {
          console.error(`Error capturing screenshot for selector ${selector}:`, error);
        }
      }
    }
  }
  await page.screenshot({ path:  path.join("../frontend/public/images/", "whole-page-original.png")});

  // for debug
  // fs.writeFileSync(
  //   path.join(__dirname, 'axe-results.json'),
  //   JSON.stringify(results, null, 2)
  // );
  
  await suggestions.applyDisability(page, disability)

  await new Promise(resolve => setTimeout(resolve, 2000));

  // Photo after CSS apply
  for (const violation of violations) {
    for (const node of violation.nodes) {
      for (const selector of node.target) {
        try {
          const elementHandle = await page.$(selector);
          if (elementHandle) {
            const boundingBox = await elementHandle.boundingBox();
            if (boundingBox) {
              // Capture screenshot of the clipped area for this element
              const viewport = page.viewport();
              let clipWidth = Math.min(boundingBox.width, viewport.width - boundingBox.x);
              let clipHeight = Math.min(boundingBox.height, viewport.height - boundingBox.y);
              // If the computed width/height are not positive, fallback to the element's bounding box dimensions
              if (clipWidth <= 0 || clipHeight <= 0) {
                clipWidth = boundingBox.width;
                clipHeight = boundingBox.height;
              }

              const clip = {
                x: boundingBox.x,
                y: boundingBox.y,
                width: clipWidth,
                height: clipHeight
              };
              const fileName = `${violation.id}-${selector.replace(/[^a-z0-9]/gi, '_')}-modified.png`;
              await page.screenshot({ path: "../frontend/public/images/" + fileName, clip });
              console.log(`Captured screenshot for ${selector} as ${fileName}`);
            }
          }
        } catch (error) {
          console.error(`Error capturing screenshot for selector ${selector}:`, error);
        }
      }
    }
  }
  await page.screenshot({ path:  path.join("../frontend/public/images/", "whole-page-modified.png")});

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

  return { percent, percentPerMappings, violationDetails, images, page };
};