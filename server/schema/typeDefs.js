const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    student: Boolean!
    students: [ID]
    studentsList: Int
    attendance: [Attendance]
    attendanceList: Int
    classwork: [Classwork]
    classworkList: Int
    teacher: ID
  }

  type Attendance {
    id: ID
    day: Day
  }

  type Day {
    isPresent: Boolean
    date: String
  }

  type Classwork {
    id: ID
    assignment: Assignment
  }

  type Assignment {
    name: String
    grade: Int
    link: String
    description: String
    kind: String
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    self: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    # teacher mutations
    addTeacher(username: String!, password: String!, email: String!): Auth
    addStudent(
      username: String!
      password: String!
      email: String!
      teacher: ID!
    ): User
    addClasswork(
      student: Boolean!
      teacher: ID!
      name: String!
      description: String!
      kind: String!
    ): Boolean
    gradeAssignment(username: String!, name: String!, grade: Int!): User
    findAllStudents(teacher: ID!): [User]
    # student mutations
    submitClasswork(id: ID!, classworkId: ID!, link: String!): Boolean
    checkIn(id: ID!): Boolean
  }
`;

module.exports = typeDefs;
