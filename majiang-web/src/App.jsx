import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route, Redirect,
} from "react-router-dom";
import Login from "./page/login";
import RouteGuard from "./component/RouteGuard";
import Home from "./page/home";
import NotFound from "./page/404/404";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/home">
          <RouteGuard>
            <Home/>
          </RouteGuard>
        </Route>
        <Route path='/404' component={NotFound} />
        <Redirect to="/login" />
      </Switch>
    </Router>
  );
}

export default App;
