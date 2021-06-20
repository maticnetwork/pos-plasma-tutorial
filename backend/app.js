require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const Web3 = require("web3");
const morgan = require("morgan");
const { MongoClient } = require("mongodb");

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
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.get("/", async function (req, res) {
  res.send("Blocknative POC API");
});

app.post("/watch", async function (req, res) {
  if (!/^0x([A-Fa-f0-9]{64})$/.test(req.body.hash)) {
    res.sendStatus(400);
    return;
  }
  const response = await axios.post("https://api.blocknative.com/transaction", {
    "apiKey": process.env.API_KEY,
    "hash": req.body.hash,
    "blockchain": "ethereum",
    "network": "goerli"
  });
  const newDocument = {
    hash: req.body.hash,
    status: "watched",
    lastCall: null,
    timestamp: Date.now(),
  };
  const result = await collection.insertOne(newDocument);
  res.send(result);
});

app.post("/update", async function (req, res) {
  if (req.body.replaceHash !== undefined) {
    if (await collection.countDocuments({ hash: req.body.hash }) == 0) { // check if new hash is in db before creating
      const newDocument = {
        hash: req.body.hash,
        status: req.body.status,
        lastCall: req.body,
        timestamp: Date.now(),
      };
      var result = await collection.insertOne(newDocument);
      console.log(result);
    }
    var result = await collection.updateOne(
      { hash: req.body.replaceHash },
      { $set: { status: req.body.status, lastCall: req.body, timestamp: Date.now(), newHash: req.body.hash } }
    ); // update old tx status (speedup/cancels)
    console.log(result);
  } else {
    var result = await collection.updateOne(
      { hash: req.body.hash },
      { $set: {status: req.body.status, lastCall: req.body, timestamp: Date.now() } }
    ); // update all other kind of txs
  }
  res.send(result);
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Server starting on port 8080...")
});
