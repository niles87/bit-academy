import React, { ChangeEvent, Fragment, useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Modal } from "../Modal";
import { QUERY } from "../../utils/queries";
import {
  ADD_CLASSWORK,
  ADD_STUDENT,
  REMOVE_ASSIGNMENT,
  REMOVE_STUDENT,
} from "../../utils/mutations";
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
  const [removeAssignment] = useMutation(REMOVE_ASSIGNMENT);
  const [removeStudent] = useMutation(REMOVE_STUDENT);
  const [studentModal, setStudentModal] = useState<boolean>(false);
  const [assignmentModal, setAssignmentModal] = useState<boolean>(false);
  const [rmStudentModal, setRMStudentModal] = useState<boolean>(false);
  const [rmAssignmentModal, setRMAssignmentModal] = useState<boolean>(false);
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
    if (rmAssignmentModal) setRMAssignmentModal(false);
    if (rmStudentModal) setRMStudentModal(false);
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

  const deleteStudentM = (): void => {
    setRMStudentModal(true);
  };

  const deleteAssignmentM = (): void => {
    setRMAssignmentModal(true);
  };

  const studentChange = (ev: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = ev.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const createStudent = async (
    ev: ChangeEvent<HTMLFormElement>
  ): Promise<void> => {
    ev.preventDefault();
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
    } catch (err: any) {
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

  const createAssignment = async (
    ev: ChangeEvent<HTMLFormElement>
  ): Promise<void> => {
    ev.preventDefault();
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
    } catch (err: any) {
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

  const deleteAssignment = async (ev: ChangeEvent<HTMLFormElement>) => {
    const teacher: string = data.self.id;
    try {
      const assignment = await removeAssignment({
        variables: { teacher, name: assignmentData.name },
      });
      if (assignment) {
        setMsg("Success Removed Assignment");
        setStatMsgSuccess(true);
        setStatMsgShow(true);
      }
    } catch (err: any) {
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

  const deleteStudent = async (ev: ChangeEvent<HTMLFormElement>) => {
    const teacher: string = data.self.id;
    try {
      const student = await removeStudent({
        variables: { teacher, studentEmail: studentData.email },
      });
      if (student) {
        setMsg("Success Removed Student");
        setStatMsgSuccess(true);
        setStatMsgShow(true);
      }
    } catch (err: any) {
      console.error(err.message);
      if (err) {
        setMsg("Something Went Wrong");
        setStatMsgSuccess(false);
        setStatMsgShow(true);
      }
    }
    setStudentData({ username: "", password: "", email: "" });
    closeModal();
  };

  if (statMsgShow) {
    setTimeout(closeStatusMsg, 6000);
  }

  return (
    <Fragment>
      <div>
        <div className="create-container">
          <button className="create" onClick={addStudentM}>
            <p>Add a new student</p>
          </button>
          <button className="create" onClick={addAssignmentM}>
            <p>Add a new assignment</p>
          </button>
        </div>
        <div className="delete-container">
          <button className="delete" onClick={deleteStudentM}>
            <p>Remove a student</p>
          </button>
          <button className="delete" onClick={deleteAssignmentM}>
            <p>Remove an assignment</p>
          </button>
        </div>
      </div>
      <StatusMsg
        show={statMsgShow}
        success={statMsgSuccess}
        msg={msg}
        handleClose={closeStatusMsg}
      />
      <Modal show={studentModal} handleClose={closeModal} label={"Add Student"}>
        <form onSubmit={createStudent}>
          <div>
            <label htmlFor="add_student_username">
              Student Name <span aria-hidden="true">(required)</span>
            </label>
            <input
              type="text"
              name="username"
              id="add_student_username"
              onChange={studentChange}
              aria-required="true"
              required
            />
          </div>
          <div>
            <label htmlFor="add_student_password">
              Student Password <span aria-hidden="true">(required)</span>
            </label>
            <input
              type="text"
              name="password"
              id="add_student_password"
              onChange={studentChange}
              aria-required="true"
              required
            />
          </div>
          <div>
            <label htmlFor="add_student_email">
              Student Email <span aria-hidden="true">(required)</span>
            </label>
            <input
              type="text"
              name="email"
              id="add_student_email"
              onChange={studentChange}
              aria-required="true"
              required
            />
          </div>
          <button type="submit">Add Student</button>
        </form>
      </Modal>
      <Modal
        show={assignmentModal}
        handleClose={closeModal}
        label="Add Assignment"
      >
        <form onSubmit={createAssignment}>
          <div>
            <label htmlFor="assignment_add_name">
              Assignment Name <span aria-hidden="true">(required)</span>
            </label>
            <input
              type="text"
              name="name"
              id="assignment_add_name"
              onChange={assignmentChange}
              aria-required="true"
              required
            />
          </div>
          <div>
            <label htmlFor="assignment_add_description">
              Assignment Description <span aria-hidden="true">(required)</span>
            </label>
            <input
              type="text"
              name="description"
              id="assignment_add_description"
              onChange={assignmentChange}
              aria-required="true"
              required
            />
          </div>
          <div>
            <label htmlFor="add_assignment_kind">Assignment Type</label>
            <select name="kind" onChange={assignmentChange}>
              <option value="">Kind of Assignment</option>
              <option value="homework">Homework</option>
              <option value="quiz">Quiz</option>
              <option value="exam">Exam</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={assignmentData.kind === "" ? true : false}
            aria-disabled={assignmentData.kind === "" ? true : false}
          >
            Add Assignment
          </button>
        </form>
      </Modal>
      <Modal
        show={rmAssignmentModal}
        handleClose={closeModal}
        label={"Remove Assignment"}
      >
        <form onSubmit={deleteAssignment}>
          <div>
            <label htmlFor="rm_assignment_name">
              Assignment Name <span aria-hidden="true">(required)</span>
            </label>
            <input
              type="text"
              name="name"
              id="rm_assignment_name"
              onChange={assignmentChange}
              aria-required="true"
              required
            />
          </div>
          <button
            type="submit"
            disabled={assignmentData.name === "" ? true : false}
          >
            Delete Assignment
          </button>
        </form>
      </Modal>
      <Modal
        show={rmStudentModal}
        handleClose={closeModal}
        label={"Remove Student"}
      >
        <form onSubmit={deleteStudent}>
          <div>
            <label htmlFor="rm_student_email">
              Student Email <span aria-hidden="true">(required)</span>
            </label>
            <input
              type="email"
              name="email"
              id="rm_student_email"
              onChange={studentChange}
              aria-required="true"
              required
            />
          </div>
          <button
            type="submit"
            disabled={studentData.email === "" ? true : false}
            aria-disabled={studentData.email === "" ? true : false}
          >
            Delete Student
          </button>
        </form>
      </Modal>
    </Fragment>
  );
};
