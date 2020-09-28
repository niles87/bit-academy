const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const http = require("http");
const socket = require("socket.io");

const { resolvers, typeDefs } = require("./schema");
const { authMiddleWare } = require("./config/authentication");
const db = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 4200;

const httpServ = http.createServer(app);
const io = socket(httpServ);

const person = {};
io.on("connection", (socket) => {
  if (!person[socket.id]) {
    person[socket.id] = socket.id;
  }
  socket.emit("yourID", socket.id);
  io.sockets.emit("allUsers", person);
  socket.on("disconnect", () => {
    delete person[socket.id];
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("hey", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

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
  httpServ.listen(PORT, () => {
    console.log(`api running on http://localhost:${PORT}`);
    console.log(`http://localhost:${PORT}${server.graphqlPath}`);
  });
});
