require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const Web3 = require("web3");
const { MongoClient, ObjectId } = require("mongodb");

var web3 = new Web3(process.env.RPC_URL);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}\
?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let collection;

async function run() {
  try {
    console.log("Starting DB connection...");
    await client.connect();
    const db = await client.db("bntestdb");
    collection = db.collection("bntestdb");
    console.log("DB ready!");
  } catch (e) {
    console.log(e);
  }
}

run();

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({credentials: true, origin: ["https://watchgod.matic.today", "http://localhost:3000", "http://localhost"]}));

app.get("/", async function (req, res) {
  res.send("Blocknative POC API");
});

app.post("/watch", async function (req, res) {
  if (!/^0x([A-Fa-f0-9]{64})$/.test(req.hash)) {
    res.sendStatus(400);
    return;
  }
  axios.post("https://api.blocknative.com/transaction", {
    "apiKey": process.env.API_KEY,
    "hash": req.hash,
    "blockchain": "ethereum",
    "network": "goerli"
  });
  const newDocument = {
    hash: req.hash,
    status: "watched",
    lastCall: null,
    timestamp: Date.now(),
  };
  const result = await collection.insertOne(newDocument);
  res.send(result.data);
});

app.get("/update", async function (req, res) {
  res.sendStatus(200);
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Server starting on port 8080...")
});
