const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 3000;

//middleware starting:
const app = express();
app.use(cors());
app.use(express.json());


const uri = process.env.MONGO_URI
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run(){
    try{
        await client.connect();
        const userMain = client.db("zapShift");
        const usersCollection = userMain.collection("users");
        const feedback = userMain.collection("feedback");

        //getting all the users api:
        app.get("/users", async(req, res)=>{
            const cursor = usersCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        //posting api for creating users:
        app.post("/users", async(req, res)=>{
            const users = req.body;
            const result = await usersCollection.insertOne(users);
            res.send(result);
        });

        //getting the feedback data and posting also:
        app.get("/feedback", async(req, res)=>{
            const cursor = feedback.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        await client.db("admin").command({ping: 1});
        console.log("Pinged the mondoDB server. It is connected")
    }
    finally{

    }
};

run().catch(console.dir);


app.get("/", (req, res)=>{
    res.send("Server is connected");
});

app.listen(port, ()=>{
    console.log(`Local server is running on port ${port}`);
});