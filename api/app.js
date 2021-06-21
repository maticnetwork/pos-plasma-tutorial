require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const Web3 = require("web3");
const morgan = require("morgan");
const { MongoClient } = require("mongodb");
const Transaction = require("./schema.js");

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
    collection = db.collection("transactions");
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
  try {
    if (!/^0x([A-Fa-f0-9]{64})$/.test(req.body.hash)) {
      throw "Invalid hash sent";
    }
    const response = await axios.post("https://api.blocknative.com/transaction", {
      "apiKey": process.env.API_KEY,
      "hash": req.body.hash,
      "blockchain": "ethereum",
      "network": "goerli"
    });
    const result = await collection.insertOne(new Transaction({ hash: req.body.hash }));
    res.sendStatus(200);
  } catch(e) {
    console.error("error:", e);
    res.sendStatus(400);
  }
});

app.post("/update", async function (req, res) {
  try {
    if (req.body.replaceHash !== undefined) {
      const newDocument = new Transaction({
        hash: req.body.replaceHash,
        status: req.body.status,
        lastCall: req.body,
        oldHash: req.body.hash,
      });
      var result = await collection.insertOne(newDocument); // add the new tx to db
      var result = await collection.updateOne(
        { hash: req.body.hash },
        { $set: { status: req.body.status, lastCall: req.body, timestamp: Date.now(), newHash: req.body.replaceHash } }
      ); // update old tx status (speedup/cancels)
    } else {
      var result = await collection.updateOne(
        { hash: req.body.hash },
        { $set: {status: req.body.status, lastCall: req.body, timestamp: Date.now() } }
      ); // update all other kind of txs
    }
    res.sendStatus(200);
  } catch(e) {
    console.error("error:", e);
    res.sendStatus(400);
  }
});

app.get("/status", async function (req, res) {
  try {
    if (!/^0x([A-Fa-f0-9]{64})$/.test(req.query.hash)) {
      throw "Invalid hash sent";
    }
    var result = await collection.findOne({ hash: req.query.hash }, { projection: { _id: 0, "lastCall.apiKey": 0 } });
    if (result === null) {
      result = {};
    }
    res.send(result).json();
  } catch(e) {
    console.error("error:", e);
    res.sendStatus(400);
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Server starting on port 8080...")
});
