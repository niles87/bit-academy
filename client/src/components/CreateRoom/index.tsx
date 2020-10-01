import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { QUERY } from "../../utils/queries";

export const CreateRoom = (props: any) => {
  const { data, loading } = useQuery(QUERY);
  if (!data) return <h1>You need to login to use this</h1>;
  if (loading) return <h1>Loading</h1>;
  const room = (): void => {
    const id = data.self.id;
    if (!data.self.student) {
      props.history.push(`/classroom/${id}`);
    } else {
      props.history.push(`/classroom/${data.self.teacher}`);
    }
  };

  return (
    <button onClick={room}>
      {data.self.student ? "Join Class" : "Create Room"}
    </button>
  );
};
