import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { QUERY } from "../../utils/queries";

export const CreateRoom = (props: any) => {
  const { data, loading } = useQuery(QUERY);
  if (!data) return <h1>You need to login to use this</h1>;
  if (loading) return <h1>Loading</h1>;
  const room = () => {
    const id = data.self.id;
    if (!data.self.student) {
      props.history.push(`/classroom/${id}`);
    } else {
      return <h2>You need to be a teacher for this</h2>;
    }
  };

  return <button onClick={room}>Create Room</button>;
};
