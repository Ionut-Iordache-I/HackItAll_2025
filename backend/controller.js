const service = require('./service');
  
exports.website = async (req, res) => {
    const data = req.body;

    const { url, mapping } = req.body;
    
    if (!url || !disabilityMapping) {
        return res.status(400).json({ error: "URL and disabilityMapping are required" });
    }

    try {
        // Analyze the website for accessibility issues
        const result = service.analyze(url, mapping);

        res.status(200).json(result);

      } catch (error) {
        res.status(500).json({ error: "Error processing accessibility mapping" });
      }
    
      return res;
  };