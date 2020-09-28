import gql from "graphql-tag";

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        student
      }
    }
  }
`;

export const ADD_TEACHER = gql`
  mutation addTeacher($username: String!, $password: String!, $email: String!) {
    addTeacher(username: $username, password: $password, email: $email) {
      token
      user {
        id
        username
        email
        student
      }
    }
  }
`;

export const ADD_STUDENT = gql`
  mutation addStudent(
    $username: String!
    $password: String!
    $email: String!
    $teacher: ID!
  ) {
    addStudent(
      username: $username
      password: $password
      email: $email
      teacher: $teacher
    ) {
      id
      username
      email
      student
    }
  }
`;

export const ADD_CLASSWORK = gql`
  mutation addClasswork(
    $teacher: ID!
    $name: String!
    $description: String!
    $kind: String!
  ) {
    addClasswork(
      teacher: $teacher
      name: $name
      description: $description
      kind: $kind
    )
  }
`;

export const GRADE_ASSIGNMENT = gql`
  mutation gradeAssigment($username: String!, $grade: Int!, $classworkId: ID!) {
    gradeAssignment(
      username: $username
      grade: $grade
      classworkId: $classworkId
    ) {
      id
      username
      email
      student
      classwork {
        id
        name
        grade
        link
        description
        kind
      }
    }
  }
`;

export const FIND_ALL_STUDENTS = gql`
  mutation findAllStudents($teacher: ID!) {
    findAllStudents(teacher: $teacher) {
      id
      username
      email
      student
      classwork {
        id
        name
        grade
        link
        description
        kind
      }
      classworkList
      teacher
    }
  }
`;

export const SUBMIT_CLASSWORK = gql`
  mutation submitClasswork($id: ID!, $classworkId: ID!, $link: String!) {
    submitClasswork(id: $id, classworkId: $classworkId, link: $link) {
      id
      username
      email
      student
      classwork {
        id
        name
        grade
        link
        description
        kind
      }
      classworkList
      teacher
    }
  }
`;
