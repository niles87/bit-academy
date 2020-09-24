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
      attendance {
        attendance {
          isPresent
          date
        }
      }
      attendanceList
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

// export const QUERY_STUDENT_ATTENDANCE = gql`
//   {
//     self {
//       id
//       username
//       email
//       student
//       attendance {
//         attendance {
//           isPresent
//           date
//         }
//       }
//       attendanceList
//       teacher
//     }
//   }
// `;

// export const QUERY_STUDENT_CLASSWORK = gql`
//   {
//     self {
//       id
//       username
//       email
//       student
//       classwork {
//         id
//         name
//         grade
//         link
//         description
//         kind
//       }
//       classworkList
//       teacher
//     }
//   }
// `;
