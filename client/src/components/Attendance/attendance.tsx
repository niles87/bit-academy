import { useMutation } from "@apollo/react-hooks";
import React, { useLayoutEffect, useState } from "react";
import { FIND_ALL_STUDENTS } from "../../utils/mutations";

const getDate = (date: string): string => {
  console.log(new Date(parseInt(date)).toLocaleDateString());
  return new Date(parseInt(date)).toLocaleDateString();
};
export const Student = (props: any) => {
  console.log(props.user.attendance);
  return (
    <table>
      <thead>
        <tr>
          <th colSpan={2}>Attendance</th>
        </tr>
        <tr>
          <th>Date</th>
          <th>Present</th>
        </tr>
      </thead>
      <tbody>
        {props.user.attendance.map((element: any) => (
          <tr key={element.attendance.date}>
            <td>{() => getDate(element.attendance.date)}</td>
            <td>{element.attendance.isPresent}</td>
          </tr>
        ))}
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
          <th colSpan={3}>Attendance</th>
        </tr>
        <tr>
          <th>Student</th>
          <th>Date</th>
          <th>Present</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student: any) =>
          student.attendance.map((element: any) => (
            <tr key={element.attendance.date}>
              <td>{student.username}</td>
              <td>{getDate(element.attendance.date)}</td>
              <td>{element.attendance.isPresent ? "Present" : ""}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};
