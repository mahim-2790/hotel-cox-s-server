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
        const orderCollection = database.collection('order');


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
        });


        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        });

        //post API-add new service
        app.post('/addServices', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService)
            res.json(result);

        });


        //post API- add order
        app.post('/order', async (req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.json(result);

        });

        // get API - single data of order load 
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await orderCollection.findOne(query);
            res.json(service);
        });

        //DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });

        //UPDATE API
        app.put('/order/:id', async (req, res) => {

            const id = req.params.id;
            const updatedOrder = req.body;

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    status: updatedOrder.status
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options)

            console.log('Updating id = ', id)
            res.send(result);
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