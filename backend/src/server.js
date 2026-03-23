import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './libs/db.js'
import authRoutes from './routes/authRoute.js'

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5001

// middleware
app.use(express.json())

// public routes

app.use('/api/auth', authRoutes)

// private routes

app.use(cors())

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})
