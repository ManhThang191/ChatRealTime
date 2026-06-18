import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './libs/db.js'
import authRoutes from './routes/authRoute.js'
import userRoute from './routes/userRoute.js'
import cookieParser from 'cookie-parser'
import { protectRoute } from './middlewares/authMiddlewares.js'
import friendRoute from './routes/friendRoute.js'
import messageRoute from './routes/messageRoute.js'
import conversationRoute from './routes/conversation.js'

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5001

// middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
)
app.use(express.json())
app.use(cookieParser())

// public routes
app.use('/api/auth', authRoutes)

// private routes
app.use(protectRoute)
app.use('/api/user', userRoute)
app.use('/api/friend', friendRoute)
app.use('/api/message', messageRoute)
app.use('/api/conversation', conversationRoute)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})
