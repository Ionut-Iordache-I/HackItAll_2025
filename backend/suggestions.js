exports.applyDisability = async(page, disability) {
    if (disability === "blindness") {
        await this.applyBlindness(page);
    } else if (disability === "low_vision") {
        await this.applyLowVision(page);
    } else if (disability === "red_color_blindness") {
        await this.applyRedColorBlindness(page);
    } else if (disability === "green_color_blindness") {
        await this.applyGreenColorBlindness(page);
    } else if (disability === "blue_color_blindness") {
        await this.applyBlueColorBlindness(page);
    } else if (disability === "night_blindness") {
        await this.applyNightBlindness(page);
    } else if (disability === "dyslexia") {
        await applyDyslexia(page);
    } else if (disability === "adhd") {
        await this.applyADHD(page);
    } else if (disability === "autism") {
        await this.applyAutism(page);
    } else if (disability === "memory_impairments") {
        await this.applyMemoryImpairments(page);
    } else if (disability === "intellectual_disabilities") {
        await this.applyIntellectualDisabilities(page);
    } else if (disability === "limited_dexterity") {
        await this.applyLimitedDexterity(page);
    } else if (disability === "paralysis") {
        await this.applyParalysis(page);
    } else if (disability === "tremors") {
        await this.applyTremors(page);
    } else if (disability === "amputation") {
        await this.applyAmputation(page);
    } else if (disability === "deafness") {
        await this.applyDeafness(page);
    } else if (disability === "hard_hearing") {
        await this.applyHardHearing(page);
    } else if (disability === "tinnitus") {
        await this.applyTinnitus(page);
    } else {
        console.error("Error: Disability type not recognized.");
    }
};

exports.applyBlindness = async(page) => {
    await page.addStyleTag({
        content: `
        * {
            color: transparent !important;
            background-color: black !important;
        }
        img, svg, video {
            display: none !important;
        }
        `
    });
};

exports.applyLowVision = async(page) => {
    await page.addStyleTag({
        content: `
          body {
            zoom: 1.5;
            font-size: 150% !important;
            line-height: 1.8 !important;
          }
        `
    });
};

exports.applyRedColorBlindness = async(page) => {
    await page.evaluate(() => {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("style", "position:absolute;width:0;height:0");
    
        svg.innerHTML = `
          <filter id="protanopia">
            <feColorMatrix type="matrix"
              values="0.567, 0.433, 0, 0, 0
                      0.558, 0.442, 0, 0, 0
                      0,     0.242, 0.758, 0, 0
                      0,     0,     0,     1, 0"/>
          </filter>
        `;
    
        document.body.appendChild(svg);
    });
    
      // Apply the filter to the whole page
    await page.addStyleTag({
        content: `
          html {
            filter: url(#protanopia) !important;
          }
        `
    });
};

exports.applyGreenColorBlindness = async(page) => {
    await page.addStyleTag({
        content: `
          html {
            filter: grayscale(0.8) brightness(1.2);
          }
        `
    });
};

exports.applyBlueColorBlindness = async(page) => {
    await page.addStyleTag({
        content: `
          html {
            filter: sepia(1) hue-rotate(90deg);
          }
        `
    });
};

exports.applyNightBlindness = async(page) => {
    await page.addStyleTag({
        content: `
          body {
            background-color: black !important;
            color: #ccc !important;
          }
          * {
            filter: brightness(0.5);
          }
        `
    });
};

exports.applyDyslexia = async (page) => {
    await page.addStyleTag({
      content: `
        * {
          font-family: "Comic Sans MS", "Arial", sans-serif !important;
          line-height: 1.6 !important;
          letter-spacing: 0.05em !important;
        }
  
        p, h1, h2, h3, h4, li {
          transform: rotate(-2deg);
          margin-bottom: 1em;
        }
  
        /* Highlight important text for better readability */
        strong, b {
          color: #c0392b !important;
        }
  
        /* Modify links to make them more readable */
        a {
          text-decoration: underline;
          color: #2980b9;
        }
      `
    });
};

exports.applyADHD = async(page) => {
    await page.addStyleTag({
        content: `
          *:focus {
            outline: 4px dashed #FF00FF !important;
            animation: pulse 1s infinite alternate;
          }
    
          @keyframes pulse {
            0% { opacity: 0.7; }
            100% { opacity: 1; }
          }
        `
    });
};

exports.applyAutism = async(page) => {
    await page.addStyleTag({
        content: `
          * {
            transition: none !important;
            animation: none !important;
          }
        `
    });
};

exports.applyMemoryImpairments = async(page) => {
    await page.evaluate(() => {
        document.title += ' - Reminder';
    });
};

exports.applyIntellectualDisabilities = async(page) => {
    await page.addStyleTag({
        content: `
          p, h1, h2, h3, h4 {
            font-size: 1.5em !important;
          }
        `
    });
};

