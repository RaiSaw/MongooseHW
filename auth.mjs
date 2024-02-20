import "./env.mjs";
import express from 'express';
import jwt from "jsonwebtoken"


const { sign } = jwt

const users = [
    {   username:"Ren", password: "123till8", id:1  },
    {   username:"Ru", password: "345til10", id:2   },
    {   username:"Rob", password: "567til12", id:3  },
];

const app = express()
app.use(express.json())
/* app.use(express.static('public'))
app.use(router); */

const port = process.env.port || 3000;

let refreshTokens = []

app
//JWT
// Token can be used across multiple servers unlike session
// Refresh token - invalidates users that shouldn#t have access anymore
app.get('/status', authenticateToken, (req, res) => {
    res.json(users.filter(post => post.username === req.user.name))
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

    /* const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET) */
    /* const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN)
    res.json({accessToken: accessToken, refreshToken: refreshToken}) */
})

.post('/login', (req, res) => {
    //Authenticate users
    const username = req.body.username
    const user = { name: username }

    /* const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET) */
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN)
    res.json({accessToken: accessToken, refreshToken: refreshToken})
})

.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

/* function authToken(req, res, next) {
    const authHeader = req.headers['Authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
} */
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
