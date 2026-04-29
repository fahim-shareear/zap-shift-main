const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 3000;
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const crypto = require("crypto");
const admin = require("firebase-admin");

//middleware starting:
const app = express();
app.use(cors());
app.use(express.json());

const verifyFirebase = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403).send({ message: "Unauthorized access" });
    }

    try {
        const idToken = token.split(' ')[1];
        const decoded = await admin.auth().verifyIdToken(idToken);
        // console.log(decoded);
        req.decoded_email = decoded.email;
        next();
    }
    catch (err) {
        return res.status(401).send({ message: "Unauthorized Access." })
    }
};


const uri = process.env.MONGO_URI
const serviceAccount = require("./zap-shift-firebase-sdk-key.json");

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

function generateTrackingId() {
    const prefix = "PRCL";
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = crypto.randomBytes(3).toString("hex").toUpperCase();

    return `${prefix}-${date}-${random}`;
};

async function run() {
    try {
        await client.connect();
        const userMain = client.db("zapShift");
        const usersCollection = userMain.collection("users");
        const feedback = userMain.collection("feedback");
        const parcelsCollection = userMain.collection("parcels");
        const paymentCollection = userMain.collection('payments');
        const riderCollection = userMain.collection("rider");


        //middleware for verifying admin:
        //must be user after verifying firebase token middleware
        const verifyAdmin = async (req, res, next) =>{
            const email = req.decoded_email;
            const query = {email};
            const user = await usersCollection.findOne(query);

            if(!user || user.role !== 'admin'){
                return res.status(403).send({message: 'Forbidded Access'});
            }

            next();
        }

        //getting all the users api:
        app.get("/users", verifyFirebase, async (req, res) => {
            const cursor = usersCollection.find().sort({ createdAt: -1 });
            const result = await cursor.toArray();
            res.send(result);
        });

        //posting api for creating users:
        app.post("/users", verifyFirebase, async (req, res) => {
            const users = req.body;
            const query = { email: users.email };
            const existingUser = await usersCollection.findOne(query);

            if (existingUser) {
                return res.send({ message: "user exists" })
            };

            users.role = 'user';
            users.createdAt = new Date();

            const result = await usersCollection.insertOne(users);
            res.send(result);
        });

        app.patch("/users/:id/role", verifyFirebase, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const roleInfo = req.body;
            const query = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    role: roleInfo.role
                }
            }

            const result = await usersCollection.updateOne(query, updatedDoc);
            res.send(result);
        });

        app.get("/users/:email/role", async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ role: user?.role || "user" });
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
                    parcelId: paymentInfo.parcelId,
                    parcelName: paymentInfo.parcelName
                },
                success_url: `${process.env.SITE_URL}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.SITE_URL}/dashboard/payment-cancelled?success=false`,
            });

            res.redirect(303, session.url);
            // console.log(session);
            res.send({ url: session.url });
        });


        //updating the parcel info after confirming if the payment is successful
        app.patch('/payment-success', async (req, res) => {
            const sessionId = req.query.session_id;
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            const trackingId = generateTrackingId();

            const transactionId = session.payment_intent;
            const query = { transactionId: transactionId };

            const paymentExists = await paymentCollection.findOne(query);

            if (paymentExists) {
                return res.send({
                    message: 'already exists',
                    transactionId,
                    trackingId
                });
            };


            if (session.payment_status === 'paid') {
                const id = session.metadata.parcelId;
                const query = { _id: new ObjectId(id) };
                const update = {
                    $set: {
                        paymentStatus: 'paid',
                        createdAt: new Date(),
                        trackingId: trackingId
                    }
                }
                const result = await parcelsCollection.updateOne(query, update);

                // Creating payment history:
                const payment = {
                    name: session.metadata.parcelName,
                    amount: session.amount_total / 100,
                    currency: session.currency,
                    customer_email: session.customer_email,
                    parcelId: session.metadata.parcelId,
                    parcelName: session.metadata.parcelName,
                    transactionId: session.payment_intent,
                    paymentStatus: session.payment_status,
                    trackingId: trackingId,
                    paidAt: new Date(),
                };

                if (session.payment_status === 'paid') {
                    const resultPayment = await paymentCollection.insertOne(payment);
                    res.send({
                        success: true,
                        modifyParcel: result,
                        paymentInfo: resultPayment,
                        trackingId,
                        transactionId: session.payment_intent
                    });
                };
            };
            // console.log('Session Retrieve', session);
        });


        //getting the payments:
        app.get('/payments', verifyFirebase, async (req, res) => {
            const email = req.query.email;
            const query = {};
            if (email) {
                query.customer_email = email;
            };

            if (email !== req.decoded_email) {
                return res.status(403).send({ message: "Forbidded Request" })
            }

            const cursor = paymentCollection.find(query).sort({ paidAt: -1 });
            const result = await cursor.toArray();
            res.send(result);
        });


        //rider related apis:
        app.post('/riders', async (req, res) => {
            const rider = req.body;
            // console.log(rider)

            const query = { riderEmail: rider.riderEmail };
            const existingApplication = await riderCollection.findOne(query);
            // console.log(existingApplication);

            if (existingApplication) {
                return res.status(409).send({
                    message: 'You have already applied to become a rider.'
                })
            };

            rider.status = 'pending';
            rider.createdAt = new Date();

            const result = await riderCollection.insertOne(rider);
            res.status(201).send(result);
        });

        app.get('/riders', verifyFirebase, verifyAdmin, async (req, res) => {
            const query = {};
            if (req.query.status) {
                query.status = req.query.status;
            }
            const cursor = riderCollection.find(query).sort({ createdAt: -1 });
            const result = await cursor.toArray();
            res.send(result);
        });

        app.patch('/riders/:id', verifyFirebase, verifyAdmin, async (req, res) => {
            const status = req.body.status;
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const riderApplication = await riderCollection.findOne(query);

            if (!riderApplication) {
                return res.status(404).send({ message: "Rider Application not found" });
            };


            const updateDoc = {
                $set: {
                    status: status
                }
            };

            if (status === 'approved') {
                const userEmail = riderApplication.riderEmail;
                const userFilter = { email: userEmail };
                const userUpdate = {
                    $set: {
                        role: 'rider'
                    }
                };

                await usersCollection.updateOne(userFilter, userUpdate);
            }

            const result = await riderCollection.updateOne(query, updateDoc);
            res.send(result);
        });

        app.delete('/riders/:id', verifyFirebase, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await riderCollection.deleteOne(query);
            res.send(result)
        })



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