exports.applyLimitedDexterity = async(page) => {
    await page.addStyleTag({
        content: `
          button, a, input {
            min-height: 44px;
            min-width: 44px;
            margin: 0.5em;
          }
        `
    });
};

exports.applyParalysis = async(page) => {
    await page.evaluate(() => {
      // Disable pointer interaction to simulate lack of hand control
      document.body.style.pointerEvents = 'none';
  
      // Add a banner to indicate simulation
      const banner = document.createElement('div');
      banner.innerText = "Paralysis Simulation: Mouse disabled. Use keyboard only.";
      banner.style.position = 'fixed';
      banner.style.top = '0';
      banner.style.left = '0';
      banner.style.right = '0';
      banner.style.background = '#444';
      banner.style.color = '#fff';
      banner.style.padding = '10px';
      banner.style.textAlign = 'center';
      banner.style.zIndex = 9999;
      document.body.appendChild(banner);
    });
};

exports.applyTremors = async(page) => {
    await page.evaluate(() => {
      // Add jitter effect to simulate tremors
      let jitter = setInterval(() => {
        document.body.style.transform = `translate(${Math.random() * 2}px, ${Math.random() * 2}px)`;
      }, 100);
  
      // Add notice banner
      const banner = document.createElement('div');
      banner.innerText = "Tremors Simulation: Interface jittering to simulate motor instability.";
      banner.style.position = 'fixed';
      banner.style.top = '0';
      banner.style.left = '0';
      banner.style.right = '0';
      banner.style.background = '#ffc107';
      banner.style.color = '#000';
      banner.style.padding = '10px';
      banner.style.textAlign = 'center';
      banner.style.zIndex = 9999;
      document.body.appendChild(banner);
  
      // Store reference to stop jitter if needed
      window.__tremors_jitter__ = jitter;
    });
};

exports.applyAmputation = async(page) => {
    await page.evaluate(() => {
      // Simulate single-switch input by disabling mouse and most keyboard inputs
      document.body.style.pointerEvents = 'none';
  
      // Allow only "Tab" and "Enter" keys for navigation
      document.addEventListener('keydown', (e) => {
        if (!['Tab', 'Enter'].includes(e.key)) {
          e.preventDefault();
        }
      });
  
      // Add banner
      const banner = document.createElement('div');
      banner.innerText = "Amputation Simulation: Mouse disabled. Use Tab + Enter only.";
      banner.style.position = 'fixed';
      banner.style.top = '0';
      banner.style.left = '0';
      banner.style.right = '0';
      banner.style.background = '#b71c1c';
      banner.style.color = '#fff';
      banner.style.padding = '10px';
      banner.style.textAlign = 'center';
      banner.style.zIndex = 9999;
      document.body.appendChild(banner);
    });
};

exports.applyDeafness = async(page) => {
    await page.evaluate(() => {
        const mediaElements = [...document.querySelectorAll('audio, video')];
        mediaElements.forEach(media => {
          media.muted = true;
    
          // Visually indicate that this is an audio/video element
          media.style.outline = '3px solid red';
          media.setAttribute('aria-label', 'Audio muted due to deafness simulation');
    });
    
        // Add a banner or notice for users
        const banner = document.createElement('div');
        banner.innerText = "Deafness Simulation: All sounds are muted. Consider captions or transcripts.";
        banner.style.position = 'fixed';
        banner.style.top = '0';
        banner.style.left = '0';
        banner.style.right = '0';
        banner.style.background = '#ff4444';
        banner.style.color = 'white';
        banner.style.padding = '10px';
        banner.style.textAlign = 'center';
        banner.style.zIndex = 10000;
        document.body.appendChild(banner);
    });
};

exports.applyHardHearing = async(page) => {
    await page.evaluate(() => {
        document.querySelectorAll('video, audio').forEach(el => el.muted = true);
    });
};

exports.applyTinnitus = async(page) => {
    // Mute the page but simulate tinnitus visually (for testing purposes)
    await page.evaluate(() => {
      const mediaElements = [...document.querySelectorAll('audio, video')];
      mediaElements.forEach(media => {
        media.muted = true;
      });
  
      // Add a subtle animation or overlay to simulate tinnitus distraction
      const overlay = document.createElement('div');
      overlay.innerText = "🔊 Tinnitus Simulation: Persistent ringing (audio is muted)";
      overlay.style.position = 'fixed';
      overlay.style.bottom = '10px';
      overlay.style.right = '10px';
      overlay.style.background = '#333';
      overlay.style.color = 'white';
      overlay.style.padding = '8px 12px';
      overlay.style.borderRadius = '6px';
      overlay.style.fontSize = '14px';
      overlay.style.zIndex = 10000;
      document.body.appendChild(overlay);
    });
  };