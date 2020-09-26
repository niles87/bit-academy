import React, {
  ChangeEvent,
  Fragment,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useMutation } from "@apollo/react-hooks";
import {
  FIND_ALL_STUDENTS,
  GRADE_ASSIGNMENT,
  SUBMIT_CLASSWORK,
} from "../../utils/mutations";
import { averagedGrades } from "../../utils/gpa";
import { assignment } from "../../interfaces/assignment-I";
import { Modal } from "../Modal";
import "./assignment.css";

export const Student = (props: any) => {
  const [showModal, setShowModal] = useState(false);
  const [link, setLink] = useState("");
  const [id, setId] = useState("");
  const [assignId, setAssignId] = useState("");
  const [sendLink] = useMutation(SUBMIT_CLASSWORK);
  const gpa = averagedGrades(props.user.classwork);

  const openModal = (id: string, classworkId: string) => {
    setId(id);
    setAssignId(classworkId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleInput = (ev: ChangeEvent<HTMLInputElement>) => {
    const { value } = ev.target;
    setLink(value);
  };

  const updateLink = async () => {
    try {
      await sendLink({ variables: { id, classworkId: assignId, link } });
    } catch (error) {
      console.error(error);
    }
    setLink("");
    closeModal();
  };

  return (
    <Fragment>
      <Modal show={showModal} handleClose={closeModal}>
        <input
          type="text"
          name="link"
          onChange={handleInput}
          placeholder="Link"
        />
        <button onClick={updateLink}>Update</button>
      </Modal>
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.user.classwork.map((cw: assignment) => (
            <tr key={cw.id}>
              <td>{cw.name}</td>
              <td>
                {cw.link.length > 0 ? <a href={cw.link}>{cw.link}</a> : ""}
              </td>
              <td>{cw.description}</td>
              <td>{cw.kind}</td>
              <td>{cw.grade}%</td>
              <td>
                <button onClick={() => openModal(props.user.id, cw.id)}>
                  Enter Link
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td>GPA</td>
            <td></td>
            <td></td>
            <td></td>
            <td>{gpa}%</td>
          </tr>
        </tbody>
      </table>
    </Fragment>
  );
};

export const Teacher = (props: any) => {
  const [students, setStudents] = useState([]);
  const [findAllStudents] = useMutation(FIND_ALL_STUDENTS);
  const [sendGrade] = useMutation(GRADE_ASSIGNMENT);
  const [showModal, setShowModal] = useState(false);
  const [assignId, setAssignId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [grade, setGrade] = useState(0);

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

  const openModal = (username: string, classworkId: string) => {
    setAssignId(classworkId);
    setStudentName(username);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleInput = (ev: ChangeEvent<HTMLInputElement>) => {
    const { value } = ev.target;
    setGrade(parseInt(value));
  };

  const updateGrade = async () => {
    try {
      await sendGrade({
        variables: { username: studentName, grade, classworkId: assignId },
      });
    } catch (error) {
      console.error(error);
    }
    setGrade(0);
    closeModal();
  };

  useEffect(() => {
    fetchData();
  }, [grade]);

  return (
    <Fragment>
      <Modal show={showModal} handleClose={closeModal}>
        <input
          type="number"
          name="grade"
          onChange={handleInput}
          placeholder="Grade 0-100"
          min={0}
          max={100}
        />
        <button onClick={updateGrade}>Update</button>
      </Modal>
      <table>
        <thead>
          <tr>
            <th colSpan={7}>Assignments</th>
          </tr>
          <tr>
            <th>Student</th>
            <th>Name</th>
            <th>Link</th>
            <th>Description</th>
            <th>Kind</th>
            <th>Grade</th>
            <th></th>
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
                <td>
                  <button onClick={() => openModal(student.username, cw.id)}>
                    Enter Grade
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Fragment>
  );
};
