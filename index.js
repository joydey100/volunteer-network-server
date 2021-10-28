const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

// Middle Ware
app.use(cors());
app.use(express.json());

// Connect with mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eyyvk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Run a function to create route and server and connect
async function run() {
  try {
    await client.connect();
    const database = client.db("volunteer-net");
    const serviceCollection = database.collection("services");
    const lists = database.collection("list-member");

    // Get Services
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // Get single service
    app.get("/registration/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.json(result);
    });

    // post lists
    app.post("/post-event", async (req, res) => {
      const info = req.body;
      const result = await lists.insertOne(info);
      res.json(result);
    });

    // get lists
    app.get("/lists", async (req, res) => {
      const cursor = lists.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // specific user list
    app.get("/lists/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const cursor = await lists.find(query).toArray();
      res.json(cursor);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Volunteer List Server");
});

app.listen(port, () => {
  console.log("Server is Running at", port);
});
