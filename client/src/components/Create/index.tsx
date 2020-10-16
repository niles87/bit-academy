import React, { ChangeEvent, Fragment, useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Modal } from "../Modal";
import { QUERY } from "../../utils/queries";
import { ADD_CLASSWORK, ADD_STUDENT } from "../../utils/mutations";
import { StatusMsg } from "../StatusMsg";
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
  const [statMsgShow, setStatMsgShow] = useState<boolean>(false);
  const [statMsgSuccess, setStatMsgSuccess] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  if (!data) return <h1>You need to login to use this</h1>;
  if (data.self.student) return <h1>Teacher access only</h1>;
  if (loading) return <h1>Loading</h1>;

  const closeModal = (): void => {
    if (studentModal) setStudentModal(false);
    if (assignmentModal) setAssignmentModal(false);
  };

  const closeStatusMsg = (): void => {
    setStatMsgShow(false);
    setStatMsgSuccess(false);
    setMsg("");
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
      if (student) {
        setMsg("Success Added Student");
        setStatMsgSuccess(true);
        setStatMsgShow(true);
      }
    } catch (err) {
      console.error(err);
      if (err) {
        setMsg("Something Went Wrong");
        setStatMsgSuccess(false);
        setStatMsgShow(true);
      }
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
      if (assignment) {
        setMsg("Success Added Assignment");
        setStatMsgSuccess(true);
        setStatMsgShow(true);
      }
    } catch (err) {
      console.error(err.message);
      if (err) {
        setMsg("Something Went Wrong");
        setStatMsgSuccess(false);
        setStatMsgShow(true);
      }
    }
    setAssignmentData({ name: "", description: "", kind: "" });
    closeModal();
  };

  if (statMsgShow) {
    setTimeout(closeStatusMsg, 6000);
  }

  return (
    <Fragment>
      <StatusMsg
        show={statMsgShow}
        success={statMsgSuccess}
        msg={msg}
        handleClose={closeStatusMsg}
      />
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
