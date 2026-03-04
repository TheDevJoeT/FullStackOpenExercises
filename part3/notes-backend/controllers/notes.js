const notesRouter = require('express').Router()
const Note = require('../models/note')
const middleware = require('../utils/middleware')

notesRouter.get('/', (request, response) => {
  Note.find({}).populate('user', { username: 1, name: 1 })
    .then(notes => {
      response.json(notes)
    })
})

notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .populate('user', { username: 1, name: 1 })
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

notesRouter.post(
  '/',
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response, next) => {
    const body = request.body
    const user = request.user

    const note = new Note({
      content: body.content,
      important: body.important || false,
      user: user._id
    })

    try {
      const savedNote = await note.save()

      user.notes = user.notes.concat(savedNote._id)
      await user.save()

      response.status(201).json(savedNote)
    } catch (error) {
      next(error)
    }
  }
)

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findById(request.params.id)
    .then(note => {
      if (!note) {
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      return note.save().then(updatedNote => {
        response.json(updatedNote)
      })
    })
    .catch(error => next(error))
})

module.exports = notesRouter