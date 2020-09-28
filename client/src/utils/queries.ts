import gql from "graphql-tag";

export const QUERY = gql`
  {
    self {
      id
      username
      email
      student
      students
      studentsList
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
