// HW - CRUD Express - Mongoose
/* import "dotenv/config"; */
/* require('dotenv').config(); */
import "./env.mjs";
import express from 'express';
import mongoose from "mongoose"
import router from "./routes/someDocs.mjs"


const mongoString = process.env.DATABASE_URL

/* mongoose
    .connect("mongodb://localhost:27017/sample")
    .then(() => console.log("Connected to db"))
    .catch((err) => console.log(`Error: ${err}`)) */
mongoose.connect(mongoString)
const db = mongoose.connection

db.on('err', (err) => { //connect
    console.log(err)
})
db.once('connected', () => {    //connect just once
    console.log("DB connected 🤝")
})

const app = express()
app.use(express.json())
app.use(express.static('public'))
app.use(router);

const port = process.env.port || 3000;

app
.get("/", (req, res) => {
    res.status(201).send("Hello Pony rockstar, nice to see you again 🦄!");
})

.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

