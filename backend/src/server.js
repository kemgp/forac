import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDatabase } from './db.js'
import inviteChoicesRouter from './routes/inviteChoices.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  }),
)
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'tara-backend' })
})

app.use('/api/invite-choices', inviteChoicesRouter)

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ message: 'Something went wrong.' })
})

await connectDatabase()

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
