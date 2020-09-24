import React, { useLayoutEffect, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { FIND_ALL_STUDENTS } from "../../utils/mutations";

interface attendance<T> {
  attendance: T;
}

interface day {
  isPresent: Boolean;
  date: string;
}

const getDate = (date: string): string => {
  return new Date(parseInt(date)).toLocaleDateString();
};

export const Student = (props: any) => {
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
        {props.user.attendance.map((day: attendance<day>) => (
          <tr key={day.attendance.date}>
            <td>{getDate(day.attendance.date)}</td>
            <td>{day.attendance.isPresent ? "Present" : ""}</td>
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
          student.attendance.map((day: attendance<day>) => (
            <tr key={day.attendance.date}>
              <td>{student.username}</td>
              <td>{getDate(day.attendance.date)}</td>
              <td>{day.attendance.isPresent ? "Present" : ""}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};
