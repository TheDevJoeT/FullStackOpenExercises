require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const blogsRouter = require('./controllers/blogs')

const app = express()

mongoose.connect(process.env.MONGODB_URI, { family: 4 })
  .then(() => console.log('connected to MongoDB'))
  .catch(error => console.log('error connecting:', error.message))

app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app