const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
require('dotenv').config();

const testRoute = require('../../routes/testRoute');
const staffRoute = require('../../routes/staffRoute');
const departmentRoute = require('../../routes/departmentRoute');
const sdRoute = require('../../routes/sdRoute');
const taskRoute = require('../../routes/taskRoute');

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.get('/api/', (req, res) => {
  res.json({ message: 'Serverless server is running! 🚀' });
});

app.use('/api/test', testRoute);
app.use('/api/staff', staffRoute);
app.use('/api/department', departmentRoute);
app.use('/api/sd', sdRoute);
app.use('/api/task', taskRoute);

module.exports.handler = serverless(app);