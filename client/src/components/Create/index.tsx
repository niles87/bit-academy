import React, { ChangeEvent, Fragment, useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Modal } from "../Modal";
import { QUERY } from "../../utils/queries";
import { ADD_CLASSWORK, ADD_STUDENT } from "../../utils/mutations";

export const Create = () => {
  const { data, loading } = useQuery(QUERY);
  const [addStudent] = useMutation(ADD_STUDENT);
  const [addAssignment] = useMutation(ADD_CLASSWORK);
  const [studentModal, setStudentModal] = useState(false);
  const [assignmentModal, setAssignmentModal] = useState(false);
  const [studentData, setStudentData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [assignmentData, setAssignmentData] = useState({
    name: "",
    description: "",
    kind: "",
  });
  if (!data) return <h1>You need to login to use this</h1>;
  if (data.self.student) return <h1>Teacher access only</h1>;
  if (loading) return <h1>Loading</h1>;
  const teacher = data.self.id;

  const closeModal = () => {
    if (studentModal) setStudentModal(false);
    if (assignmentModal) setAssignmentModal(false);
  };

  const addStudentM = () => {
    setStudentModal(true);
  };

  const addAssignmentM = () => {
    setAssignmentModal(true);
  };

  const studentChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const createStudent = async () => {
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

  const createAssignment = async () => {
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
          />
        </div>
        <div>
          <input
            type="text"
            name="password"
            onChange={studentChange}
            placeholder="Student Password"
          />
        </div>
        <div>
          <input
            type="text"
            name="email"
            onChange={studentChange}
            placeholder="Student Email"
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
          />
        </div>
        <div>
          <input
            type="text"
            name="description"
            onChange={assignmentChange}
            placeholder="Assignment Description"
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
        <button onClick={createAssignment}>Add Assignment</button>
      </Modal>
      <div>
        <p className="create addStudent" onClick={addStudentM}>
          Add a new student
        </p>
      </div>
      <div>
        <p className="create addAssignment" onClick={addAssignmentM}>
          Add a new assignment
        </p>
      </div>
    </Fragment>
  );
};
