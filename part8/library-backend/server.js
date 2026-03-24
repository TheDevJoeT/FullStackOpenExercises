const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const jwt = require("jsonwebtoken");
const User = require("./models/user");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const getUserFromToken = async (auth) => {
  if (!auth || !auth.startsWith("Bearer ")) {
    return null;
  }

  const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET);

  return User.findById(decodedToken.id);
};

const startServer = (port) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  startStandaloneServer(server, {
    listen: { port },
    context: async ({ req }) => {
      const auth = req.headers.authorization;
      const currentUser = await getUserFromToken(auth);
      return { currentUser };
    },
  });
};

module.exports = startServer;
