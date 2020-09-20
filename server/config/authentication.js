const jwt = require("jsonwebtoken");
const config = require("./vars");

const secret = config.secret;
const experation = "2h";

module.exports = {
  authMiddleWare: ({ req }) => {
    let token = req.body.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(" ")[1];
    }
    if (!token) return req;

    try {
      const { data } = jwt.verify(token, secret);
      req.user = data;
    } catch (err) {
      console.error(err);
    }

    return req;
  },
  sign: ({ _id, email, username }) => {
    const payload = { _id, email, username };
    console.log(payload);
    return jwt.sign({ data: payload }, secret, { expiresIn: experation });
  },
};
