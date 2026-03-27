const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 3000;
const stripe = require('stripe')(process.env.STRIPE_SECRET);

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

async function run() {
    try {
        await client.connect();
        const userMain = client.db("zapShift");
        const usersCollection = userMain.collection("users");
        const feedback = userMain.collection("feedback");
        const parcelsCollection = userMain.collection("parcels");

        //getting all the users api:
        app.get("/users", async (req, res) => {
            const cursor = usersCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        //posting api for creating users:
        app.post("/users", async (req, res) => {
            const users = req.body;
            const result = await usersCollection.insertOne(users);
            res.send(result);
        });

        //getting the feedback data and posting also:
        app.get("/feedback", async (req, res) => {
            const cursor = feedback.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        //parcel order collection endpoint:
        app.post("/parcels", async (req, res) => {
            const orders = req.body;
            orders.createdAt = new Date();
            const result = await parcelsCollection.insertOne(orders);
            res.send(result);
        });

        app.delete("/parcels/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await parcelsCollection.deleteOne(query);
            res.send(result);
        });

        app.get("/parcels/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await parcelsCollection.findOne(query);
            res.send(result);
        });

        app.get('/parcels', async (req, res) => {
            const query = {};
            const { email } = req.query;
            if (email) {
                query.senderEmail = email;
            };

            const options = { sort: { createdAt: -1 } }

            const cursor = parcelsCollection.find(query, options);
            const result = await cursor.toArray();
            res.send(result);
        });

        //CREATING STRIPE PAYMENT GETWAY:
        app.post('/create-checkout-session', async (req, res) => {
            const paymentInfo = req.body;
            const amount = parseInt(paymentInfo.cost) * 100;
            const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price_data: {
                            currency: 'bdt',
                            unit_amount: amount,
                            product_data: {
                                name: `"Please pay for:" ${paymentInfo.parcelName}`,
                            }
                        },
                        quantity: 1,
                    }
                ],
                mode: 'payment',
                customer_email: paymentInfo.senderEmail,
                metadata: {
                    parcelId: paymentInfo.parcelId
                },
                success_url: `${process.env.SITE_URL}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.SITE_URL}/dashboard/payment-cancelled?success=false`,
            });

            // res.redirect(303, session.url);
            console.log(session);
            res.send({ url: session.url });
        });


        //updating the parcel info after confirming if the payment is successful
        app.patch('/payment-success', async(req, res)=>{
            const sessionId = req.query.session_id;
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            if(session.payment_status === 'paid'){
                const id = session.metadata.parcelId;
                const query = {_id: new ObjectId(id)};
                const update = {
                    $set: {
                        paymentStatus: 'paid',
                        createdAt: new Date(),
                    }
                }
                const result = await parcelsCollection.updateOne(query, update);
                res.send(result);
            }
            console.log('Session Retrieve', session);

            res.send({success: true});
        });



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged the mondoDB server. It is connected")
    }
    finally {

    }
};

run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Server is connected");
});

app.listen(port, () => {
    console.log(`Local server is running on port ${port}`);
});