const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://20171107_db_user:cKpMxBKZFNt03ZPG@cluster0.s8to5wg.mongodb.net/test?retryWrites=true&w=majority";

async function run() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected!');
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.close();
  }
}

run();