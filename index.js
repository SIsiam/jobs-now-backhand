const express = require('express')
const app = express()
const port = 5000
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const ObjectID = require('mongodb').ObjectID;

app.use(cors());
app.use(bodyParser.json());
const { ObjectId } = require('bson');

app.get('/', (req, res) => {
    res.status(200).send(`<h1>This Is Jobs Admin Pannel</h1>`)
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4tdw4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const JobCollection = client.db("Jobs").collection("addJobs");
    console.log('mongo err ohhh! nooo ', err);


    app.post('/addjobs', (req, res) => {
        const eventDetails = req.body;
        JobCollection.insertOne(eventDetails)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/jobs', (req, res) => {
        JobCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    app.get('/jobs/:id', (req, res) => {
        JobCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

});




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})