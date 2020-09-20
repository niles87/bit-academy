const mongoose = require("mongoose");
const config = require("./vars");

mongoose.connect(config.database, {
  useUnifiedTopology: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useCreateIndex: true,
});

module.exports = mongoose.connection;
