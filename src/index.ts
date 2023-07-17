import express from 'express'
import usersRouter from './routes/users.routes'
import databaseServices from './services/database.services'
const app = express()
const port = 8888

// middleware to parse json body
app.use(express.json())

app.use('/users', usersRouter)

databaseServices.connect()
app.listen(port, () => {
  console.log(`server is listening on ${port}`)
})
