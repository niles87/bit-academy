import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes as Switch,
} from "react-router-dom";
import { Assignments } from "./components/Assignments";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Container } from "./components/Container";
import { Nav } from "./components/Nav";
import { Create } from "./components/Create";
import { Classroom } from "./components/Classroom";
import { Footer } from "./components/Footer";
import "./App.css";

function App() {
  const Default = () => (
    <Fragment>
      <Nav />
      <Container>
        <Switch>
          <Route index element={<Home />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/create" element={<Create />} />
          <Route path="/classroom/:roomId" element={<Classroom />} />
        </Switch>
      </Container>
      <Footer />
    </Fragment>
  );

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard/*" element={<Default />} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
