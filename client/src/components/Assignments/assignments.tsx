import React, { useLayoutEffect, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { FIND_ALL_STUDENTS } from "../../utils/mutations";
import { averagedGrades } from "../../utils/gpa";
import { assignment } from "../../interfaces/assignment-I";

export const Student = (props: any) => {
  const gpa = averagedGrades(props.user.classwork);
  return (
    <table>
      <thead>
        <tr>
          <th colSpan={5}>Assignments</th>
        </tr>
        <tr>
          <th>Name</th>
          <th>Link</th>
          <th>Description</th>
          <th>Kind</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        {props.user.classwork.map((cw: assignment) => (
          <tr key={cw.id}>
            <td>{cw.name}</td>
            <td>{cw.link}</td>
            <td>{cw.description}</td>
            <td>{cw.kind}</td>
            <td>{cw.grade}</td>
          </tr>
        ))}
        <tr>
          <td>GPA</td>
          <td></td>
          <td></td>
          <td></td>
          <td>{gpa}</td>
        </tr>
      </tbody>
    </table>
  );
};

export const Teacher = (props: any) => {
  const [students, setStudents] = useState([]);
  const [findAllStudents, { error }] = useMutation(FIND_ALL_STUDENTS);

  if (error) console.error(error);

  useLayoutEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const teacher = props.user.id;

    try {
      const { data } = await findAllStudents({
        variables: { teacher },
      });
      setStudents(data.findAllStudents);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th colSpan={6}>Assignments</th>
        </tr>
        <tr>
          <th>Student</th>
          <th>Name</th>
          <th>Link</th>
          <th>Description</th>
          <th>Kind</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student: any) =>
          student.classwork.map((cw: assignment) => (
            <tr key={cw.id}>
              <td>{student.username}</td>
              <td>{cw.name}</td>
              <td>{cw.link}</td>
              <td>{cw.description}</td>
              <td>{cw.kind}</td>
              <td>{cw.grade}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};
