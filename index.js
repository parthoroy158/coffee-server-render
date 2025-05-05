const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://newpractice2025:hPX3BEraSHwIMmpX@cluster0.qbyxney.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const myDB = client.db("practiceOwnDB");
        const dataCollection = myDB.collection("coffees");
        const userCollection = client.db("practiceOwnDB").collection("users")

        // read the data form the database
        app.get('/coffees', async (req, res) => {
            const cursor = dataCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await dataCollection.findOne(query)
            res.send(result)
        })





        // Insert the data in server to database
        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee)
            const result = await dataCollection.insertOne(newCoffee)
            res.send(result)
        })


        app.put('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const cursor = { _id: new ObjectId(id) }
            const updateCoffee = req.body
            const options = { upsert: true };
            const updateCoffeeData = {
                $set: {
                    name: updateCoffee.name,
                    quantity: updateCoffee.quantity,
                    category: updateCoffee.category,
                    details: updateCoffee.details,
                    photo: updateCoffee.photo
                },
            };
            const result = await dataCollection.updateOne(cursor, updateCoffeeData, options);
            res.send(result)

        })



        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await dataCollection.deleteOne(query)
            res.send(result)
        })


        // here the user collection start:
        app.get('/newUsers', async (req, res) => {
            const cursor = userCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/newUsers/:id', async (req, res) => {
            const id = req.params.id;
            const cursor = { _id: new ObjectId(id) }
            const result = await userCollection.findOne(cursor);
            res.send(result)
        })


        app.patch('/newUsers', async (req, res) => {
            const email = req.body.email;
            const filter = { email };
            const updatedDoc = {
                $set: {
                    lastSignInTime: req.body?.lastSignInTime
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc)
            res.send(result)
        })

        app.post('/newUsers', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee)
            const result = await userCollection.insertOne(newCoffee)
            res.send(result)
        })

        app.delete('/newUsers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('This is the second server practice deployed in vercel')
})

app.listen(port, () => {
    console.log(`This is the port :${port}`)
})