const mongoose = require("mongoose");
const config = require("./vars");

mongoose.connect(config.database, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

module.exports = mongoose.connection;
