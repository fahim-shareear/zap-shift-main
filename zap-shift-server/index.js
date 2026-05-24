const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const dns = require('dns').promises;
const port = process.env.PORT || 3000;
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const crypto = require("crypto");
const admin = require("firebase-admin");

async function checkInternetConnection() {
    try {
        await dns.resolve4('8.8.8.8');
        console.log("Internet connection detected");
        return true;
    } catch (err) {
        console.error("No internet connection detected", err.message);
        return false;
    };
};



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
const { rejects } = require('assert');

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
        const trackingCollection = userMain.collection("trackings");
        const payrollCollection = userMain.collection("payroll");


        //middleware for verifying admin:
        //must be user after verifying firebase token middleware
        const verifyAdmin = async (req, res, next) => {
            const email = req.decoded_email;
            const query = { email };
            const user = await usersCollection.findOne(query);

            if (!user || user.role !== 'admin') {
                return res.status(403).send({ message: 'Forbidded Access' });
            }

            next();
        };

        //tracking log functionality creation:
        const logTracking = async (trackingId, status) =>{
                const log = {
                    trackingId: trackingId,
                    status: status,
                    details: status.split("-").join(" "),
                    createdAt: new Date()
                };

                const result = await trackingCollection.insertOne(log);
                return result;
        };

        //getting all the users api:
        app.get("/users", verifyFirebase, verifyAdmin, async (req, res) => {
            const searchText = req.query.search;
            const query = {};

            if (searchText) {
                query.$or = [
                    { displayName: { $regex: searchText, $options: "i" } },
                    { email: { $regex: searchText, $options: "i" } },
                ]
            };

            const cursor = usersCollection.find(query).sort({ createdAt: -1 });
            const result = await cursor.toArray();

            if (!result) {
                return res.status(404).send({ message: "User not available" });
            }

            return res.send(result);
        });

        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const result = await usersCollection.deleteOne(query);
            res.send(result);
        });

        //posting api for creating users:
        app.post("/users", async (req, res) => {
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

        app.get("/parcels/riders", async (req, res) => {
            const { riderEmail, deliveryStatus } = req.query;
            const query = {};
            if (riderEmail) {
                query.riderEmail = riderEmail;
            };

            if (deliveryStatus) {
                const statusArray = Array.isArray(deliveryStatus) ? deliveryStatus : JSON.parse(deliveryStatus);

                query.deliveryStatus = {$in: statusArray};
            };

            const cursor = parcelsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.delete("/parcels/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await parcelsCollection.deleteOne(query);
            res.send(result);
        });

        app.patch("/parcels/:id", async (req, res) => {
            const { riderId, riderName, riderEmail, trackingId } = req.body;
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const updatedDoc = {
                $set: {
                    deliveryStatus: "rider-assigned",
                    riderId: riderId,
                    riderName: riderName,
                    riderEmail: riderEmail,

                }
            };

            const result = await parcelsCollection.updateOne(query, updatedDoc);

            //updating rider information:
            const riderQuery = { _id: new ObjectId(riderId) };
            const riderUpdatedDoc = {
                $set: {
                    workStatus: "In Delivery"
                }
            };

            const riderResult = await riderCollection.updateOne(riderQuery, riderUpdatedDoc);

            logTracking(trackingId, "rider-assigned");

            res.send(riderResult, result);
        });

        app.get("/parcels/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await parcelsCollection.findOne(query);
            res.send(result);
        });

        app.get('/parcels', async (req, res) => {
            const query = {};
            const { email, deliveryStatus } = req.query;
            if (email) {
                query.senderEmail = email;
            };


            if (deliveryStatus) {
                query.deliveryStatus = deliveryStatus;
            };

            const options = { sort: { createdAt: -1 } }

            const cursor = parcelsCollection.find(query, options);
            const result = await cursor.toArray();
            res.send(result);
        });

        //updating info aftet rider accepts the parcel:
        app.patch('/parcels/:id/status', async (req, res) => {
            const { deliveryStatus, riderId, trackingId } = req.body;
            const query = {_id: new ObjectId(req.params.id)};
            const updatedDoc = {
                $set: {
                    deliveryStatus: deliveryStatus
                }
            };

            if(deliveryStatus === "delivered" || deliveryStatus === "pending-pickup"){
                const riderQuery = {_id: new ObjectId(riderId)};
                const riderUpdatedDoc ={
                    $set:{
                        workStatus: "available"
                    }
                };

                const riderResult = await riderCollection.updateOne(riderQuery, riderUpdatedDoc)
            };

            const result = await parcelsCollection.updateOne(query, updatedDoc);
            logTracking(trackingId, deliveryStatus);
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

            // res.redirect(303, session.url);
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
                        deliveryStatus: 'pending-pickup',
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

                    logTracking(trackingId, 'pending-pickup');


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
            const { status, district, workStatus } = req.query;

            const query = {};


            if (status) {
                query.status = status;
            };

            if (district) {
                query.district = district
            };

            if (workStatus) {
                query.workStatus = workStatus;
            };


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
                    status: status,
                    workStatus: 'available'
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
            res.send(result);
        });


        //adding payroll related api's:
        app.post("/payroll/add-commissions", verifyFirebase, async(req, res) =>{
            try{
                const {riderEmail, riderName, totalCommission, parcelCount, submittedDate, month} = req.body;

                if(!riderEmail || totalCommission === undefined){
                    return res.status(400).send({
                        success: false,
                        message: "Missing required fields"
                    });
                };

                const existingPayroll = await payrollCollection.findOne({
                    riderEmail: riderEmail,
                    month: month
                });

                if(existingPayroll){
                    return res.status(409).send({
                        success: false,
                        message: "Commission already submitted for this month"
                    });
                };

                const payrollRecord = {
                    riderEmail: riderEmail,
                    riderName: riderName,
                    totalCommission: totalCommission,
                    parcelCount: parcelCount,
                    submittedDate: submittedDate,
                    month: month,
                    status: 'pending',
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                
                const result = await payrollCollection.insertOne(payrollRecord);

                if(result.insertedId){
                    return res.status(201).send({
                        success: true,
                        message: "Commission submitted successfully",
                        payrollId: result.insertedId
                    });
                };

                return res.status(400).send({
                    success: false,
                    message: "Failed to insert paryroll record"
                });

                 
            }catch(error){
                console.log("Payroll error", error);
                res.status(500).send({
                    success: false,
                    message: "Failed to submit commission.",
                    error: error.message
                });
            };
        });

        app.get("/payroll", verifyFirebase, verifyAdmin, async(req, res)=>{
            try{
                const {riderEmail, month, status} = req.query;
                const query = {};
                if(riderEmail) query.riderEmail = riderEmail;
                if(month) query.month = month;
                if(status) query.status = status;

                const cursor = payrollCollection.find(query).sort({createdAt: -1});
                const result = await cursor.toArray();
                res.send(result);
            }catch(error){
                console.log("Error fetching payroll", error);
                res.status(500).send({message: "Failed to fetch paryroll records"});
            };
        });

        //get paryroll for specific rider:
        app.get("/payroll/:riderEmail", verifyFirebase, async(req, res)=>{
            try{
                const riderEmail = req.params.riderEmail;
                
                if(riderEmail !== req.decoded_email){
                    return res.status(403).send({message: "Forbiddedn Access"});
                };

                const cursor = payrollCollection.find({riderEmail: riderEmail}).sort({createdAt: -1});
                const result = await cursor.toArray();

                res.send(result);

            }catch(error){
                console.log("Error fetching rider payroll", error);
                res.status(500).send({message: "Failed to fetch paryroll"});
            };
        });

        //updating payroll status admin only:
        app.patch("/payroll/:id/status", verifyFirebase, verifyAdmin, async(req, res)=>{
            try{
                const payrollId = req.params.id;
                const {status} = req.body;
                const query = {_id: new ObjectId(payrollId)};

                const updatedDoc = {
                    $set:{
                        status: status,
                        updatedAt: new Date()
                    }
                };

                const result = await payrollCollection.updateOne(query, updatedDoc);
                if(result.modifiedCount === 0){
                    return res.status(404).send({message: "Payroll record not found"});
                };

                res.send({
                    success: true,
                    message: "Payroll updated successfully."
                });
            }catch(error){
                console.log("Error updating payroll", error);
                res.status(500).send({message: "Failed to update payroll status"});
            };
        });

        //parcel tracking related api:
        app.get("/trackings/:trackingId/logs", async (req, res) =>{
            const trackingId = req.params.trackingId;
            const query = {trackingId};
            const result = await trackingCollection.find(query).toArray();
            res.send(result);
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