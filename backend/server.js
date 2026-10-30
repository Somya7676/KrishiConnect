import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ success: true, message: 'KrishiConnect API is running.' })
})

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'not connected'
  })
})

const PORT = process.env.PORT || 5000

async function startServer() {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI)
      console.log('MongoDB connected successfully')
    } else {
      console.log('MONGODB_URI not set yet; running without database for initial setup')
    }

    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
  } catch (error) {
    console.error('Unable to start server:', error.message)
    process.exit(1)
  }
}

startServer()
