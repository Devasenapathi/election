const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const mainRouter = require('./src/routers/main');
const dataRouter = require('./src/routers/db');
const path = require('path');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(morgan('dev'));

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'src/build')));

// API endpoints
app.use('/data', dataRouter);
app.use('/main', mainRouter);

// Send index.html for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/build/index.html'));
});

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', 0);
  next();
});

mongoose
  .connect('mongodb+srv://devahari:KPcIX1NxmagZkdps@devahari6465.vok7c.mongodb.net/election?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const PORT = 5000;

server.listen(PORT, () => {
  console.log('Server connected to port', PORT);
});
