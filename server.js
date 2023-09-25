const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const main = require('./routers/main')
const data = require('./routers/db')

const app = express()

//Middleware used to parse the JSON bodies
app.use(express.json())
app.use(cors())

//calling the router end points with main router keyword
app.use('/data',data)
app.use('/main',main)


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

app.listen(PORT,()=>{
    console.log("The server connected to port",PORT)
})