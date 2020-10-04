import React, { ChangeEvent, Fragment, useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Modal } from "../Modal";
import { QUERY } from "../../utils/queries";
import { ADD_CLASSWORK, ADD_STUDENT } from "../../utils/mutations";
import "./create.css";

interface StudentData {
  username: string;
  password: string;
  email: string;
}

interface AssignmentData {
  name: string;
  description: string;
  kind: string;
}

export const Create = (): JSX.Element => {
  const { data, loading } = useQuery(QUERY);
  const [addStudent] = useMutation(ADD_STUDENT);
  const [addAssignment] = useMutation(ADD_CLASSWORK);
  const [studentModal, setStudentModal] = useState<boolean>(false);
  const [assignmentModal, setAssignmentModal] = useState<boolean>(false);
  const [studentData, setStudentData] = useState<StudentData>({
    username: "",
    password: "",
    email: "",
  });
  const [assignmentData, setAssignmentData] = useState<AssignmentData>({
    name: "",
    description: "",
    kind: "",
  });
  if (!data) return <h1>You need to login to use this</h1>;
  if (data.self.student) return <h1>Teacher access only</h1>;
  if (loading) return <h1>Loading</h1>;

  const closeModal = (): void => {
    if (studentModal) setStudentModal(false);
    if (assignmentModal) setAssignmentModal(false);
  };

  const addStudentM = (): void => {
    setStudentModal(true);
  };

  const addAssignmentM = (): void => {
    setAssignmentModal(true);
  };

  const studentChange = (ev: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = ev.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const createStudent = async (): Promise<void> => {
    const teacher: string = data.self.id;
    try {
      const student = await addStudent({
        variables: { ...studentData, teacher },
      });
      console.log(student);
    } catch (error) {
      console.error(error);
    }
    setStudentData({ username: "", password: "", email: "" });
    closeModal();
  };

  const assignmentChange = (
    ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = ev.target;
    setAssignmentData({ ...assignmentData, [name]: value });
  };

  const createAssignment = async (): Promise<void> => {
    const teacher: string = data.self.id;
    try {
      const assignment = await addAssignment({
        variables: { ...assignmentData, teacher },
      });
      console.log(assignment);
    } catch (error) {
      console.error(error);
    }
    setAssignmentData({ name: "", description: "", kind: "" });
    closeModal();
  };

  return (
    <Fragment>
      <Modal show={studentModal} handleClose={closeModal}>
        <div>
          <input
            type="text"
            name="username"
            onChange={studentChange}
            placeholder="Student Name"
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="password"
            onChange={studentChange}
            placeholder="Student Password"
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="email"
            onChange={studentChange}
            placeholder="Student Email"
            required
          />
        </div>
        <button onClick={createStudent}>Add Student</button>
      </Modal>
      <Modal show={assignmentModal} handleClose={closeModal}>
        <div>
          <input
            type="text"
            name="name"
            onChange={assignmentChange}
            placeholder="Assignment Name"
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="description"
            onChange={assignmentChange}
            placeholder="Assignment Description"
            required
          />
        </div>
        <div>
          <select name="kind" onChange={assignmentChange}>
            <option value="">Kind of Assignment</option>
            <option value="homework">Homework</option>
            <option value="quiz">Quiz</option>
            <option value="exam">Exam</option>
          </select>
        </div>
        <button
          onClick={createAssignment}
          disabled={assignmentData.kind === "" ? true : false}
        >
          Add Assignment
        </button>
      </Modal>
      <div className="create-container">
        <div className="create" onClick={addStudentM}>
          <p>Add a new student</p>
        </div>
        <div className="create" onClick={addAssignmentM}>
          <p>Add a new assignment</p>
        </div>
      </div>
    </Fragment>
  );
};
