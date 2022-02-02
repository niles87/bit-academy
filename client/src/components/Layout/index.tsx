import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";
import { Container } from "../Container";
import { Nav } from "../Nav";
import { Footer } from "../Footer";

export const Layout = () => {
  return (
    <Fragment>
      <Nav />
      <Container>
        <Outlet />
      </Container>
      <Footer />
    </Fragment>
  );
};
