import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { QUERY } from "../../utils/queries";
import { Tiles } from "../Tiles";

export const Home = () => {
  const { data, loading } = useQuery(QUERY);
  if (!data) return <h1>You need to be logged in for this</h1>;
  if (loading) return <h2>Loading</h2>;
  return (
    <>
      <h1>Welcome {data.self.username}</h1>
      <Tiles student={data.self.student} />
    </>
  );
};
