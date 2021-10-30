const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ltkb6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db('hotel_cox');
        const servicesCOllection = database.collection('services');


        //get api for all
        app.get('/services', async (req, res) => {
            const cursor = servicesCOllection.find({});
            const services = await cursor.toArray();
            res.send(services);

        });


        //get api for single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCOllection.findOne(query);
            res.json(service);
        })


        //POST api
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCOllection.insertOne(service);
            res.json(result);

        });


    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);



app.get('/', (req, res) => {
    console.log('server running');
    res.send('hello from server');
})

app.listen(port, () => {
    console.log('running genius server on ', port);
})