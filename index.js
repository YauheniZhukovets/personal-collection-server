require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDb = require('./db')
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware')
const passport = require('passport')
require('./passport')
const session = require('express-session');


const PORT = process.env.PORT || 5000
const app = express()
app.use(session({secret: process.env.CLIENT_SECRET}))
app.use(express.json())
app.use(cors({
    credentials: true,
    origin: true
}))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
    try {
        connectDb()
        app.listen(PORT, () => {
            console.log(`Server started on ${PORT} `)
        })
    } catch (e) {
        console.log(e)
    }
}

start()