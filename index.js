const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.h0zb1dz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const tourismCollection = client.db('tourismDB').collection('tourism');
    const countryCollection = client.db('tourismDB').collection('country');

    app.get('/addspot', async(req, res)=>{
      const spots = tourismCollection.find();
      const result = await spots.toArray();
      res.send(result);
    })

    app.get('/countries', async(req, res)=>{
      const countries = countryCollection.find();
      const result = await countries.toArray();
      res.send(result);
    })

    app.get('/addspot/:id', async(req, res)=>{
      const id = req.params.id;
      console.log(id)
      const query = {_id: new ObjectId(id)};
      const result = await tourismCollection.findOne(query);
      res.send(result);
    })

    app.get('/mycart/:email', async(req, res)=>{
      const email = req.params.email;
      console.log(email)
      const result = await tourismCollection.find({email:req.params.email}).toArray();
      res.send(result)
    })

    app.post('/addspot', async(req, res)=>{
      const spot = req.body;
      const result = await tourismCollection.insertOne(spot);
      res.send(result);
    })

    app.post('/countries', async(req, res)=>{
      const country = req.body;
      const result = await countryCollection.insertOne(country);
      res.send();
    })

    app.put('/update/:id', async(req, res)=>{
      const id = req.params.id;
      const updatedSpot = req.body;
      console.log(updatedSpot)
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const spot = {
        $set: {
          avg_cost: updatedSpot.avg_cost,
          name: updatedSpot.name,
          email: updatedSpot.email,
          country: updatedSpot.country,
          description: updatedSpot.description,
          email: updatedSpot.email,
          image: updatedSpot.image,
          location: updatedSpot.location,
          name: updatedSpot.name,
          seasonality: updatedSpot.seasonality,
          spotname: updatedSpot.spotname,
          travel: updatedSpot.travel,
          visitors: updatedSpot.visitors
        }
      }
      const result = await tourismCollection.updateOne(filter,spot,options);
      res.send(result);
    })

    app.delete('/addspot/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await tourismCollection.deleteOne(query);
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


app.get('/', (req, res)=>{
    res.send("THE SERVER IS WORKING PROPERLY");
})

app.listen(port, ()=>{
    console.log('Server is working')
})