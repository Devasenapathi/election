const express = require("express");
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;

router.get('/db', async function (req, res) {
    const localMongoURI = 'mongodb://localhost:27017/election';  // Replace with your local MongoDB URI
    const client = new MongoClient(localMongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

    client.connect()
        .then(() => {
            console.log('Connected to local MongoDB');
            transferData();
        })
        .catch(err => console.error('Error connecting to local MongoDB:', err));


    async function fetchDataFromLocal() {
        console.log("2222222222222222222222222222222222222222")
        const localDb = client.db('election'); // Replace with your local database name
        const collection = localDb.collection('states'); // Replace with your collection name

        const data = await collection.find({}).toArray();
        console.log(data)
        return data;
    }

    const clusterMongoURI = 'mongodb+srv://devahari:KPcIX1NxmagZkdps@devahari6465.vok7c.mongodb.net/election?retryWrites=true&w=majority'
    // 'mongodb+srv://devahari:KPcIX1NxmagZkdps@devahari6465.vok7c.mongodb.net/'; // Replace with your MongoDB cluster URI

    clusterClient = new MongoClient(clusterMongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

    clusterClient.connect()
        .then(() => {
            console.log('Connected to MongoDB cluster');
        })
        .catch(err => console.error('Error connecting to MongoDB cluster:', err));

    async function insertDataIntoCluster(data) {
        console.log("33333333333333333333333333333333333333333")
        const clusterDb = clusterClient.db('election'); // Replace with your cluster database name
        const collection = clusterDb.collection('states'); // Replace with your cluster collection name

        await collection.insertMany(data);
        console.log('Data inserted into MongoDB cluster');
    }

    async function transferData() {
        try {
            console.log("1111111111111111111111111111111111111111")
            const data = await fetchDataFromLocal();
            await insertDataIntoCluster(data);
        } finally {
            // Close connections when done
            await client.close();
            await clusterClient.close();
        }
    }

})


module.exports = router;