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
import { Modal } from "../Modal";
import "./assignments.css";

interface assignment {
  id: string;
  name: string;
  grade: number;
  link: string;
  description: string;
  kind: string;
}

export const Student = (props: any) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [link, setLink] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [assignId, setAssignId] = useState<string>("");
  const [sendLink] = useMutation(SUBMIT_CLASSWORK);
  const gpa: number = averagedGrades(props.user.classwork);

  const openModal = (id: string, classworkId: string): void => {
    setId(id);
    setAssignId(classworkId);
    setShowModal(true);
  };

  const closeModal = (): void => {
    setShowModal(false);
  };

  const handleInput = (ev: ChangeEvent<HTMLInputElement>): void => {
    const { value } = ev.target;
    setLink(value);
  };

  const updateLink = async (): Promise<void> => {
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
        <div>
          <input
            type="text"
            name="link"
            onChange={handleInput}
            placeholder="Link"
          />
        </div>
        <button onClick={updateLink}>Update Link</button>
      </Modal>
      <table className="assignments">
        <caption>Assignments</caption>
        <thead>
          <tr>
            <th>Name</th>
            <th>Link</th>
            <th>Description</th>
            <th>Kind</th>
            <th id="grade">Grade</th>
          </tr>
        </thead>
        <tbody>
          {props.user.classwork.map((cw: assignment) => (
            <tr key={cw.id}>
              <th>{cw.name}</th>
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
        </tbody>
        <tfoot>
          <tr>
            <th>GPA</th>
            <td></td>
            <td></td>
            <td></td>
            <td headers="grade">{gpa}%</td>
          </tr>
        </tfoot>
      </table>
    </Fragment>
  );
};

export const Teacher = (props: any) => {
  const [findAllStudents] = useMutation(FIND_ALL_STUDENTS);
  const [sendGrade] = useMutation(GRADE_ASSIGNMENT);
  const [students, setStudents] = useState<Array<any>>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [assignId, setAssignId] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");
  const [grade, setGrade] = useState<number | undefined>();

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

  const updateGrade = async (): Promise<void> => {
    try {
      await sendGrade({
        variables: { username: studentName, grade, classworkId: assignId },
      });
    } catch (error) {
      console.error(error);
    }
    setGrade(undefined);
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
          placeholder="Grade%"
          min={0}
          max={100}
        />
        <button onClick={updateGrade}>Update Grade</button>
      </Modal>
      <table className="assignments">
        <caption>Assignments</caption>
        <thead>
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
                <th>{student.username}</th>
                <td>{cw.name}</td>
                <td>
                  {cw.link.length > 0 ? <a href={cw.link}>{cw.link}</a> : ""}
                </td>
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
