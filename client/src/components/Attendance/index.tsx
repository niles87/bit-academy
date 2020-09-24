import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { QUERY } from "../../utils/queries";
import { Student, Teacher } from "./attendance";

export const Attendance = () => {
  const { data, loading } = useQuery(QUERY);
  if (!data) return <h1>You need to login to use this</h1>;
  if (loading) return <h1>Loading</h1>;
  console.log("query", data.self);
  if (data.self.student) return <Student user={data.self} />;
  else return <Teacher user={data.self} />;
};
