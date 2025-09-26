const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
require('dotenv').config();

const testRoute = require('../../routes/testRoute');
const registerRoute = require('../../routes/registerRoute');

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.get('/api/', (req, res) => {
  res.json({ message: 'Serverless server is running! 🚀' });
});

app.use('/api/test', testRoute);
app.use('/api/register', registerRoute);

module.exports.handler = serverless(app);