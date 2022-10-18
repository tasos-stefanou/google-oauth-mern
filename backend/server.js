import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/mongo-db.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()

connectDB()
const app = express()

app.use(
  express.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
  })
)
// app.use(cors({ origin: true }))
app.use(cors({ origin: '*' }))

app.use('/api/users', userRoutes)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
)
