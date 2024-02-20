// HW - CRUD Express - Mongoose
/* import "dotenv/config"; */
/* require('dotenv').config(); */
import "./env.mjs";
import express from 'express';
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import router from "./routes/someDocs.mjs"
import { Sample } from "./Model/mong.mjs";

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
/* app.use(express.static('public')) */
app.use(router);

let refreshTokens = []

const port = process.env.port || 3000;

app
.get("/", (req, res) => {
    res.status(201).send("Hello Pony rockstar, nice to see you again 🦄!");
})
//JWT
// Token can be used across multiple servers unlike session
// Refresh token - invalidates users that shouldn#t have access anymore

.get('/status', authenticateToken, (req, res) => {
    /* res.json(users.filter(post => post.username === req.user.name)) */
    return req.user ? res.send(`Welcome, ${req.user.name} 👾!`) : res.sendStatus(401);
})

.post('/token', (req, res) => {
    //Authenticate users
    const refreshToken = req.body.token
    if (refreshToken === null) return res.sendStatus(401)
    if(refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user.name })
        res.json({ accessToken: accessToken })
    })
})

.post('/login', async(req, res) => {
    //Authenticate users
    /* const username = req.body.username
    const user = { name: username } */
    const { username, password } = req.body;
    const user = await Sample.findOne({username})
    if (!user) res.status(400).json({ error: "User not found" });

    const dbPassword = user.password;
    if (!comparePW(password, dbPassword)){
        res
        .status(400)
        .json({ error: "Bad credentials!" })
    } else {
        /* const accessToken = createTokens(user);
        res.cookie("access-token", accessToken, {
          maxAge: 60000,
          httpOnly: true,
        }); */
        const accessToken = generateAccessToken(user)
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN)
        res.json({accessToken: accessToken, refreshToken: refreshToken})
        console.log(accessToken)
        res.json(`Hello there 👋🏼, it's nice to see you back ${user.name}!`);
    }
    /* const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET) */
})

.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
}

function generateAccessToken(user) {
        return jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '30s'})
}


