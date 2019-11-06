import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "./App.css";

import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Jumbotron from "./components/Jumbotron";
import Information from "./components/Information";
import OurHistory from "./components/OurHistory";
import Footer from "./components/Footer";
import BuyForm from "./components/BuyForm";
import VarietyList from "./components/VarietyList";

function App() {
  const [docs, setDocs] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => {
      console.log("Connected to ws");

      ws.onmessage = msg => {
        console.log("Got ws data", JSON.parse(msg.data));
        setDocs(JSON.parse(msg.data));
      };
    };

    fetch("data")
      .then(res => res.json())
      .then(data => {
        console.log("Got data", data);
        if (data.err) {
          setErr(JSON.stringify(data.msg));
        } else {
          setDocs(data);
        }
      });
  }, []);

  const renderDocs = () => docs.map(d => <div key={d.name}>{d.name}</div>);
  return (
    <Router>
      <div className="App container-fluid">
        <Header />
        <Navbar />
  // Deberían asignar algún route a '/login' porque no lleva a ningún contenido, solo muestra el header y el footer
        <Route
          exact
          path="/"
          render={props => (
            <React.Fragment>
              <Jumbotron />
              <div className="divider"></div>
              <Information />
            </React.Fragment>
          )}
        />
        <Route
          exact
          path="/order"
          render={props => (
            <React.Fragment>
              <BuyForm />
            </React.Fragment>
          )}
        />
        <Route
          exact
          path="/varieties"
          render={props => (
            <React.Fragment>
              <VarietyList />
            </React.Fragment>
          )}
        />
        <Route
          exact
          path="/ourHistory"
          render={props => (
            <React.Fragment>
              <OurHistory />
            </React.Fragment>
          )}
        />
        <div>{err}</div>
        {renderDocs()}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
