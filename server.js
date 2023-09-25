const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const main = require('./src/routers/main')
const data = require('./src/routers/db')

const app = express()

//Middleware used to parse the JSON bodies
app.use(express.json())
app.use(cors())

//calling the router end points with main router keyword
app.use('/data', data)
app.use('/main', main)
app.get("*", (req, res) => {

  res.sendFile(path.join(__dirname, "./src/build/index.html"));

});
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json({ limit: '5mb' }));
app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, "./src/build/index.html")));
app.use(function (req, res, next) {

  res.header("Access-Control-Allow-Orgin", "*");

  res.header("Access-Control-Allow-Header", "Orgin,X-Request-With, Content-Type, Accept");

  res.header("Cache-Control", "no-cache, no-store, must-revalidate");

  res.header("Pragma", "no-cache");

  res.header("Expires", 0);

  next();

});
mongoose.connect('mongodb+srv://devahari:KPcIX1NxmagZkdps@devahari6465.vok7c.mongodb.net/election?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const PORT = 5000

//start the server

app.listen(PORT, () => {
  console.log("The server connected to port", PORT)
})