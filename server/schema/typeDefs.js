const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    student: Boolean!
    students: [ID]
    studentsList: Int
    classwork: [Classwork]
    classworkList: Int
    teacher: ID
  }

  type Classwork {
    id: ID
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
      teacher: ID!
      name: String!
      description: String!
      kind: String!
    ): Boolean
    gradeAssignment(username: String!, grade: Int!, classworkId: ID!): User
    findAllStudents(teacher: ID!): [User]
    deleteAssignment(teacher: ID!, name: String!): Boolean
    removeStudent(teacher: ID!, studentEmail: String!): Boolean
    # student mutations
    submitClasswork(id: ID!, classworkId: ID!, link: String!): User
    checkIn(id: ID!): User
  }
`;

module.exports = typeDefs;
