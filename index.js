const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");




app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running");
});

console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dtpuxcz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const addToyCollection = client.db("toyCar").collection("newtoy");

     app.get("/addtoy/:id", async (req, res) => {
       const id = req.params.id;
       console.log(id);
       const query = { _id: new ObjectId(id) };
       const result = await addToyCollection.findOne(query);
       res.send(result);
     });

     //find by catecory
     app.get("/category", async (req, res) => {
      console.log(req.query.category);
      let query = {};
      if (req.query?.category) {
        query = { category: req.query.category };
      }

      const result = await addToyCollection.find(query).toArray();
      res.send(result);
    });
    //update data

    app.put("/addtoy/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const reqBody = req.body;
    
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
    
        const updateDoc = {
          $set: {
            customerName: reqBody.name,
            email: reqBody.email,
            price: reqBody.price,
            photo: reqBody.photo,
            seller_name: reqBody.seller_name,
            category: reqBody.category,
            rating: reqBody.rating,
            quantity: reqBody.quantity,
            dadescriptionte: reqBody.dadescriptionte, // Fixed the typo here
          },
        };
    
        const result = await addToyCollection.updateOne(filter, updateDoc, options);
    
        res.send(result);
        console.log(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while updating the toy.");
      }
    });

    app.get("/addtoy", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }

      const result = await addToyCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/addtoy", async (req, res) => {
      const toy = req.body;
      console.log(toy);
      const result = await addToyCollection.insertOne(toy);
      res.send(result);
    });

    app.delete("/addtoy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addToyCollection.deleteOne(query);
      res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});
