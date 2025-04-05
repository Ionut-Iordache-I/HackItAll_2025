const service = require('./service');
  
exports.website = async (req, res) => {
    const data = req.body;

    const { url, ids } = req.body;
    
    if (!url || !ids) {
        return res.status(400).json({ error: "URL and ids are required" });
    }

    try {
        // Analyze the website for accessibility issues
        const result = await service.analyze(url, ids);

        res.status(200).json(result);

      } catch (error) {
        res.status(500).json({ error: "Error processing accessibility ids" });
      }
    
      return res;
  };