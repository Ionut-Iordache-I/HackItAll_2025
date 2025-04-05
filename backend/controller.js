const service = require('./service');
  
exports.website = async (req, res) => {
    const data = req.body;

    const { url, disability } = req.body;
    
    if (!url || !disability) {
        return res.status(400).json({ error: "URL and disability are required" });
    }

    try {
        // Analyze the website for accessibility issues
        const result = await service.analyze(url, disability);

        res.status(200).json(result);

      } catch (error) {
        res.status(500).json({ error: "Error processing accessibility disability" });
      }
    
      return res;
  };