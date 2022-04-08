require('dotenv').config()
const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
let database;
async function connectToDatabase() {
 const client = await MongoClient.connect('mongodb+srv://ashish:ashishagrawal007@cluster0.bcnvb.mongodb.net/test');
database = client.db('online-shop');
}

function getDb() {
  if(!database) {
    throw new Error('You Must Connect first');
  }
  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb
}


// mongodb://localhost:27017