require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDb = require('./db')
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware')


const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Date', 'X-Api-Version']
}))
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