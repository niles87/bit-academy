const express = require("express");
const { ApolloServer } = require("apollo-server-express");

const { resolvers, typeDefs } = require("./schema");
const { authMiddleWare } = require("./config/authentication");
const db = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 4200;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleWare,
});

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("../client/build"));
}

app.get("*", (req, res) => {
  console.log(path.join(__dirname, "..", "client", "build", "index.html"));
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

db.on("connected", () => {
  app.listen(PORT, () => {
    console.log(`api running on http://localhost:${PORT}`);
    console.log(`http://localhost:${PORT}${server.graphqlPath}`);
  });
});
