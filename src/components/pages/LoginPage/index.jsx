//> React
// Contains all the functionality necessary to define React components
import React from 'react';

//> Additional modules
// Fade In Animation
import FadeIn from 'react-fade-in';

//> Redux
// Connect
import { connect } from 'react-redux';
// Actions
import { signIn } from '../../../store/actions/authActions';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBContainer,
  MDBRow,
  MDBCol,
} from 'mdbreact';

//> Components
// To be added

//> CSS
import './loginpage.scss';

//> Images
// To be added

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    
  };

  componentDidMount = () => {
    
  }

  render() {
    const { auth } = this.props;

    console.log(auth);

    return (
      null
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (credentials) => dispatch(signIn(credentials))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(LoginPage);

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Christian Aichner
 */
