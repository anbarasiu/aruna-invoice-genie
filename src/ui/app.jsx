import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { Provider } from "react-redux";
import NavBar from "./components/nav-bar";
import Create from "./components/invoice/create";
import Display from "./components/invoice/display";
import Product from "./components/product";
import Report from "./components/report";

export default store => () =>
    <Provider store={store}>
      <div>
        <Router>
          <div>
            <NavBar />
            <Switch>
              <Route exact path="/invoice/create" component={Create} />
              <Route exact path="/invoice/:id" component={Display} />
              <Route exact path="/product" component={Product} />
              <Route exact path="/report" component={Report} />
              <Route path="/" component={Create} />
            </Switch>
          </div>
        </Router>
      </div>
    </Provider>
