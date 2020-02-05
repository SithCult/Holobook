//> React
// Contains all the functionality necessary to define React components
import React from 'react';
// DOM bindings for React Router
import { Route, Switch } from 'react-router-dom';

//> Components
/**
 * HomePage: Register page
 * ProfilePage: Profile of the member
 * LoginPage: Login page
 */
import {
  HomePage,
  ProfilePage,
  LoginPage,
  ImperialBasicTraining,
} from './components/pages';

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/me' component={ProfilePage} />
        <Route exact path='/login' component={LoginPage} />
        <Route exact path="/basic" component={ImperialBasicTraining} />
        <Route
          render={function () {
            return <h1>Not Found</h1>;
          }}
        />
      </Switch>
    );
  }
}

export default Routes;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
