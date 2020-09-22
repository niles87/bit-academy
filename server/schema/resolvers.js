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

      const token = sign({
        _id: user._id,
        email: user.email,
        username: user.username,
      });

      return { token, user };
    },
    // Teacher Mutations
    addTeacher: async (parent, args) => {
      const { username, email, password } = args;

      const user = await User.create({
        username,
        email,
        password,
        student: false,
        students: [],
      });

      const token = sign({
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
    addClasswork: async (parent, args) => {
      const { student, teacher, name, description, kind } = args;
      const students = await User.updateMany(
        { student, teacher },
        {
          $push: {
            classwork: {
              name,
              grade: 0,
              link: "",
              description,
              kind,
            },
          },
        }
      );
      if (students.n === students.nModified) {
        return true;
      } else {
        return false;
      }
    },
    gradeAssignment: async (parent, args) => {
      const { username, grade, classworkId } = args;
      const student = await User.findOneAndUpdate(
        { username, "classwork._id": classworkId },
        {
          $set: {
            "classwork.$.grade": grade,
          },
        },
        {
          new: true,
        }
      );

      return student;
    },
    findAllStudents: async (parent, args) => {
      const { teacher } = args;
      const students = await User.find({ teacher });
      return students;
    },
    // Student Mutations
    submitClasswork: async (parent, args) => {
      const { id, classworkId, link } = args;
      const submit = await User.findOneAndUpdate(
        { _id: id, "classwork._id": classworkId },
        {
          $set: { "classwork.$.link": link },
        },
        { new: true }
      );

      return submit;
    },
    checkIn: async (parent, args) => {
      const { id } = args;
      const checkedIn = await User.findOneAndUpdate(
        { _id: id },
        { $push: { attendance: { isPresent: true } } },
        { new: true }
      );

      return checkedIn;
    },
  },
};
module.exports = resolvers;
