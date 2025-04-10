// app.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8081;
const routes = require('./routes');

app.use(cors()); // <-- allow all origins by default
// Middleware to parse JSON request bodies
app.use(express.json());

// Use the routes defined in routes.js under the '/api' prefix
app.use('/dev', routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});