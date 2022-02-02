import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes as Switch,
} from "react-router-dom";
import { Assignments } from "./components/Assignments";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Create } from "./components/Create";
import { Classroom } from "./components/Classroom";
import { Layout } from "./components/Layout";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="create" element={<Create />} />
            <Route path="classroom/:id" element={<Classroom />} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
