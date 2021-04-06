const express = require("express")
const app = express()
const MongoClient = require("mongodb").MongoClient //to connect to my database
const PORT = 3000

let db,
    dbConnectionStr = "mongodb+srv://kat:kat@cluster0.k9fbx.mongodb.net/test?retryWrites=true&w=majority",
    dbName = "to-do-list"

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
.then(client => {
 console.log("Connected to Database")
 db = client.db(dbName)

 app.set("view engine", "ejs")
 app.use(express.static("public"))
 app.use(express.urlencoded({extended: true}))
 app.use(express.json()) 

//handlers

app.get("/", async (req, res) => { 
 const todoItems = await db.collection("todo").find().toArray()
 const itemsLeft = await db.collection("todo").countDocuments({completed: false})
 res.render("index.ejs", {zebra: todoItems, left: itemsLeft})
})

app.post("/todo", (req, res) => {
 db.collection("todo").insertOne({todo: req.body.todoItem, completed: false})
 .then(result => { 
  res.redirect("/")
 })
.catch(error => console.error(error))
}) 

app.put("/markComplete", (req, res) => {
 db.collection("todo").updateOne({todo :req.body.rainbowUnicorn},{
  $set: {
   completed: true
  }
 })
 .then(result => {
  console.log("Marked Complete")
  res.json("Marked Complete")
 })
 .catch(err => console.log(error))
}) 

app.put("/undo", (req, res) => {
 db.collection("todo").updateOne({todo :req.body.rainbowUnicorn},{
  $set: {
   completed: false
  }
 })
 .then(result => {
  console.log("Marked Complete")
  res.json("Marked Complete")
 })
})

app.listen(process.env.PORT || PORT, ()=>{
 console.log("listening on 3000")
})

app.delete("/deleteTodo", (req, res) =>{
 db.collection("todo").deleteOne({todo: req.body.rainbowUnicorn})
 .then(results => {
  console.log("Deleted Todo")
  res.json("Deleted It")
 })
 .catch( err => console.log(err))
})

})
.catch(error => console.error(error))
//Middleware
