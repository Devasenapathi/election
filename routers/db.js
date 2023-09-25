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
        const localDb = client.db('election'); // Replace with your local database name
        const collection = localDb.collection('elections'); // Replace with your collection name

        const data = await collection.find({}).toArray();
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
        const clusterDb = clusterClient.db('election'); // Replace with your cluster database name
        const collection = clusterDb.collection('elections'); // Replace with your cluster collection name

        await collection.insertMany(data);
        console.log('Data inserted into MongoDB cluster');
        res.sendStatus(200)
    }

    async function transferData() {
        try {
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