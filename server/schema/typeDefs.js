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
    isPresent: Boolean!
    date: String!
  }

  type Classwork {
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
  }
`;

module.exports = typeDefs;
