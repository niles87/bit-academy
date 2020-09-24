import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Assignments } from "./components/Assignments";
import { Attendance } from "./components/Attendance";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Container } from "./components/Container";
import { Nav } from "./components/Nav";
import "./App.css";

function App() {
  const Default = () => (
    <Fragment>
      <Nav />
      <Container>
        <Route exact path="/assignments" component={Assignments} />
        <Route exact path="/attendance" component={Attendance} />
        <Route exact path="/home" component={Home} />
      </Container>
    </Fragment>
  );

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route component={Default} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
