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
              assignment: { name, grade: 0, link: "", description, kind },
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
      const { username, name, grade } = args;
      const student = await User.findOneAndUpdate(
        { username },
        {
          $set: {
            "classwork.$[elem].grade": grade,
          },
        },
        {
          new: true,
          arrayFilters: [{ "elem.grade": { $lte: grade } }],
          multi: false,
          $upsert: true,
        }
      );
      student.classwork.forEach((elem) => {
        if (elem.assignment.name === name) {
          elem.assignment.grade = grade;
        }
      });
      student.save();
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
        { _id: id },
        {
          $set: {
            classwork: [
              { $where: { _id: { $eq: classworkId } } },
              { "assignment.link": link },
            ],
          },
        }
      );
      console.log(submit.classwork);
      // submit.classwork.forEach((elem) => {
      //   if (elem._id === classworkId) {
      //     elem.assignment.link = link;
      //   }
      // });
      // submit.save();
      // return true;
    },
    checkIn: async (parent, args) => {
      const { id } = args;
      const checkedIn = await User.updateOne(
        { _id: id },
        { $push: { attendance: { isPresent: true } } }
      );
      if (checkedIn.n === checkedIn.nModified) {
        return true;
      } else {
        return false;
      }
    },
  },
};
module.exports = resolvers;
