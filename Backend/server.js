const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://20171107_db_user:1dZyrkDYV5HNCkhQ@cluster0.s8to5wg.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

async function connect() {
  await client.connect();
  console.log("Connected to MongoDB");
}

connect();

//password
//1dZyrkDYV5HNCkhQ