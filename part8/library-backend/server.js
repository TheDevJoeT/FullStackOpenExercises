const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@as-integrations/express5')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { createServer } = require('http')
const express = require('express')
const cors = require('cors')

const { useServer } = require('graphql-ws/use/ws')
const { WebSocketServer } = require('ws')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const jwt = require('jsonwebtoken')
const User = require('./models/user')

const getUserFromAuthHeader = async (auth) => {
  if (!auth || !auth.startsWith('Bearer ')) return null

  const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
  return User.findById(decodedToken.id)
}

const startServer = async (port) => {
  const app = express()
  const httpServer = createServer(app)

  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req.headers.authorization
        const currentUser = await getUserFromAuthHeader(auth)
        return { currentUser }
      },
    })
  )

  httpServer.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}`)
  })
}

module.exports = startServer