const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()


const app = express()

app.use(bodyParser.json());
app.use(cors());
const port = 5000

app.get('/' , (req, res)=>{
  res.send("Database connection is workinggggg")
})


const uri = "mongodb+srv://Tamal:Tamal@cluster0.dmacn.mongodb.net/Picsmania?retryWrites=true&w=majority";
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
    const products = client.db("Picsmania").collection("product");
    const Admin = client.db("Picsmania").collection("admin")
    const orders = client.db("Picsmania").collection("order")
  
    app.post('/addProduct', (req, res) => {
        const product = req.body;
      products.insertOne(product)
      .then(result =>{
        console.log(result.ops)
        res.send(result.acknowledged)
      })
    })
  
    app.delete('/delete/:id', (req, res) => {
        products.deleteOne({_id:ObjectId(req.params.id)})
        .then( result =>{
          console.log(result)
        })
    })
    
    app.get('/products', (req, res) => {
      products.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
    })
  
    app.get('/product/:id', (req, res) => {

      products.find({_id:ObjectId(req.params.id)})
      .toArray((err, documents)=>{
        res.send(documents[0])
      })
    })

  
    app.post('/order', (req, res) => {
      const order = req.body;
      console.log(order)
    orders.insertOne(order)
    .then(result =>{
      console.log(result.acknowledged)
        res.send(result.acknowledged)
    })
  })
  
  app.patch('/update/:id', (req, res) => {
    orders.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {status: req.body.status}
    })
    .then (result => {
      res.send(result.modifiedCount > 0)
    })
  })
  
  app.get('/admin', (req, res) => {
    Admin.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })
  
  app.get('/oderDetails', (req, res) => {
     orders.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })
  
  app.get('/adminOderDetails', (req, res) => {
    orders.find({})
   .toArray((err, documents) => {
     res.send(documents)
   })
  })
  
  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    Admin.find({ email: email })
        .toArray((err, documents) => {
            res.send(documents.length > 0);
        })
  })
  
  
  
  console.log("Database")
  
  
  });
  app.listen(process.env.PORT || port, () => {
  })