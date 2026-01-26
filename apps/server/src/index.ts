import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5018

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5017',
  credentials: true, // 跨域
}))
app.use(express.json({
  limit: '10mb',
}))