import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { Home } from "./components/Home";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/home" component={Home} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
