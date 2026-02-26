require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')

const blogsRouter = require('./controllers/blogs')

const app = express()

mongoose.connect(config.MONGODB_URI, { family: 4 })
  .then(() => console.log('connected to MongoDB'))
  .catch(error => console.log('error connecting:', error.message))

app.use(express.json())
app.use('/api/blogs', blogsRouter)

const middleware = require('./utils/middleware')

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app