import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Assignments } from "./components/Assignments";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Container } from "./components/Container";
import { Nav } from "./components/Nav";
import { Create } from "./components/Create";
import { Classroom } from "./components/Classroom";
import { CreateRoom } from "./components/CreateRoom";
import "./App.css";

function App() {
  const Default = () => (
    <Fragment>
      <Nav />
      <Container>
        <Route exact path="/assignments" component={Assignments} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/create" component={Create} />
        <Route exact path="/classroom" component={CreateRoom} />
        <Route path="/classroom/:roomId" component={Classroom} />
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
