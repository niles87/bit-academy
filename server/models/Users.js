const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const SchoolWorkSchema = new Schema({
  name: String,
  grade: Number,
  link: String,
  description: String,
  kind: String,
});

const AttendanceSchema = new Schema({
  isPresent: { type: Boolean, default: true },
  date: { type: Date, default: Date.now.toString() },
});

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Must be valid email"],
      unique: true,
    },
    student: { type: Boolean, required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "User" }],
    attendance: [AttendanceSchema],
    classwork: [SchoolWorkSchema],
    teacher: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

UserSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const salt = 12;
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.virtual("studentsList").get(function () {
  return this.students.length;
});

UserSchema.virtual("attendanceList").get(function () {
  return this.attendance.length;
});

UserSchema.virtual("classworkList").get(function () {
  return this.classwork.length;
});

const User = model("User", UserSchema);

module.exports = User;
