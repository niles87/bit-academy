const { AuthenticationError } = require("apollo-server-express");
const User = require("../models/Users");
const { sign } = require("../config/authentication");

const resolvers = {
  Query: {
    self: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findById({ _id: context.user._id });
        return userData;
      }
      return new AuthenticationError("Need to be logged in for that");
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) throw new AuthenticationError("Email does not exist");

      const checkPass = await user.comparePassword(password);

      if (!checkPass) throw new AuthenticationError("incorrect creds");

      const token = await sign({
        _id: user._id,
        email: user.email,
        username: user.username,
      });

      return { token, user };
    },
    addTeacher: async (parent, args) => {
      const { username, email, password } = args;

      const user = await User.create({
        username,
        email,
        password,
        student: false,
        students: [],
      });

      const token = await sign({
        _id: user._id,
        email: user.email,
        username: user.username,
      });

      return { token, user };
    },
    addStudent: async (parent, args) => {
      const { username, email, password, teacher } = args;

      const student = await User.create({
        username,
        email,
        password,
        student: true,
        attendance: [],
        classwork: [],
        teacher,
      });

      const teach = await User.findOne({ _id: teacher });
      teach.students.push(student._id);
      teach.save();

      return student;
    },
  },
};
module.exports = resolvers;
