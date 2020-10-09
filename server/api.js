const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");

const { resolvers, typeDefs } = require("./schema");
const { authMiddleWare } = require("./config/authentication");
const db = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 4200;

const http = require("http").Server(app);
const io = require("socket.io")(http);
const person = {};

const roomSocket = {};

io.on("connection", (socket) => {
  socket.on("join room", (roomId) => {
    if (person[roomId]) {
      person[roomId].push(socket.id);
    } else {
      person[roomId] = [socket.id];
    }
    roomSocket[socket.id] = roomId;

    const peopleInRoom = person[roomId].filter((id) => id !== socket.id);

    socket.emit("all users", peopleInRoom);
  });

  socket.on("sending signal", (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const roomId = roomSocket[socket.id];
    let room = person[roomId];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      person[roomId] = room;
    }
    socket.broadcast.emit("user disconnect", socket.id);
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
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

db.on("connected", () => {
  http.listen(PORT, () => {
    console.log(`api running on http://localhost:${PORT}`);
    console.log(`http://localhost:${PORT}${server.graphqlPath}`);
  });
});
