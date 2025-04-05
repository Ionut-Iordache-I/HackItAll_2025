const express = require('express');
const router = express.Router();
const controller = require('./controller');

// Define a POST route
router.post('/website', controller.website);

module.exports = router;